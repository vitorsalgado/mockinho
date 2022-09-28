export interface MockProvider<MOCK_BUILDER = unknown> {
  (): Promise<Array<MOCK_BUILDER>>
}

export interface MockProviderFactory<MOCK_BUILDER = unknown, APP = unknown> {
  (instance: APP): MockProvider<MOCK_BUILDER>
}
