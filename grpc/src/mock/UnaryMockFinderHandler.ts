import * as grpc from '@grpc/grpc-js'
import { findMockForRequest } from '@mockdog/core'
import { RpcContext } from '../RpcContext'
import { RpcCallContext } from '../RpcCallContext'
import { UnaryHandler } from '../types'
import { UnaryCall } from '../types'
import { UnaryCallback } from '../types'
import { RpcCall } from '../RpcCall'
import { RpcConfiguration } from '../config'
import { unmatchedText } from './unmatchedText'
import { RpcMock } from '.'
import { UnaryResponse } from '.'

export function UnaryMockFinderHandler(
  context: RpcContext
): (methodContext: RpcCallContext) => UnaryHandler {
  return function (callContext: RpcCallContext): UnaryHandler {
    return function (call: UnaryCall, callback: UnaryCallback): void {
      const extendedCall: RpcCall = call as unknown as RpcCall
      extendedCall.context = callContext

      const result = findMockForRequest<RpcCall, RpcConfiguration, RpcMock>(extendedCall, context)

      if (result.hasMatch()) {
        const mock = result.matched()

        mock
          .responseBuilder<UnaryResponse>()(context, extendedCall, mock)
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

      // eslint-disable-next-line node/no-callback-literal
      callback({
        code: grpc.status.UNIMPLEMENTED,
        message: 'Request was not matched.',
        details: unmatchedText(result)
      })
    }
  }
}
