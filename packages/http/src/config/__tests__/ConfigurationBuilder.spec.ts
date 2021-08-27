import Path from 'path'
import { Response } from 'express'
import { NextFunction } from 'express'
import { Mode } from '@mockinho/core'
import { HttpConfigurationBuilder } from '../HttpConfigurationBuilder'
import { HttpRequest } from '../../HttpRequest'

describe('Configurations Builder', function () {
  it('should build configurations with builder values', function () {
    const builder = new HttpConfigurationBuilder()
      .httpPort(3000)
      .https(3001, { enableTrace: true }, '127.0.0.1')
      .dynamicHttpPort()
      .timeout(5000)
      .logLevel('silent')
      .mode(Mode.verbose)
      .enableFileMocks(false)
      .mockDirectory(Path.join(__dirname, 'test'))
      .trace()
      .formUrlEncodedOptions({ limit: 1000 })
      .enableCors({ maxAge: 10 })
      .multiPartOptions({ limits: { fieldNameSize: 1000 } })
      .cookieOptions('super-secret', {})

    const cfg = builder.build()

    expect(cfg.httpPort).toEqual(3000)
    expect(cfg.httpHost).toEqual('127.0.0.1')
    expect(cfg.useHttps).toBeTruthy()
    expect(cfg.httpsPort).toEqual(3001)
    expect(cfg.httpsOptions).toEqual({ enableTrace: true })
    expect(cfg.httpDynamicPort).toBeTruthy()
    expect(cfg.timeout).toEqual(5000)
    expect(cfg.logLevel).toEqual('silent')
    expect(cfg.mode).toEqual(Mode.verbose)
    expect(cfg.mockFilesEnabled).toBeFalsy()
    expect(cfg.mockDirectory).toEqual(Path.join(__dirname, 'test'))
    expect(cfg.formUrlEncodedOptions).toEqual({ extended: false, limit: 1000 })
    expect(cfg.corsOptions).toEqual({ maxAge: 10 })
    expect(cfg.corsEnabled).toBeTruthy()
    expect(cfg.multiPartOptions).toEqual({ limits: { fieldNameSize: 1000 } })
    expect(cfg.cookieSecrets).toEqual('super-secret')
    expect(cfg.cookieOptions).toEqual({})
  })

  it('should set mock body content dir to __content__ as the default', function () {
    const builder = new HttpConfigurationBuilder()
    const cfg = builder.mockDirectory(Path.join(__dirname, 'test')).build()

    expect(cfg.mockDirectory).toEqual(Path.join(__dirname, 'test'))
  })

  it('should set mode', function () {
    const silent = new HttpConfigurationBuilder().silent().build()
    const info = new HttpConfigurationBuilder().info().build()
    const detailed = new HttpConfigurationBuilder().detailed().build()
    const verbose = new HttpConfigurationBuilder().verbose().build()

    expect(silent.mode).toEqual(Mode.silent)
    expect(info.mode).toEqual(Mode.info)
    expect(detailed.mode).toEqual(Mode.detailed)
    expect(verbose.mode).toEqual(Mode.verbose)
  })

  describe('HTTPS', function () {
    it('should have https as false by default', function () {
      const builder = new HttpConfigurationBuilder()
      const cfg = builder.build()

      expect(cfg.useHttps).toBeFalsy()
      expect(cfg.httpsOptions).toBeUndefined()
    })

    it('should fail when https is enabled but no options are provided', function () {
      const builder = new HttpConfigurationBuilder()
      expect(() => builder.https(3000, undefined as any).build()).toThrowError(ReferenceError)
    })
  })

  describe('custom middlewares', function () {
    function middleware(req: HttpRequest, res: Response, next: NextFunction) {
      next()
    }

    it('should not accept one entry without a function', function () {
      const builder = new HttpConfigurationBuilder()

      builder.addPreMiddlewares([['/test']])

      expect(() => builder.build()).toThrowError()
    })

    it('should not accept more than 2 elements', function () {
      const builder = new HttpConfigurationBuilder()

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      builder.addPreMiddlewares([['/test', 'other-random-value', () => {}]])

      expect(() => builder.build()).toThrowError()
    })

    it('should not accept 2 elements different than: string - function', function () {
      const builder = new HttpConfigurationBuilder()

      builder.addPreMiddlewares([['/test', 'other-random-value']])

      expect(() => builder.build()).toThrowError()
    })

    it('should accept one element with a middleware function', function () {
      const cfg = new HttpConfigurationBuilder().addPreMiddlewares([[middleware]]).build()

      expect(cfg.preHandlerMiddlewares).toHaveLength(1)
      expect(typeof cfg.preHandlerMiddlewares[0][0] === 'function').toBeTruthy()
    })

    it('should accept two elements with a string first and then the middleware function', function () {
      const cfg = new HttpConfigurationBuilder().addPreMiddlewares([['/test', middleware]]).build()

      expect(cfg.preHandlerMiddlewares).toHaveLength(1)
      expect(typeof cfg.preHandlerMiddlewares[0][0] === 'string').toBeTruthy()
      expect(typeof cfg.preHandlerMiddlewares[0][1] === 'function').toBeTruthy()
    })

    describe('when using .use()', function () {
      it('should add middleware without route when providing only a function', function () {
        const cfg = new HttpConfigurationBuilder().use(middleware).build()

        expect(cfg.preHandlerMiddlewares).toHaveLength(1)
        expect(typeof cfg.preHandlerMiddlewares[0][0] === 'function').toBeTruthy()
      })

      it('should add middleware for a route when providing two parameters', function () {
        const cfg = new HttpConfigurationBuilder().use('/test', middleware).build()

        expect(cfg.preHandlerMiddlewares).toHaveLength(1)
        expect(typeof cfg.preHandlerMiddlewares[0][0] === 'string').toBeTruthy()
        expect(typeof cfg.preHandlerMiddlewares[0][1] === 'function').toBeTruthy()
      })
    })
  })
})
