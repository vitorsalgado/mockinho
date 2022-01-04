import * as grpc from '@grpc/grpc-js'
import { ServerReadableStream } from '@grpc/grpc-js'
import { findMockForRequest } from '@mockdog/core'
import { FindMockResult } from '@mockdog/core'
import { RpcContext } from '../RpcContext'
import { RpcCallContext } from '../RpcCallContext'
import { UnaryCallback } from '../types'
import { ClientStreamingHandler } from '../types'
import { RpcConfiguration } from '../config'
import { RpcCallArgs } from '../RpcCallArgs'
import { noMatchErrorMessage } from './noMatchErrorMessage'
import { UnaryExtendedCall } from './UnaryExtendedCall'
import { ClientStreamingArgs } from './ClientStreamingArgs'
import { RpcMock } from '.'
import { UnaryResponse } from '.'

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
