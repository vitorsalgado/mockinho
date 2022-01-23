import { equalsTo } from '@mockdog/core-matchers'
import { contentType } from '../../matchers'
import { HttpMockBuilder, ok } from '../../mock'
import { onRequestNotMatched } from '../builtin/onRequestNotMatched'

describe('onRequestNotMatched', function () {
  it('should log without a closest match', function () {
    onRequestNotMatched({
      verbose: false,
      method: 'GET',
      url: 'http://localhost:8080',
      path: '/'
    })
  })

  it('should log with mock without name and id', function () {
    const mock = HttpMockBuilder.newBuilder().expect(contentType('something')).reply(ok()).build()

    onRequestNotMatched({
      verbose: true,
      method: 'PATCH',
      url: 'http://localhost:8080/test',
      path: '/test',
      closestMatch: mock
    })
  })

  it('should log with named and identified stub', function () {
    const mock = new HttpMockBuilder('file', './somewhere')
      .id('test')
      .name('nice name')
      .expect(contentType('something'))
      .reply(ok())
      .build()

    onRequestNotMatched({
      verbose: false,
      method: 'PATCH',
      url: 'http://localhost:8080',
      path: '/',
      closestMatch: mock
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
      .build()

    onRequestNotMatched({
      verbose: true,
      method: 'PATCH',
      url: 'http://localhost:8080/test',
      path: '/test',
      closestMatch: mock
    })
  })

  it('should log event with mock without meta info for url and method', function () {
    const mock = new HttpMockBuilder('file', './somewhere')
      .id('test')
      .name('nice name')
      .expect(contentType('something'))
      .url(equalsTo('http://localhost:8080'))
      .method(equalsTo('GET'))
      .reply(ok())
      .build()

    onRequestNotMatched({
      verbose: false,
      method: 'PATCH',
      url: 'http://localhost:8080',
      path: '/',
      closestMatch: mock
    })
  })
})
