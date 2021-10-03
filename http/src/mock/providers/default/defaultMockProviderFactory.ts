import { loadMockFiles } from '@mockdog/core'
import { HttpConfiguration } from '../../../config'
import { HttpMockBuilder } from '../..'
import { HttpMockProvider } from '../HttpMockProvider'
import { buildMockFromFile } from './buildMockFromFile'
import { MockFile } from './MockFile'
import MockFileSchema from './MockFileSchema'

export function defaultMockProviderFactory(configurations: HttpConfiguration): HttpMockProvider {
  return async function (): Promise<Array<HttpMockBuilder>> {
    if (!configurations.mockFilesEnabled) {
      return []
    }

    const files = await loadMockFiles<MockFile>(
      configurations.mockDirectory,
      [
        `.${configurations.mockFilesExtension}.json`,
        `.${configurations.mockFilesExtension}.yml`,
        `.${configurations.mockFilesExtension}.yaml`
      ],
      MockFileSchema
    )

    const mocks: Array<HttpMockBuilder> = []

    for (const item of files) {
      for (const mock of item.mockFile) {
        mocks.push(await buildMockFromFile(configurations, mock, item.filename))
      }
    }

    return mocks
  }
}
