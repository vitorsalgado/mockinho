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

    return files
      .map(item =>
        item.mockFile.map(mock => buildMockFromFile(configurations, mock, item.filename))
      )
      .flatMap(x => x)
  }
}
