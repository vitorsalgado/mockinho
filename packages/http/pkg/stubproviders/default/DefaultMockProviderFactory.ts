import { MockProviderFactory } from '../MockProviderFactory'
import { DefaultConfigurations } from '../../types'
import { MockProvider } from '../MockProvider'
import { DefaultMockProvider } from './DefaultMockProvider'

export class DefaultMockProviderFactory implements MockProviderFactory<DefaultConfigurations> {
  build(configurations: DefaultConfigurations): MockProvider {
    return new DefaultMockProvider(configurations)
  }
}
