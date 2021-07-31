import { equalsTo } from '../../../shared/matchers'
import { fakeContext } from '../../../shared/matchers/__tests__/testUtils'
import { contentType } from '../../../shared/matchers/http'
import { HttpStubBuilder } from '../../stub'
import { ok } from '../../stub/initializers/ok'
import { onRequestNotMatched } from '../onRequestNotMatched'

describe('onRequestNotMatched', function () {
  it('should log without a closest match', function () {
    onRequestNotMatched({
      method: 'GET',
      url: 'http://localhost:8080'
    })
  })

  it('should log with stub without name and id', function () {
    const stub = HttpStubBuilder.newBuilder()
      .expect(contentType('something'))
      .reply(ok())
      .build(fakeContext())

    onRequestNotMatched({
      method: 'PATCH',
      url: 'http://localhost:8080',
      closestMatch: stub
    })
  })

  it('should log with named and identified stub', function () {
    const stub = new HttpStubBuilder('file', './somewhere')
      .id('test')
      .name('nice name')
      .expect(contentType('something'))
      .reply(ok())
      .build(fakeContext())

    onRequestNotMatched({
      method: 'PATCH',
      url: 'http://localhost:8080',
      closestMatch: stub
    })
  })

  it('should log event with stub with meta info for url and method', function () {
    const stub = new HttpStubBuilder('file', './somewhere')
      .id('test')
      .name('nice name')
      .expect(contentType('something'))
      .url('http://localhost:8080')
      .method('PATCH')
      .reply(ok())
      .build(fakeContext())

    onRequestNotMatched({
      method: 'PATCH',
      url: 'http://localhost:8080',
      closestMatch: stub
    })
  })

  it('should log event with stub without meta info for url and method', function () {
    const stub = new HttpStubBuilder('file', './somewhere')
      .id('test')
      .name('nice name')
      .expect(contentType('something'))
      .url(equalsTo('http://localhost:8080'))
      .method(equalsTo('GET'))
      .reply(ok())
      .build(fakeContext())

    onRequestNotMatched({
      method: 'PATCH',
      url: 'http://localhost:8080',
      closestMatch: stub
    })
  })
})
