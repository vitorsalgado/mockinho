import * as grpc from '@grpc/grpc-js'
import { ServerReadableStream } from '@grpc/grpc-js'
import { findMockForRequest } from '@mockdog/core'
import { FindMockResult } from '@mockdog/core'
import { RpcContext } from '../RpcContext.js'
import { RpcCallContext } from '../RpcCallContext.js'
import { UnaryCallback } from '../types.js'
import { ClientStreamingHandler } from '../types.js'
import { RpcConfiguration } from '../config/mod.js'
import { RpcCallArgs } from '../RpcCallArgs.js'
import { noMatchErrorMessage } from './noMatchErrorMessage.js'
import { UnaryExtendedCall } from './UnaryExtendedCall.js'
import { ClientStreamingArgs } from './ClientStreamingArgs.js'
import { RpcMock } from './RpcMock.js'
import { UnaryResponse } from './UnaryResponse.js'

export function ClientStreamingMockFinderHandler(
  context: RpcContext
): (methodContext: RpcCallContext) => ClientStreamingHandler {
  return function (callContext: RpcCallContext): ClientStreamingHandler {
    return function (call: ServerReadableStream<unknown, unknown>, callback: UnaryCallback): void {
      ;(call as unknown as UnaryExtendedCall).context = callContext

      let result: FindMockResult<RpcMock> | undefined

      call.on('data', data => {
        if (result && result.hasMatch()) {
          return
        }

        const args = new ClientStreamingArgs(
          callContext.service,
          callContext.serviceMethod,
          callContext.path,
          call,
          data
        )

        result = findMockForRequest<
          RpcCallArgs<ServerReadableStream<unknown, unknown>>,
          RpcMock,
          RpcConfiguration
        >(args, context)
      })

      call.on('end', () => {
        if (!result) {
          throw new Error('Invalid state. Result must be defined.')
        }

        if (result.hasMatch()) {
          result
            .matched()
            .responseBuilder<ServerReadableStream<unknown, unknown>, UnaryResponse>()(
              context,
              call,
              result.matched()
            )
            .then(response => {
              const replier = () =>
                callback(response.error, response.data, response.metadata, response.flags)

              if (response.delay) {
                setTimeout(replier, response.delay)
                return
              }

              replier()
            })
            .catch(error => callback(error))

          return
        }

        callback({
          code: grpc.status.UNIMPLEMENTED,
          message: 'Request was not matched.',
          details: noMatchErrorMessage(result)
        })
      })
    }
  }
}
