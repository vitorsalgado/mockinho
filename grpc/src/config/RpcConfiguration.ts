import { ChannelOptions } from '@grpc/grpc-js'
import { ServerCredentials } from '@grpc/grpc-js/src/server-credentials'
import { Options as ProtoLoaderOptions } from '@grpc/proto-loader'
import { PackageDefinition } from '@grpc/proto-loader'
import { BaseConfiguration } from '@mockdog/core'

export interface RpcConfiguration extends BaseConfiguration {
  address: string
  protoFiles: Array<string>
  protoFilesDirectories?: Array<string>
  packageDefinition?: PackageDefinition
  channelOptions?: ChannelOptions
  serverCredentials: ServerCredentials
  protoLoaderOptions: ProtoLoaderOptions
}
