import { findMockForRequest } from '@mockdog/core'
import { RpcContext } from '../RpcContext'
import { RpcCallContext } from '../RpcCallContext'
import { ServerStreamingHandler } from '../types'
import { ServerStreamingCall } from '../types'
import { RpcConfiguration } from '../config'
import { RpcMock } from './RpcMock'
import { ServerStreamingExtendedCall } from './ServerStreamingExtendedCall'
import { ServerStreamingResponse } from './ServerStreamingResponse'
import { noMatchError } from './noMatchError'

export function ServerStreamingMockFinderHandler(
  context: RpcContext
): (methodContext: RpcCallContext) => ServerStreamingHandler {
  return function (callContext: RpcCallContext): ServerStreamingHandler {
    return function (call: ServerStreamingCall): void {
      const extendedCall = call as unknown as ServerStreamingExtendedCall
      extendedCall.context = callContext

      const result = findMockForRequest<ServerStreamingExtendedCall, RpcMock, RpcConfiguration>(
        extendedCall,
        context
      )

      if (!result.hasMatch()) {
        call.write(noMatchError(result))
        return
      }

      const mock = result.matched()

      mock
        .responseBuilder<ServerStreamingResponse>()(context, extendedCall, mock)
        .then(async response => {
          if (response.metadata) {
            call.sendMetadata(response.metadata)
          }

          const replier = () => {
            response.stream.pipe(call)
          }

          if (response.delay) {
            setTimeout(replier, response.delay)
            return
          }

          replier()
        })
    }
  }
}
