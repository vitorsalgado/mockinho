import * as grpc from '@grpc/grpc-js'
import { UntypedServiceImplementation } from '@grpc/grpc-js'
import * as ProtoLoader from '@grpc/proto-loader'
import { listFilenames } from '@mockdog/core'
import { MockServer } from '@mockdog/core'
import { RpcContext } from './RpcContext'
import { RpcConfiguration } from './config'
import { OperationType } from './OperationType'
import { Method } from './types'
import { UnaryMockFinderHandler } from './mock/UnaryMockFinderHandler'
import { RpcServerInfo } from './RpcServerInfo'

export class RpcServer implements MockServer<RpcServerInfo> {
  private readonly context: RpcContext
  private readonly configuration: RpcConfiguration
  private readonly server: grpc.Server
  private readonly information: RpcServerInfo

  constructor(context: RpcContext) {
    this.context = context
    this.configuration = context.configuration
    this.server = new grpc.Server(this.configuration.channelOptions)
    this.information = {
      port: 0,
      address: this.configuration.address
    }
  }

  initialSetup(): void {
    const grpcObject = RpcServer.loadPackageDefinition(this.configuration)

    for (const [, entries] of Object.entries(grpcObject)) {
      for (const [, definition] of Object.entries(entries).filter(
        ([, value]) => typeof value === 'function'
      )) {
        const methods: UntypedServiceImplementation = {}

        for (const [key, operation] of Object.entries(definition.service) as Array<
          [string, Method]
        >) {
          const method = operation.originalName
            ? operation.originalName
            : `${key.charAt(0).toLowerCase()}${key.substr(1)}`
          const type = RpcServer.operationType(operation)

          let mockFinder

          switch (type) {
            case OperationType.UNARY:
              mockFinder = UnaryMockFinderHandler(this.context)
              break
            default:
              mockFinder = UnaryMockFinderHandler(this.context)
            // throw new Error(`No Mock Finder Handler found for the type: ${type.toString()}`)
          }

          methods[method] = mockFinder({
            service: definition.name,
            serviceMethod: method,
            path: operation.path
          })
        }

        this.server.addService(definition.service, methods)
      }
    }
  }

  start(): Promise<RpcServerInfo> {
    return new Promise((resolve, reject) =>
      this.server.bindAsync(
        this.configuration.address,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            return reject(error)
          }

          this.server.start()
          this.information.port = port
          this.information.address = `${this.configuration.address.substr(
            0,
            this.configuration.address.indexOf(':')
          )}:${port}`

          return resolve(this.information)
        }
      )
    )
  }

  async close(): Promise<void> {
    this.server.forceShutdown()
  }

  info(): RpcServerInfo {
    return this.information
  }

  // region Utils

  private static loadPackageDefinition(configuration: RpcConfiguration): grpc.GrpcObject {
    if (configuration.packageDefinition) {
      return grpc.loadPackageDefinition(configuration.packageDefinition)
    }

    const protos: Array<string> = []

    if (configuration.protoFiles) {
      protos.push(...configuration.protoFiles)
    }

    if (configuration.protoFilesDirectories) {
      configuration.protoFilesDirectories.forEach(dir =>
        protos.push(...listFilenames(dir, file => file.includes('.proto')))
      )
    }

    const packageDefinition = ProtoLoader.loadSync(protos, configuration.protoLoaderOptions)

    return grpc.loadPackageDefinition(packageDefinition)
  }

  private static operationType(operation: Method): OperationType {
    if (!operation.requestStream && !operation.responseStream) {
      return OperationType.UNARY
    } else if (operation.requestStream && !operation.responseStream) {
      return OperationType.CLIENT_STREAM
    } else if (!operation.requestStream && operation.responseStream) {
      return OperationType.SERVER_STREAM
    } else {
      return OperationType.DUPLEX
    }
  }

  // endregion
}
