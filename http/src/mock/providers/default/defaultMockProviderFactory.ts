import { Configuration } from '../../../config'
import { HttpServer } from '../../../HttpServer'
import { HttpMockBuilder } from '../..'
import { MockProvider } from '../MockProvider'
import { loadMockFiles } from './loadMockFiles'
import { buildMockFromFile } from './buildMockFromFile'

export function defaultMockProviderFactory(
  configurations: Configuration,
  _server: HttpServer
): MockProvider {
  return async function (): Promise<Array<HttpMockBuilder>> {
    if (!configurations.mockFilesEnabled) {
      return []
    }

    const files = await loadMockFiles(configurations.mockDirectory, [
      `.${configurations.mockFilesExtension}.json`,
      `.${configurations.mockFilesExtension}.yml`,
      `.${configurations.mockFilesExtension}.yaml`
    ])

    const mocks: Array<HttpMockBuilder> = []

    for (const item of files) {
      for (const mock of item.mockFile) {
        mocks.push(await buildMockFromFile(configurations, mock, item.filename))
      }
    }

    return mocks
  }
}
