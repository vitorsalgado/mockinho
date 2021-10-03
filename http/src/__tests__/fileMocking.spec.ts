import Path from 'path'
import Supertest from 'supertest'
import { v4 } from 'uuid'
import { opts } from '..'
import { mockHttp } from '..'

describe('HTTP - File Mocking', function () {
  describe('Default Path', function () {
    const $ = mockHttp(
      opts().dynamicHttpPort().enableFileMocks().rootDir(Path.join(__dirname, '../..'))
    )

    beforeAll(() => $.start())
    afterAll(() => $.finalize())

    it('should match and return a mock from a complex request mapping', function () {
      return Supertest($.listener())
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

    it('should match and return from a yaml mock', function () {
      return Supertest($.listener())
        .post('/test/100/another-route/200?q=ORANGE&sort=AsC&filter=none&from=NoWheRe')
        .set('content-type', 'application/json')
        .set('Accept', 'application/json')
        .set('X-Context', 'Some Nice Context')
        .set('X-Var', '10')
        .send({
          data: {
            message: ' test ',
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
