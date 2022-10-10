import Fs from 'fs'
import Path from 'path'
import Os from 'os'
import Supertest from 'supertest'
import { listFilenames } from '@mockdog/x'
import { sleep } from '@mockdog/x'
import { opts } from '../../config/index.js'
import { H, MediaTypes } from '../../http.js'
import { okJSON } from '../../mock/index.js'
import { get } from '../../mock/index.js'
import mockHttp from '../../mockHttp.js'
import { urlPath } from '../../matchers/index.js'

describe('Record', function () {
  const target = mockHttp(opts().dynamicHttpPort().trace())

  beforeAll(() => target.start())
  afterAll(() => target.finalize())
  afterEach(() => target.resetMocks())

  describe('when recording', function () {
    it('should return success response from target', async function () {
      const tmp = Fs.mkdtempSync(Path.join(Os.tmpdir(), 'mockdog-'))
      const recordDir = Path.join(tmp, '_fixtures')

      Fs.mkdirSync(recordDir)

      const $ = mockHttp(
        opts()
          .dynamicHttpPort()
          .proxy(`http://${target.serverInfo().http.host}:${target.serverInfo().http.port}`)
          .record({ destination: recordDir }),
      )

      try {
        target.mock(
          get(urlPath('/test')).reply(
            okJSON({ hello: 'world' }).header('x-proxy-reply', 'success'),
          ),
        )

        await $.start()

        await Supertest($.listener())
          .get('/test')
          .set(H.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)
          .expect(res => {
            expect(res.body.hello).toEqual('world')
            expect(res.headers['x-proxy-reply']).toEqual('success')
          })

        await sleep(2500)

        const mocks = listFilenames(recordDir, file => file.includes('.mock.json'))
        const bodies = listFilenames(
          recordDir,
          file => file.includes('.json') && !file.includes('.mock.'),
        )

        expect(mocks).toHaveLength(1)
        expect(bodies).toHaveLength(1)
      } finally {
        await $.finalize()
        Fs.rmdirSync(tmp, { recursive: true })
      }
    }, 7500)
  })
})
