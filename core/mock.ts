import crypto from 'crypto'
import { Matcher } from 'matchers'
import { stringify } from './internal/stringify.js'

export interface PostActionArgs<R> {
  request: R
}

export interface PostAction<R> {
  run(args: PostActionArgs<R>): Promise<void>
}

export interface MatcherSpecification<VALUE, VALUE_CONTEXT> {
  target: string
  selector: (ctx: VALUE_CONTEXT) => VALUE
  matcher: Matcher<VALUE>
  score: number
}

export type MockSource = 'code' | 'file'

export interface Mismatch {
  name: string
  target: string
  desc: string
}

export interface MatchResult {
  score: number
  ok: boolean
  mismatches: Mismatch[]
}

export interface State {
  scenario: string
  state: string
  requiredState: string
  newState: string
}

export class Mock<TRequest = unknown> {
  constructor(
    public readonly id: string,
    public readonly name: string = '',
    public readonly priority: number = 0,
    public readonly enabled: boolean = true,
    public readonly source: MockSource = 'code',
    public readonly sourceDescription: string = '',
    public readonly matchers: Array<MatcherSpecification<any, TRequest>> = [],
    public readonly postActions: Array<PostAction<TRequest>> = [],
    public hits: number = 0,
    public readonly state: Partial<State> = {},
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
    const result: MatchResult = { score: 0, ok: true, mismatches: [] }

    for (const m of this.matchers) {
      const value = m.selector(request)

      if (m.matcher(value)) {
        result.score += m.score
      } else {
        result.ok = false
        result.mismatches.push({
          name: m.matcher.name, // will be the function name
          target: m.target,
          desc: `${m.target} value ${stringify(value)} didn't match.`,
        })
      }
    }

    return result
  }
}
