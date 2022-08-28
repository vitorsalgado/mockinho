export interface Context<R = unknown> {
  get request(): R

  onRequestDidMatch(action: () => Promise<void> | void): void
}

export type Matcher<V = any, R = any> = (value: V, ctx: Context<R>) => boolean
