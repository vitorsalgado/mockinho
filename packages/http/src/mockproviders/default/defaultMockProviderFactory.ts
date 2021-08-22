import { HttpConfiguration } from '../../config'
import { HttpServer } from '../../HttpServer'
import { HttpMockBuilder } from '../../mock'
import { MockProvider } from '../MockProvider'
import { loadMockFiles } from './loadMockFiles'
import { buildMockFromFile } from './buildMockFromFile'

export function defaultMockProviderFactory(
  configurations: HttpConfiguration,
  _server: HttpServer
): MockProvider {
  return async function (): Promise<Array<HttpMockBuilder>> {
    if (!configurations.isMockFilesEnabled) {
      return []
    }

    const files = await loadMockFiles(configurations.mocksDirectory, [
      `.${configurations.mocksExtension}.json`,
      `.${configurations.mocksExtension}.yml`,
      `.${configurations.mocksExtension}.yaml`
    ])

    return files
      .map(item =>
        item.mockFile.map(mock => buildMockFromFile(configurations, mock, item.filename))
      )
      .flatMap(x => x)
  }
}
