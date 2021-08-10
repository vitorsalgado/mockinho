import { MockProvider } from './MockProvider'

export interface MockProviderFactory<Config> {
  build(configurations: Config): MockProvider
}
