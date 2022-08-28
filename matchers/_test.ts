import { Context } from './base.js'

export class NoopContext<T> implements Context<T> {
  request: any

  onRequestDidMatch(action: () => Promise<void> | void): void {
    action()
  }
}

export const noop = <T>(): Context => new NoopContext<T>()
