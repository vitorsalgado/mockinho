import { BodyType } from '../BodyType.js'
import { Cookie } from './Cookie.js'
import { CookieToClear } from './Cookie.js'

export class ResponseFixture {
  constructor(
    public readonly status: number,
    public readonly headers: Record<string, string> = {},
    public readonly body: BodyType = null,
    public readonly cookies: Array<Cookie> = [],
    public readonly cookiesToClear: Array<CookieToClear> = [],
    public readonly delay: number = 0,
    public readonly proxyTo: string = '',
    public readonly proxyHeaders: Record<string, string> = {},
  ) {}

  hasDelay = (): boolean => this.delay > 0
}
