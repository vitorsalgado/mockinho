import Fs from 'fs'
import Path from 'path'
import Os from 'os'
import Supertest from 'supertest'
import { listFilenames } from '@mockinho/core'
import { sleep } from '@mockinho/core'
import { opts } from '../../config'
import { okJSON } from '../../mock'
import { get } from '../../mock'
import { Headers } from '../../types'
import { MediaTypes } from '../../types'
import mockHttp from '../../mockHttp'
import { urlPath } from '../../matchers'

describe('Record', function () {
  const target = mockHttp(opts().dynamicHttpPort().trace())

  beforeAll(() => target.start())
  afterAll(() => target.finalize())
  afterEach(() => target.removeAll())

  describe('when recording', function () {
    it('should return success response from target', async function () {
      const tmp = Fs.mkdtempSync(Path.join(Os.tmpdir(), 'mockaccino-'))
      const recordDir = Path.join(tmp, '__fixtures__')

      Fs.mkdirSync(recordDir)

      const $ = mockHttp(
        opts()
          .dynamicHttpPort()
          .proxy(`http://${target.info().httpHost}:${target.info().httpPort}`)
          .record({ destination: recordDir })
      )

      try {
        target.mock(
          get(urlPath('/test')).reply(okJSON({ hello: 'world' }).header('x-proxy-reply', 'success'))
        )

        await $.start()

        await Supertest($.server())
          .get('/test')
          .set(Headers.ContentType, MediaTypes.APPLICATION_JSON)
          .expect(200)
          .expect(res => {
            expect(res.body.hello).toEqual('world')
            expect(res.headers['x-proxy-reply']).toEqual('success')
          })

        await sleep(2500)

        const mocks = listFilenames(recordDir, file => file.includes('.mock.json'))
        const bodies = listFilenames(
          recordDir,
          file => file.includes('.json') && !file.includes('.mock.')
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
