import { MockProvider } from './MockProvider.js'

export interface MockProviderFactory<MOCK_BUILDER = unknown, APP = unknown> {
  (instance: APP): MockProvider<MOCK_BUILDER>
}
