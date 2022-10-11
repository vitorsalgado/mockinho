import Fs from 'fs/promises'
import Path from 'path'
import Os from 'os'
import Supertest from 'supertest'
import { listFilenames } from '@mockdog/x'
import { sleep } from '@mockdog/x'
import { opts } from '../../config/index.js'
import { H, MediaTypes } from '../../http.js'
import httpMock from '../../index.js'
import { get } from '../../builder.js'
import { okJSON } from '../../reply/index.js'
import { urlPath } from '../matchers/index.js'

describe('Record', function () {
  const target = httpMock(opts().dynamicHttpPort().trace())

  beforeAll(() => target.start())
  afterAll(() => target.finalize())
  afterEach(() => target.resetMocks())

  describe('when recording', function () {
    it('should return success response from target', async function () {
      const tmp = await Fs.mkdtemp(Path.join(Os.tmpdir(), 'mockdog-'))
      const recordDir = Path.join(tmp, '_fixtures')

      await Fs.mkdir(recordDir)

      const $ = httpMock(
        opts()
          .dynamicHttpPort()
          .proxy(`http://${target.serverInfo().http.host}:${target.serverInfo().http.port}`)
          .record({ destination: recordDir }),
      )

      try {
        target.mock(
          get(urlPath('/customers/100/test')).reply(
            okJSON({ hello: 'world' }).header('x-proxy-reply', 'success'),
          ),
        )

        await $.start()

        await Supertest($.listener())
          .get('/customers/100/test?q=name|email|address&actions=move+run')
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
        await Promise.all([$.finalize(), Fs.rm(tmp, { recursive: true })])
      }
    }, 7500)
  })
})
