import * as grpc from '@grpc/grpc-js'
import { findMockForRequest } from '@mockdog/core'
import { RpcContext } from '../RpcContext.js'
import { RpcCallContext } from '../RpcCallContext.js'
import { UnaryHandler } from '../types.js'
import { UnaryCall } from '../types.js'
import { UnaryCallback } from '../types.js'
import { RpcConfiguration } from '../config/mod.js'
import { UnaryExtendedCall } from './UnaryExtendedCall.js'
import { noMatchErrorMessage } from './noMatchErrorMessage.js'
import { extendCall } from './extendCall.js'
import { RpcMock } from './RpcMock.js'
import { UnaryResponse } from './UnaryResponse.js'

export function UnaryMockFinderHandler(
  context: RpcContext,
): (methodContext: RpcCallContext) => UnaryHandler {
  return function (callContext: RpcCallContext): UnaryHandler {
    return function (call: UnaryCall, callback: UnaryCallback): void {
      const extendedCall = extendCall<UnaryExtendedCall>(call, callContext)

      const result = findMockForRequest<UnaryExtendedCall, RpcMock, RpcConfiguration>(
        extendedCall,
        context,
      )

      if (result.hasMatch()) {
        const mock = result.matched()

        mock
          .responseBuilder<UnaryCall, UnaryResponse>()(context, extendedCall, mock)
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
        details: noMatchErrorMessage(result),
      })
    }
  }
}
