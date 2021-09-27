import { ChannelOptions, ServerCredentials } from '@grpc/grpc-js'
import { Options as ProtoLoaderOptions } from '@grpc/proto-loader/build/src/util'
import { PackageDefinition } from '@grpc/proto-loader'
import { notNull } from '@mockdog/core'
import { notEmpty } from '@mockdog/core'
import { notBlank } from '@mockdog/core'
import { RpcConfiguration } from './RpcConfiguration'
import { Defaults } from './Defaults'

export class RpcConfigurationBuilder {
  protected _protoFiles: Array<string> = []
  protected _protoDirectories?: Array<string>
  protected _packageDefinition?: PackageDefinition
  protected _channelOptions?: ChannelOptions
  protected _serverCredentials?: ServerCredentials
  protected _protoLoaderOptions?: ProtoLoaderOptions
  protected _address: string = Defaults.address

  address(address: string): RpcConfigurationBuilder {
    notBlank(address)

    this._address = address

    return this
  }

  protoFiles(...files: Array<string>): RpcConfigurationBuilder {
    notEmpty(files)

    this._protoDirectories = files

    return this
  }

  protoDirectories(...dir: Array<string>): RpcConfigurationBuilder {
    notNull(dir)
    notEmpty(dir)

    this._protoDirectories = dir

    return this
  }

  packageDefinition(packageDefinition: PackageDefinition): RpcConfigurationBuilder {
    notNull(packageDefinition)

    this._packageDefinition = packageDefinition

    return this
  }

  build(): RpcConfiguration {
    return {
      mode: 'verbose',
      logLevel: 'error',
      address: this._address,
      protoFiles: this._protoFiles,
      protoFilesDirectories: this._protoDirectories,
      packageDefinition: this._packageDefinition,
      channelOptions: this._channelOptions,
      protoLoaderOptions: this._protoLoaderOptions
        ? this._protoLoaderOptions
        : Defaults.protoLoaderOptions,
      serverCredentials: this._serverCredentials
        ? this._serverCredentials
        : Defaults.serverCredentials
    }
  }
}
