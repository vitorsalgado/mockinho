import { BodyType } from '../types'
import { Cookie } from './Cookie'
import { ClearCookie } from './Cookie'

export class HttpResponseDefinition {
  constructor(
    public readonly status: number,
    public readonly headers: Record<string, string>,
    public readonly body: BodyType,
    public readonly cookies: Array<Cookie>,
    public readonly cookiesToClear: Array<ClearCookie>,
    public readonly delay: number
  ) {}

  hasDelay = (): boolean => this.delay > 0
}
