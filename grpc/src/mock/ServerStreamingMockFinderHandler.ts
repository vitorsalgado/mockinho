import { findMockForRequest } from '@mockdog/core'
import { RpcContext } from '../RpcContext.js'
import { RpcCallContext } from '../RpcCallContext.js'
import { ServerStreamingHandler } from '../types.js'
import { ServerStreamingCall } from '../types.js'
import { RpcConfiguration } from '../config/mod.js'
import { RpcMock } from './RpcMock.js'
import { ServerStreamingExtendedCall } from './ServerStreamingExtendedCall.js'
import { ServerStreamingResponse } from './ServerStreamingResponse.js'
import { noMatchError } from './noMatchError.js'

export function ServerStreamingMockFinderHandler(
  context: RpcContext,
): (methodContext: RpcCallContext) => ServerStreamingHandler {
  return function (callContext: RpcCallContext): ServerStreamingHandler {
    return function (call: ServerStreamingCall): void {
      const extendedCall = call as unknown as ServerStreamingExtendedCall
      extendedCall.context = callContext

      const result = findMockForRequest<ServerStreamingExtendedCall, RpcMock, RpcConfiguration>(
        extendedCall,
        context,
      )

      if (!result.hasMatch()) {
        call.write(noMatchError(result))
        return
      }

      const mock = result.matched()

      mock
        .responseBuilder<ServerStreamingResponse>()(
          context,
          extendedCall as unknown as ServerStreamingResponse,
          mock,
        )
        .then(async response => {
          if (response.metadata) {
            call.sendMetadata(response.metadata)
          }

          const replier = () => {
            ;(response as any).stream.pipe(call)
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
