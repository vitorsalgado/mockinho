import { StateRepository } from '@mockdog/core'
import { equalTo } from '@mockdog/matchers'
import { contentType } from '../../matchers/index.js'
import { Deps, HttpMockBuilder, ok } from '../../mock/index.js'
import { onRequestNotMatched } from '../builtin/onRequestNotMatched.js'

describe('onRequestNotMatched', function () {
  const deps: Deps = { stateRepository: new StateRepository() }

  it('should log without a closest match', function () {
    onRequestNotMatched({
      verbose: false,
      method: 'GET',
      url: 'http://localhost:8080',
      path: '/',
    })
  })

  it('should log with mock without name and id', function () {
    const mock = HttpMockBuilder.newBuilder()
      .expect(contentType('something'))
      .reply(ok())
      .build(deps)

    onRequestNotMatched({
      verbose: true,
      method: 'PATCH',
      url: 'http://localhost:8080/test',
      path: '/test',
      closestMatch: mock,
    })
  })

  it('should log with named and identified stub', function () {
    const mock = new HttpMockBuilder('file', './somewhere')
      .id('test')
      .name('nice name')
      .expect(contentType('something'))
      .reply(ok())
      .build(deps)

    onRequestNotMatched({
      verbose: false,
      method: 'PATCH',
      url: 'http://localhost:8080',
      path: '/',
      closestMatch: mock,
    })
  })

  it('should log event with mock with meta info for url and method', function () {
    const mock = new HttpMockBuilder('file', './somewhere')
      .id('test')
      .name('nice name')
      .expect(contentType('something'))
      .url('http://localhost:8080')
      .method('PATCH')
      .reply(ok())
      .build(deps)

    onRequestNotMatched({
      verbose: true,
      method: 'PATCH',
      url: 'http://localhost:8080/test',
      path: '/test',
      closestMatch: mock,
    })
  })

  it('should log event with mock without meta info for url and method', function () {
    const mock = new HttpMockBuilder('file', './somewhere')
      .id('test')
      .name('nice name')
      .expect(contentType('something'))
      .url(equalTo('http://localhost:8080'))
      .method('GET')
      .reply(ok())
      .build(deps)

    onRequestNotMatched({
      verbose: false,
      method: 'PATCH',
      url: 'http://localhost:8080',
      path: '/',
      closestMatch: mock,
    })
  })
})