import { BodyType } from '../types'
import { Cookie } from './Cookie'
import { ClearCookie } from './Cookie'

export class HttpResponseFixture {
  constructor(
    public readonly status: number,
    public readonly headers: Record<string, string> = {},
    public readonly body: BodyType = null,
    public readonly cookies: Array<Cookie> = [],
    public readonly cookiesToClear: Array<ClearCookie> = [],
    public readonly delay: number = 0,
    public readonly proxyTo: string = '',
    public readonly proxyHeaders: Record<string, string> = {}
  ) {}

  hasDelay = (): boolean => this.delay > 0
}
