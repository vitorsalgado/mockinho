import { HttpContext } from './HttpContext'
import { DefaultConfigurations } from './types'
import { HttpStub } from './stub'
import { ok } from './stub'

export function testHttpContext(): HttpContext {
  return new HttpContext<DefaultConfigurations>({} as any)
}

export function testHttpMatcherContext(): any {
  return {
    context: testHttpContext(),
    stub: new HttpStub('test', 'test-stub', 1, 'code', '', [], ok(), new Map()),
    req: {
      url: '/test',
      method: 'get'
    }
  }
}
