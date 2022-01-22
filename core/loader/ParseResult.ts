export interface ParseResult<T> {
  mocks: Array<T>
  file: string
  error?: unknown
}
