import Supertest from 'supertest'
import { v4 } from 'uuid'
import { mockinhoHTTP, opts } from '../index'

describe('HTTP - File Stubbing', function () {
  describe('Default Path', function () {
    const $ = mockinhoHTTP(opts().dynamicPort().verbose().loadFileStubs())

    beforeAll(() => $.start())
    afterAll(() => $.finalize())

    it('should match and return a stub from a complex request mapping', function () {
      return Supertest($.server())
        .post('/test/100/another-route?q=orange&filter=code&sort=ASC')
        .set('content-type', 'application/json')
        .set('Accept', 'application/json')
        .set('x-Correlation-ID', v4())
        .send({
          data: {
            message: 'coding',
            list: ['mobile', 'nodejs', 'app', 'test', 'lib'],
            age: 33
          },
          notifications: [
            { context: { mobile: { content: 'bad comment' } } },
            { context: { mobile: { content: 'nice comment' } } }
          ]
        })
        .expect(200)
        .expect(res => expect(res.body).toEqual({ context: 'default-fixture-path' }))
    })

    it('should match and return from a yaml stub', function () {
      return Supertest($.server())
        .post('/test/100/another-route/200?q=ORANGE&sort=AsC')
        .set('content-type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Context', 'Some Nice Context')
        .set('X-Var', '10')
        .send({
          data: {
            message: 'test',
            age: 33
          }
        })

        .expect(res =>
          expect(res.body).toEqual([
            { name: 'tester', status: 'ok' },
            { name: 'dev', status: 'nok' }
          ])
        )
    })
  })
})
