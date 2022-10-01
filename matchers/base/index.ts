export type OnMockServed = () => void | Promise<void>

export type Result = {
  name: string
  pass: boolean
  message(): string
  onMockServed?: OnMockServed
}

export type Matcher<V = any> = (value: V) => Result

export type Predicate<V = any> = (value: V) => boolean
