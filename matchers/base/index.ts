export type Result = {
  name: string
  pass: boolean
  message(): string
  onMockServed?(): void
}

export type Matcher<V = any> = (value: V) => Result
