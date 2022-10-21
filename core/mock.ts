import crypto from 'crypto'
import { Response } from 'express'
import { Matcher, Result } from '@mockdog/matchers'

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

export interface MockBuilder<MOCK extends Mock, DEPS> {
  build(deps: DEPS): MOCK
}

export interface ReplyArgs<C> {
  config: C
}

export interface Reply<REQ, RES, C> {
  build(req: REQ, res: RES, args: ReplyArgs<C>): Promise<RES | null | void>
}

export interface MockInit<R = unknown> {
  id: string
  name: string
  priority: number
  enabled: boolean
  source: string
  sourceDetail: string
  matchers: Array<MatcherSpecification<any, R>>
  postActions: Array<PostAction<R>>
  hits: number
}

export class Mock<TRequest = unknown> {
  public id: string
  public name: string
  public priority: number
  public enabled: boolean
  public source
  public sourceDetail: string
  public matchers: Array<MatcherSpecification<any, TRequest>>
  public postActions: Array<PostAction<TRequest>>
  public hits: number

  constructor(init: Partial<MockInit> = {}) {
    this.id = init.id === undefined ? crypto.randomUUID() : init.id
    this.name = init.name || ''
    this.priority = init.priority === undefined ? 0 : init.priority
    this.enabled = init.enabled === undefined ? true : init.enabled
    this.source = init.source || 'code'
    this.sourceDetail = init.sourceDetail || ''
    this.matchers = init.matchers === undefined ? [] : init.matchers
    this.postActions = init.postActions === undefined ? [] : init.postActions
    this.hits = init.hits === undefined ? 0 : init.hits
  }

  inc() {
    this.hits++
  }

  dec() {
    this.hits--
  }

  hasBeenCalled(): boolean {
    return this.hits > 0
  }

  deactivate() {
    this.enabled = false
  }

  activate() {
    this.enabled = true
  }

  hint(): string {
    return `id=${this.id}, name=${this.name}, source=${this.source}${
      this.sourceDetail === '' ? '' : ', source-detail=' + this.sourceDetail
    }`
  }

  requestMatches(request: TRequest): MatchResult {
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
