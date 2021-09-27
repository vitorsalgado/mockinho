import { Call } from '@grpc/grpc-js'
import { RpcCallContext } from './RpcCallContext'

interface Extension {
  context: RpcCallContext
}

export type RpcCall = Call & Extension
