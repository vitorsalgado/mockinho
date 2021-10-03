import { ChannelOptions } from '@grpc/grpc-js'
import { ServerCredentials } from '@grpc/grpc-js/src/server-credentials'
import { Options as ProtoLoaderOptions } from '@grpc/proto-loader'
import { PackageDefinition } from '@grpc/proto-loader'
import { Configuration } from '@mockdog/core'

export interface RpcConfiguration extends Configuration {
  address: string
  protoFiles: Array<string>
  protoFilesDirectories?: Array<string>
  packageDefinition?: PackageDefinition
  channelOptions?: ChannelOptions
  serverCredentials: ServerCredentials
  protoLoaderOptions: ProtoLoaderOptions
}
