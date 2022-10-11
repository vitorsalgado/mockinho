import Path from 'path'
import Fs from 'fs'
import Os from 'os'
import Supertest from 'supertest'
import { get } from '../../mock/index.js'
import { ok } from '../../mock/index.js'
import { run } from '../run'
import { Argv } from '../../config'
import { Defaults } from '../../config'
import { MockDogHttp } from '../../MockDogHttp'

describe('cli', function () {
  const OLD_ENV = process.env
  const OLD_EXIT = process.exit

  const exitSpy: any = jest.fn()

  beforeEach(() => {
    process.env = { ...OLD_ENV }
    process.exit = exitSpy
  })

  afterEach(() => {
    process.env = OLD_ENV
    process.exit = OLD_EXIT
  })

  it('should import cli without errors', async function () {
    const imported = await import('../index.js')
    const cli = (await imported.default) as MockDogHttp

    await cli.finalize()
  })

  describe('when using a typescript configuration file', function () {
    it('should read the configuration', async function () {
      const argv: Argv = { rootDir: __dirname }
      const mockhttp = await run(argv)
      const config = mockhttp.configuration()
      const tsconfig = await import('./mockhttprc.js')

      try {
        mockhttp.mock(get('/test').reply(ok()))

        await Supertest(mockhttp.listener()).get('/test').expect(200)
        await Supertest(mockhttp.listener())
          .get('/ts/plugin')
          .expect(200)
          .expect(({ body }) => expect(body).toEqual({ hello: 'world', ctx: 'ts' }))

        expect(config.mode).toEqual('info')
        expect(config.httpPort).toEqual(0)
        expect(config.timeout).toEqual(3_600_000)
        expect(config.mockDirectory).toEqual(Path.join(__dirname, '_fixtures'))
        expect(config.mockFilesExtension).toEqual('mock')
        expect(config.recordEnabled).toBeFalsy()
        expect(config.proxyEnabled).toBeTruthy()
        expect(config.proxyOptions.target).toEqual('http://some.nice.place')
        expect(config.proxyOptions.headers).toEqual({ 'x-test': 'abc', 'x-ctx': 'test' })
        expect(config.middlewares).toEqual([])
        expect(config.file).toEqual(tsconfig.default)
      } finally {
        await mockhttp.finalize()
      }
    })
  })

  describe('when specifying a custom javascript config file', function () {
    it('should read the specific configuration and not the default ones', async function () {
      const argv: Argv = { rootDir: __dirname, config: 'mockhttprc-custom.js' }
      const mockhttp = await run(argv)
      const config = mockhttp.configuration()
      const jsconfig = await import('./mockhttprc-custom')

      try {
        mockhttp.mock(get('/test-js').reply(ok()))

        await Supertest(mockhttp.listener()).get('/test-js').expect(200)
        await Supertest(mockhttp.listener())
          .get('/js/plugin')
          .expect(200)
          .expect(({ body }) => expect(body).toEqual({ hello: 'world', ctx: 'js' }))

        expect(config.mode).toEqual('silent')
        expect(config.httpPort).toEqual(0)
        expect(config.timeout).toEqual(3_600_000)
        expect(config.mockDirectory).toEqual(Path.join(__dirname, '_fixtures'))
        expect(config.mockFilesExtension).toEqual('test-js')
        expect(config.recordEnabled).toBeFalsy()
        expect(config.proxyEnabled).toBeFalsy()
        expect(config.middlewares).toEqual([])
        expect(config.file).toEqual(jsconfig.default)
      } finally {
        await mockhttp.close()
      }
    })
  })

  describe('when environment variables are set', function () {
    it('should consider the values from env vars instead of the ones in file configuration', async function () {
      const tmp = Fs.mkdtempSync(Path.join(Os.tmpdir(), 'mockdog-'))
      const recordDir = Path.join(tmp, 'record_destination')

      process.env.MOCK_MODE = 'silent'
      process.env.MOCK_HTTP_PORT = '0'
      process.env.MOCK_HTTP_HOST = 'localhost'
      process.env.MOCK_HTTPS_PORT = '0'
      process.env.MOCK_HTTPS_HOST = 'localhost'
      process.env.MOCK_SERVER_TIMEOUT = '5000'
      process.env.MOCK_DIRECTORY = 'test'
      process.env.MOCK_FILES_EXTENSION = 'none'
      process.env.MOCK_RECORD = 'true'
      process.env.MOCK_RECORD_DESTINATION = recordDir
      process.env.MOCK_RECORD_CAPTURE_REQUEST_HEADERS = 'header1,header2'
      process.env.MOCK_RECORD_CAPTURE_RESPONSE_HEADERS = 'res1,res2,res3'
      process.env.MOCK_CORS = 'false'
      process.env.MOCK_COOKIE_SECRETS = 'super_secret'
      process.env.MOCK_PROXY = 'https://example.org'

      const argv: Argv = { rootDir: __dirname }
      const mockhttp = await run(argv)
      const config = mockhttp.configuration()

      try {
        mockhttp.mock(get('/test').reply(ok()))

        await Supertest(`http://localhost:${mockhttp.serverInfo().http.port}`)
          .get('/test')
          .expect(200)

        expect(config.useHttp).toBeTruthy()
        expect(config.httpPort).toEqual(0)
        expect(config.httpHost).toEqual('localhost')
        expect(config.useHttps).toBeTruthy()
        expect(config.httpsPort).toEqual(0)
        expect(config.httpsHost).toEqual('localhost')
        expect(config.timeout).toEqual(5000)
        expect(config.mockDirectory).toEqual(Path.join(process.cwd(), 'test'))
        expect(config.mockFilesExtension).toEqual('none')
        expect(config.recordEnabled).toBeTruthy()
        expect(config.recordOptions?.destination).toEqual(recordDir)
        expect(config.recordOptions?.captureRequestHeaders).toEqual(['header1', 'header2'])
        expect(config.recordOptions?.captureResponseHeaders).toEqual(['res1', 'res2', 'res3'])
        expect(config.corsEnabled).toBeTruthy()
        expect(config.cookieSecrets).toEqual(['super_secret'])
        expect(config.proxyEnabled).toBeTruthy()
        expect(config.proxyOptions.target).toEqual('https://example.org')
      } finally {
        await mockhttp.close()
        Fs.rmdirSync(tmp, { recursive: true })
      }
    })

    it('should enable record with default values', async function () {
      process.env.MOCK_RECORD = 'true'

      const argv: Argv = { rootDir: __dirname }
      const mockhttp = await run(argv)
      const config = mockhttp.configuration()

      try {
        mockhttp.mock(get('/test').reply(ok()))

        await Supertest(`http://localhost:${mockhttp.serverInfo().http.port}`)
          .get('/test')
          .expect(200)

        expect(config.recordEnabled).toBeTruthy()
        expect(config.recordOptions?.destination).toEqual(
          Path.join(__dirname, Defaults.fixturesDir),
        )
      } finally {
        await mockhttp.finalize()
      }
    })
  })

  describe('when running with argv', function () {
    it('should have priority over all other configuration providers', async function () {
      const tmp = Fs.mkdtempSync(Path.join(Os.tmpdir(), 'mockdog-cli-'))
      const mockDir = Path.join(tmp, 'data')

      process.env.MOCK_HTTP_PORT = '8080'
      process.env.MOCK_HTTP_HOST = '0.0.0.0'
      process.env.MOCK_HTTPS_PORT = '8443'
      process.env.MOCK_HTTPS_HOST = '0.0.0.0'
      process.env.MOCK_SERVER_TIMEOUT = '15000'
      process.env.MOCK_DIRECTORY = 'test'
      process.env.MOCK_RECORD = 'true'
      process.env.MOCK_RECORD_DESTINATION = 'record_destination'
      process.env.MOCK_RECORD_CAPTURE_REQUEST_HEADERS = 'header1,header2'
      process.env.MOCK_RECORD_CAPTURE_RESPONSE_HEADERS = 'res1,res2,res3'
      process.env.MOCK_CORS = 'true'
      process.env.MOCK_COOKIE_SECRETS = 'super_secret'
      process.env.MOCK_PROXY = 'https://example.org'
      process.env.MOCK_WATCH = 'true'

      const argv: Argv = {
        noHttp: false,
        port: 0,
        host: 'localhost',
        noHttps: true,
        httpsPort: undefined,
        httpsHost: undefined,
        rootDir: __dirname,
        mockDir: mockDir,
        record: false,
        cors: false,
        cookieSecrets: [],
        proxy: undefined,
        plugin: ['./_fixtures/plugin-js.js', './_fixtures/plugin-ts.ts'],
      }
      const mockhttp = await run(argv)
      const config = mockhttp.configuration()

      try {
        mockhttp.mock(get('/test').reply(ok()))

        await Supertest(mockhttp.listener()).get('/test').expect(200)
        await Supertest(mockhttp.listener())
          .get('/js/plugin')
          .expect(200)
          .expect(({ body }) => expect(body).toEqual({ hello: 'world', ctx: 'js' }))
        await Supertest(mockhttp.listener())
          .get('/ts/plugin')
          .expect(200)
          .expect(({ body }) => expect(body).toEqual({ hello: 'world', ctx: 'ts' }))

        expect(config.mode).toEqual('info')
        expect(config.useHttp).toBeTruthy()
        expect(config.httpPort).toEqual(0)
        expect(config.httpHost).toEqual('localhost')
        expect(config.useHttps).toBeFalsy()
        expect(config.timeout).toEqual(15000)
        expect(config.mockDirectory).toEqual(mockDir)
        expect(config.mockFilesExtension).toEqual('mock')
        expect(config.recordEnabled).toBeFalsy()
        expect(config.corsEnabled).toBeFalsy()
        expect(config.cookieSecrets).toEqual([])
        expect(config.proxyEnabled).toBeTruthy()
        expect(config.watch).toBeTruthy()
        expect(config.argv).toEqual(argv)
      } finally {
        await mockhttp.close()
        Fs.rmdirSync(tmp, { recursive: true })
      }
    })

    it('should set all parameters correctly', async function () {
      const tmp = Fs.mkdtempSync(Path.join(Os.tmpdir(), 'mockdog-cli-'))
      const mockDir = Path.join(tmp, 'data')

      const argv: Argv = {
        mode: 'silent',
        noHttp: false,
        port: 0,
        host: 'localhost',
        timeout: 15000,
        noHttps: true,
        httpsPort: undefined,
        httpsHost: undefined,
        rootDir: __dirname,
        mockDir: mockDir,
        mockExtension: 'test',
        record: true,
        cors: true,
        cookieSecrets: ['secret1', 'secret2'],
        proxy: 'https://test.com',
        proxyHeaders: ['x-test=abc', 'x-ctx=test'],
        watch: true,
      }
      const mockhttp = await run(argv)
      const config = mockhttp.configuration()

      try {
        mockhttp.mock(get('/test').reply(ok()))

        await Supertest(mockhttp.listener()).get('/test').expect(200)

        expect(config.mode).toEqual('silent')
        expect(config.useHttp).toBeTruthy()
        expect(config.httpPort).toEqual(0)
        expect(config.httpHost).toEqual('localhost')
        expect(config.useHttps).toBeFalsy()
        expect(config.timeout).toEqual(15000)
        expect(config.mockDirectory).toEqual(mockDir)
        expect(config.mockFilesExtension).toEqual('test')
        expect(config.recordEnabled).toBeTruthy()
        expect(config.corsEnabled).toBeTruthy()
        expect(config.cookieSecrets).toEqual(['secret1', 'secret2'])
        expect(config.proxyEnabled).toBeTruthy()
        expect(config.proxyOptions.headers).toEqual({ 'x-test': 'abc', 'x-ctx': 'test' })
        expect(config.watch).toBeTruthy()
        expect(config.argv).toEqual(argv)
      } finally {
        await mockhttp.close()
        Fs.rmdirSync(tmp, { recursive: true })
      }
    })

    it('should allow set both http and https', async function () {
      const argv: Argv = {
        mode: 'silent',
        noHttp: false,
        port: 0,
        timeout: 15000,
        noHttps: false,
        httpsPort: 0,
        rootDir: __dirname,
        mockDir: 'data',
        mockExtension: 'test',
      }
      const mockhttp = await run(argv)
      const config = mockhttp.configuration()

      try {
        mockhttp.mock(get('/test').reply(ok()))

        await Supertest(`http://localhost:${mockhttp.serverInfo().http.port}`)
          .get('/test')
          .expect(200)

        expect(config.useHttp).toBeTruthy()
        expect(config.httpPort).toEqual(0)
        expect(config.useHttps).toBeTruthy()
      } finally {
        await mockhttp.close()
      }
    })

    it('should allow set only https', async function () {
      const argv: Argv = {
        mode: 'silent',
        noHttp: true,
        timeout: 15000,
        noHttps: false,
        httpsPort: 0,
        rootDir: __dirname,
        mockDir: 'data',
        mockExtension: 'test',
      }
      const mockhttp = await run(argv)
      const config = mockhttp.configuration()

      try {
        mockhttp.mock(get('/test').reply(ok()))

        expect(config.useHttp).toBeFalsy()
        expect(config.useHttps).toBeTruthy()
        expect(config.httpsPort).toEqual(0)
      } finally {
        await mockhttp.close()
      }
    })
  })
})
