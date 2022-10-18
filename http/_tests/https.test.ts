import https from 'https'
import fetch from 'node-fetch'
import { testcert } from '../_internal/cert.js'
import { httpMock, opts, req } from '../index.js'

describe('https', function () {
  describe('self signed certificate', function () {
    const m = httpMock(
      opts().httpsOptions({ key: testcert.key, cert: testcert.cert }).dynamicHttpsPort(),
    )

    beforeAll(() => m.start())
    afterAll(() => m.finalize())
    afterEach(() => m.resetMocks())

    it('test https', async function () {
      m.mock(req.get('/test').scheme('https').reply(200, { ok: true }))

      const res = await fetch(m.info.https.url + '/test', {
        method: 'GET',
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })

      const json = await res.json()

      expect(res.status).toEqual(200)
      expect(json).toEqual({ ok: true })
    })
  })
})
