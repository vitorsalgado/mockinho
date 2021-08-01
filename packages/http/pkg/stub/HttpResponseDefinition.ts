import { BodyType } from '../types'

export class HttpResponseDefinition {
  constructor(
    public readonly status: number,
    public readonly headers: Record<string, string>,
    public readonly body: BodyType,
    public readonly delay: number
  ) {}

  hasDelay = (): boolean => this.delay > 0
}
