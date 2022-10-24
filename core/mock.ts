import crypto from 'crypto'
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

export interface MockBuilder<M, D> {
  build(deps: D): M
}

export interface ReplyArgs<C> {
  config: C
}

export interface Reply<SRV_REQ, SRV_RES, C, RES> {
  build(req: SRV_REQ, res: SRV_RES, args: ReplyArgs<C>): Promise<RES | null | void>
}

export interface MockInit<SRV_REQ, SRV_RES, C, RES> {
  id: string
  name: string
  priority: number
  enabled: boolean
  source: string
  sourceDetail: string
  matchers: Array<MatcherSpecification<any, SRV_REQ>>
  postActions: Array<PostAction<SRV_REQ>>
  hits: number
  reply: Reply<SRV_REQ, SRV_RES, C, RES>
}

export class Mock<SRV_REQ = any, SRV_RES = any, C = any, RES = any> {
  public static readonly DefSource = 'code'
  private static readonly NoopReply = { build: () => Promise.resolve(null) }

  public id: string
  public name: string
  public priority: number
  public enabled: boolean
  public source
  public sourceDetail: string
  public matchers: Array<MatcherSpecification<any, SRV_REQ>>
  public postActions: Array<PostAction<SRV_REQ>>
  public hits: number
  public reply: Reply<SRV_REQ, SRV_RES, C, RES>

  constructor(init: Partial<MockInit<SRV_REQ, SRV_RES, C, RES>> = {}) {
    this.id = init.id === undefined ? crypto.randomUUID() : init.id
    this.name = init.name || ''
    this.priority = init.priority === undefined ? 0 : init.priority
    this.enabled = init.enabled === undefined ? true : init.enabled
    this.source = init.source || Mock.DefSource
    this.sourceDetail = init.sourceDetail || ''
    this.matchers = init.matchers === undefined ? [] : init.matchers
    this.postActions = init.postActions === undefined ? [] : init.postActions
    this.hits = init.hits === undefined ? 0 : init.hits
    this.reply = init.reply === undefined ? Mock.NoopReply : init.reply
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

  requestMatches(request: SRV_REQ): MatchResult {
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

  toString() {
    return `Mock{id=${this.id},name=${this.name},source-type=${this.source},source=${this.sourceDetail}`
  }
}
