export interface MockProvider<MOCK_BUILDER = unknown> {
  (): Promise<Array<MOCK_BUILDER>>
}
