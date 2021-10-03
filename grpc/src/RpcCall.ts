import { RpcCallContext } from './RpcCallContext'
import { UnaryCall } from './types'

interface Extension {
  context: RpcCallContext
}

export type RpcCall = UnaryCall & Extension
