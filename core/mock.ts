import crypto from 'crypto'
import { Matcher, Result } from '@mockdog/matchers'

export type MockSource = 'code' | 'file'

export interface PostActionArgs<R> {
  request: R
}

export interface PostAction<R> {
  run(args: PostActionArgs<R>): Promise<void> | void
}

export interface MatcherSpecification<VALUE, VALUE_CONTEXT> {
  target: string
  selector: (ctx: VALUE_CONTEXT) => VALUE
  matcher: Matcher<VALUE>
  score: number
}

export interface Mismatch {
  name: string
  target: string
  desc: string
}

export interface MatchResult {
  score: number
  ok: boolean
  results: Result[]
  mismatches: Mismatch[]
}

export class Mock<TRequest = unknown> {
  constructor(
    readonly id: string,
    readonly name: string = '',
    readonly priority: number = 0,
    readonly enabled: boolean = true,
    readonly source: MockSource = 'code',
    readonly sourceDescription: string = '',
    readonly matchers: Array<MatcherSpecification<any, TRequest>> = [],
    readonly postActions: Array<PostAction<TRequest>> = [],
    public hits: number = 0,
  ) {
    if (!this.id) {
      this.id = crypto.randomUUID()
    }
  }

  hit(): void {
    this.hits++
  }

  hasBeenCalled(): boolean {
    return this.hits > 0
  }

  matches(request: TRequest): MatchResult {
    const result: MatchResult = { score: 0, ok: true, mismatches: [], results: [] }

    for (const m of this.matchers) {
      const value = m.selector(request)
      const r = m.matcher(value)

      result.results.push(r)

      if (r.pass) {
        result.score += m.score
      } else {
        result.ok = false
        result.mismatches.push({
          name: r.name,
          target: m.target,
          desc: r.message(),
        })
      }
    }

    return result
  }
}
