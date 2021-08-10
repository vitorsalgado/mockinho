import { Configurations } from '../../config'
import { MockProvider } from '../MockProvider'
import { HttpStubBuilder } from '../../stub'
import { loadStubFiles } from './loadStubFiles'
import { buildStubFromFile } from './buildStubFromFile'
import { FieldParser } from './FieldParser'

export class DefaultMockProvider implements MockProvider {
  constructor(
    private readonly configurations: Configurations,
    private readonly fieldParsers: Array<FieldParser> = []
  ) {}

  async mocks(): Promise<Array<HttpStubBuilder>> {
    if (!this.configurations.isStubFilesEnabled) {
      return []
    }

    const loaded = await loadStubFiles(this.configurations.stubsDirectory, [
      `.${this.configurations.stubsExtension}.json`,
      `.${this.configurations.stubsExtension}.yml`,
      `.${this.configurations.stubsExtension}.yaml`
    ])

    return loaded
      .map(item =>
        item.stubFile.map(stub =>
          buildStubFromFile(this.configurations, this.fieldParsers, stub, item.filename)
        )
      )
      .flatMap(x => x)
  }

  addFieldParser(...parser: Array<FieldParser>): void {
    this.fieldParsers.push(...parser)
  }
}
