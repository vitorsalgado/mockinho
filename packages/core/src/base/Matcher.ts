export interface Matcher<Arg = void> {
  expectation?: Array<unknown>

  (arg: Arg): boolean
}
