import Path from 'path'
import * as ProtoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import { listFilenames } from '@mockdog/core'

describe.skip('grpc', function () {
  it('should ', function (done) {
    const configuration = {
      protoFiles: [],
      protoFilesDir: Path.join(__dirname, 'proto'),
      mode: 'verbose',
      logLevel: 'info',
      protoLoaderOptions: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      },
      scenarioRepository: null,
      mockRepository: null
    }

    const protos: Array<string> = []

    if (configuration.protoFiles) {
      protos.push(...configuration.protoFiles)
    }

    if (configuration.protoFilesDir) {
      protos.push(...listFilenames(configuration.protoFilesDir, file => file.includes('.proto')))
    }

    const packageDefinition = ProtoLoader.loadSync(protos, configuration.protoLoaderOptions)
    const def = grpc.loadPackageDefinition(packageDefinition).helloworld

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const client = new def.HelloWorldService('localhost:50051', grpc.credentials.createInsecure())

    const meta = new grpc.Metadata()
    meta.add('test-key', 'test-value')

    client.farewell(
      { message: 'test-name' },
      meta,
      function (err: Error | undefined, response: any) {
        // eslint-disable-next-line no-console
        console.log(err, response)
        done(err)
      }
    )
  })
})
