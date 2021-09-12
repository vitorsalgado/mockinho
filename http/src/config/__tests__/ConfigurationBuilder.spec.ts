import Path from 'path'
import { Response } from 'express'
import { NextFunction } from 'express'
import { ConfigurationBuilder } from '../ConfigurationBuilder'
import { HttpRequest } from '../../HttpRequest'
import { Defaults } from '../Defaults'
import { RecordOptions } from '../../mock/record'
import { defaultMockProviderFactory } from '../../mock/providers/default/defaultMockProviderFactory'

describe('Configurations Builder', function () {
  it('should build configurations with builder values', function () {
    const builder = new ConfigurationBuilder()
      .httpPort(3000)
      .https(3001, { enableTrace: true }, '127.0.0.1')
      .dynamicHttpPort()
      .timeout(5000)
      .internalLogLevel('silent')
      .mode('trace')
      .enableFileMocks(false)
      .mockDirectory(Path.join(__dirname, 'test'))
      .trace()
      .formUrlEncodedOptions({ limit: 1000 })
      .enableCors({ maxAge: 10 })
      .multiPartOptions({ limits: { fieldNameSize: 1000 } })
      .cookieOptions('super-secret', {})

    const cfg = builder.build()

    expect(cfg.httpPort).toEqual(3000)
    expect(cfg.httpHost).toEqual(Defaults.host)
    expect(cfg.useHttps).toBeTruthy()
    expect(cfg.httpsPort).toEqual(3001)
    expect(cfg.httpsOptions).toEqual({ enableTrace: true })
    expect(cfg.httpDynamicPort).toBeTruthy()
    expect(cfg.timeout).toEqual(5000)
    expect(cfg.logLevel).toEqual('silent')
    expect(cfg.mode).toEqual('trace')
    expect(cfg.mockFilesEnabled).toBeFalsy()
    expect(cfg.mockDirectory).toEqual(Path.join(__dirname, 'test'))
    expect(cfg.formUrlEncodedOptions).toEqual({ extended: false, limit: 1000 })
    expect(cfg.corsOptions).toEqual({ maxAge: 10 })
    expect(cfg.corsEnabled).toBeTruthy()
    expect(cfg.multiPartOptions).toEqual({ limits: { fieldNameSize: 1000 } })
    expect(cfg.cookieSecrets).toEqual(['super-secret'])
    expect(cfg.cookieOptions).toEqual({})
  })

  it('should set mock body content dir to __content__ as the default', function () {
    const builder = new ConfigurationBuilder()
    const cfg = builder.mockDirectory(Path.join(__dirname, 'test')).build()

    expect(cfg.mockDirectory).toEqual(Path.join(__dirname, 'test'))
  })

  it('should set mode', function () {
    const silent = new ConfigurationBuilder().silent().build()
    const info = new ConfigurationBuilder().info().build()
    const verbose = new ConfigurationBuilder().verbose().build()
    const trace = new ConfigurationBuilder().trace().build()

    expect(silent.mode).toEqual('silent')
    expect(info.mode).toEqual('info')
    expect(verbose.mode).toEqual('verbose')
    expect(trace.mode).toEqual('trace')
  })

  describe('HTTP', function () {
    it('should config http', function () {
      const builder = new ConfigurationBuilder()
      const opts = { maxHeaderSize: 100 }
      const cfg = builder.http(1000, 'localhost').httpOptions(opts).build()

      expect(cfg.useHttp).toBeTruthy()
      expect(cfg.httpPort).toEqual(1000)
      expect(cfg.httpHost).toEqual('localhost')
      expect(cfg.httpOptions).toEqual(opts)
    })

    it('should use a default host when none is provided', function () {
      const builder = new ConfigurationBuilder()
      const cfg = builder.http(1000).build()

      expect(cfg.useHttp).toBeTruthy()
      expect(cfg.httpPort).toEqual(1000)
      expect(cfg.httpHost).toEqual(Defaults.host)
    })
  })

  describe('HTTPS', function () {
    it('should have https as false by default', function () {
      const builder = new ConfigurationBuilder()
      const cfg = builder.build()

      expect(cfg.useHttps).toBeFalsy()
      expect(cfg.httpsOptions).toBeUndefined()
    })

    it('should set dynamic port to true as default', function () {
      const builder = new ConfigurationBuilder()
      const cfg = builder.dynamicHttpsPort().build()

      expect(cfg.useHttps).toBeTruthy()
      expect(cfg.httpsDynamicPort).toBeTruthy()
    })

    it('should set dynamic port', function () {
      const builder = new ConfigurationBuilder()
      const cfg = builder.dynamicHttpsPort(false).build()

      expect(cfg.httpsDynamicPort).toBeFalsy()
    })
  })

  describe('custom middlewares', function () {
    function middleware(req: HttpRequest, res: Response, next: NextFunction) {
      next()
    }

    it('should not accept one entry without a function', function () {
      const builder = new ConfigurationBuilder()

      builder.use('/test')

      expect(() => builder.build()).toThrowError()
    })

    it('should accept one element with a middleware function', function () {
      const cfg = new ConfigurationBuilder().use(middleware).build()

      expect(cfg.preHandlerMiddlewares).toHaveLength(1)
      expect(typeof cfg.preHandlerMiddlewares[0][0] === 'function').toBeTruthy()
    })

    it('should accept two elements with a string first and then the middleware function', function () {
      const cfg = new ConfigurationBuilder().use('/test', middleware).build()

      expect(cfg.preHandlerMiddlewares).toHaveLength(1)
      expect(typeof cfg.preHandlerMiddlewares[0][0] === 'string').toBeTruthy()
      expect(typeof cfg.preHandlerMiddlewares[0][1] === 'function').toBeTruthy()
    })

    describe('when using .use()', function () {
      it('should add middleware without route when providing only a function', function () {
        const cfg = new ConfigurationBuilder().use(middleware).build()

        expect(cfg.preHandlerMiddlewares).toHaveLength(1)
        expect(typeof cfg.preHandlerMiddlewares[0][0] === 'function').toBeTruthy()
      })

      it('should add middleware for a route when providing two parameters', function () {
        const cfg = new ConfigurationBuilder().use('/test', middleware).build()

        expect(cfg.preHandlerMiddlewares).toHaveLength(1)
        expect(typeof cfg.preHandlerMiddlewares[0][0] === 'string').toBeTruthy()
        expect(typeof cfg.preHandlerMiddlewares[0][1] === 'function').toBeTruthy()
      })

      it('should fail if middleware route is not a string', function () {
        expect(() => new ConfigurationBuilder().use(100 as any, middleware).build()).toThrowError()
      })
    })
  })

  describe('record', function () {
    it('should set default record options when none is provided', function () {
      const builder = new ConfigurationBuilder()
      const cfg = builder.record().build()

      expect(cfg.recordOptions?.destination).toEqual(cfg.mockDirectory)
      expect(cfg.recordOptions?.captureRequestHeaders).toEqual(['accept', 'content-type'])
      expect(cfg.recordOptions?.captureResponseHeaders).toEqual([
        'content-type',
        'link',
        'content-length',
        'cache-control',
        'retry-after',
        'date',
        'access-control-expose-headers',
        'connection'
      ])
    })

    it('should accept an option object instead of a option builder', function () {
      const builder = new ConfigurationBuilder()
      const cfg = builder
        .record({
          destination: 'nowhere',
          captureResponseHeaders: [],
          captureRequestHeaders: [],
          filters: []
        } as RecordOptions)
        .build()

      expect(cfg.recordOptions).toEqual({
        destination: 'nowhere',
        captureResponseHeaders: [],
        captureRequestHeaders: [],
        filters: []
      })
    })
  })

  describe('formOptions', function () {
    it('should set form opts', function () {
      const builder = new ConfigurationBuilder()
      const cfg = builder.formUrlEncodedOptions({}).build()

      expect(cfg.formUrlEncodedOptions).toEqual({ extended: false })
    })
  })

  describe('proxy', function () {
    it('should disable proxy when calling .disableProxy()', function () {
      const builder = new ConfigurationBuilder()
      const cfg1 = builder.disableProxy().build()
      const cfg2 = builder.disableProxy(false).build()

      expect(cfg1.proxyEnabled).toBeFalsy()
      expect(cfg2.proxyEnabled).toBeTruthy()
    })
  })

  describe('mock provider factories', function () {
    it('should add mock provider factory', function () {
      const builder = new ConfigurationBuilder()
      const cfg = builder.addMockProviderFactory(defaultMockProviderFactory).build()

      expect(cfg.mockProviderFactories).toHaveLength(1)
    })

    it('should add field parsers', function () {
      const builder = new ConfigurationBuilder()
      const cfg = builder.addMockFieldParser({} as any).build()

      expect(cfg.mockFieldParsers).toHaveLength(1)
    })
  })
})
