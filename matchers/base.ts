export interface Matcher<V = any> {
  (value: V): boolean
}
