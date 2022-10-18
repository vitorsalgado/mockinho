import { Mode } from '@mockdog/core'
import { HttpConfigurationBuilder } from '../../config_builder.js'
import { rec } from '../../../feat/rec/index.js'

export function envReader(env: Record<string, unknown>) {
  return async function (builder: HttpConfigurationBuilder): Promise<void> {
    if (env.MOCK_MODE) builder.mode(env.MOCK_MODE as Mode)

    if (env.MOCK_HTTP_PORT) builder.httpPort(parseInt(env.MOCK_HTTP_PORT as string))
    if (env.MOCK_HTTP_HOST) builder.httpHost(env.MOCK_HTTP_HOST as string)

    if (env.MOCK_HTTPS_PORT) builder.httpsPort(parseInt(env.MOCK_HTTPS_PORT as string))
    if (env.MOCK_HTTPS_HOST) builder.httpsHost(env.MOCK_HTTPS_HOST as string)

    if (env.MOCK_SERVER_TIMEOUT) builder.timeout(parseInt(env.MOCK_SERVER_TIMEOUT as string))
    if (env.MOCK_DIRECTORY) builder.mockDirectory(env.MOCK_DIRECTORY as string)
    if (env.MOCK_FILES_EXTENSION) builder.mockFileExtension(env.MOCK_FILES_EXTENSION as string)

    if (env.MOCK_RECORD) {
      const recSpec = rec()

      if (env.MOCK_RECORD_DESTINATION) recSpec.destination(env.MOCK_RECORD_DESTINATION as string)
      if (env.MOCK_RECORD_CAPTURE_REQUEST_HEADERS)
        recSpec.captureRequestHeaders(
          (env.MOCK_RECORD_CAPTURE_REQUEST_HEADERS as string).split(',') as Array<string>,
        )
      if (env.MOCK_RECORD_CAPTURE_RESPONSE_HEADERS)
        recSpec.captureResponseHeaders(
          (env.MOCK_RECORD_CAPTURE_RESPONSE_HEADERS as string).split(',') as Array<string>,
        )

      builder.record(recSpec)
    }

    if (env.MOCK_CORS) builder.enableCors()
    if (env.MOCK_COOKIE_SECRETS) {
      builder.cookieOptions((env.MOCK_COOKIE_SECRETS as string).split(',') as Array<string>)
    }

    if (env.MOCK_PROXY) builder.proxy(env.MOCK_PROXY as string)

    if (env.MOCK_WATCH) builder.watch()
  }
}
