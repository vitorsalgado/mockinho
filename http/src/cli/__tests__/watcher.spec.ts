import Path from 'path'
import * as Fs from 'fs'
import Os from 'os'
import Supertest from 'supertest'
import { sleep } from '@mockdog/core'
import { Argv } from '../../config/providers/commandlineargs/Argv'
import { run } from '../run'

describe.skip('watcher', function () {
  describe('when adding a new mock file in the folder being watched', function () {
    const spec = {
      id: 'test-watcher-1',
      name: 'Test Watcher 1',

      request: {
        method: 'GET',
        url: '/test/watcher'
      },

      response: {
        status: 200,
        body: {
          hello: 'world'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }

    it('should include it on mock repository', async function () {
      const tmp = Fs.mkdtempSync(Path.join(Os.tmpdir(), 'mockdog-'))
      const mocks = Path.join(tmp, '__fixtures__')

      Fs.mkdirSync(mocks)

      const argv: Argv = {
        mode: 'verbose',
        port: 0,
        noHttps: true,
        rootDir: tmp,
        mockDir: mocks,
        watch: true
      }
      const mockhttp = await run(argv)

      try {
        Fs.writeFileSync(Path.join(mocks, 'test.mock.json'), Buffer.from(JSON.stringify(spec)))

        await sleep(2500)

        await Supertest(mockhttp.server())
          .get('/test/watcher')
          .expect(200)
          .expect(({ body }) => expect(body.hello).toEqual('world'))
      } finally {
        await mockhttp.close()

        Fs.rmdirSync(tmp, { recursive: true })
      }
    })
  })
})
