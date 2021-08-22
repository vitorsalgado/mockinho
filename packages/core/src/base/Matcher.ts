export interface Matcher<Arg = void> {
  (arg: Arg): boolean
}
