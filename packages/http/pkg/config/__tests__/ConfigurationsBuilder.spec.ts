import Path from 'path'
import { Logger, LoggerPino } from '@mockinho/core'
import { ExpressConfigurationsBuilder } from '../ExpressConfigurationsBuilder'
import { ExpressServerFactory } from '../../ExpressServerFactory'

describe('Configurations Builder', function () {
  it('should build configurations with builder values', function () {
    const pinoLogger = new LoggerPino()
    const builder = new ExpressConfigurationsBuilder()
      .httpPort(3000)
      .https(3001, { enableTrace: true }, '127.0.0.1')
      .dynamicHttpPort()
      .timeout(5000)
      .addLogger(pinoLogger)
      .verbose(false)
      .loadFileStubs(false)
      .stubsDirectory(Path.join(__dirname, 'test'))
      .disableDefaultLogger(false)
      .defaultLoggerLevel('warn')
      .trace()
      .serverFactory(new ExpressServerFactory())
      .formUrlEncodedOptions({ limit: 1000 })
      .enableCors({ maxAge: 10 })
      .multiPartOptions({ limits: { fieldNameSize: 1000 } })
      .cookieOptions('super-secret', {})

    const cfg = builder.build()

    expect(builder.provideServerFactory()).toBeInstanceOf(ExpressServerFactory)

    expect(cfg.httpPort).toEqual(3000)
    expect(cfg.httpHost).toEqual('127.0.0.1')
    expect(cfg.useHttps).toBeTruthy()
    expect(cfg.httpsPort).toEqual(3001)
    expect(cfg.httpsOptions).toEqual({ enableTrace: true })
    expect(cfg.httpDynamicPort).toBeTruthy()
    expect(cfg.timeout).toEqual(5000)
    expect(cfg.loggers).toHaveLength(1)
    expect(cfg.loggers[0]).toBeInstanceOf(LoggerPino)
    expect(cfg.isVerbose).toBeFalsy()
    expect(cfg.isStubFilesEnabled).toBeFalsy()
    expect(cfg.stubsDirectory).toEqual(Path.join(__dirname, 'test'))
    expect(cfg.trace).toBeTruthy()
    expect(cfg.formUrlEncodedOptions).toEqual({ extended: false, limit: 1000 })
    expect(cfg.corsOptions).toEqual({ maxAge: 10 })
    expect(cfg.isCorsEnabled).toBeTruthy()
    expect(cfg.multiPartOptions).toEqual({ limits: { fieldNameSize: 1000 } })
    expect(cfg.cookieSecrets).toEqual('super-secret')
    expect(cfg.cookieOptions).toEqual({})
  })

  it('should add default logger when enable and not previously added', function () {
    const builder = new ExpressConfigurationsBuilder()
    const cfg = builder.disableDefaultLogger(false).build()

    expect(cfg.loggers).toHaveLength(1)
    expect(cfg.loggers[0]).toBeInstanceOf(LoggerPino)
  })

  it('should add express server factory when none was specified', function () {
    const builder = new ExpressConfigurationsBuilder()
    expect(builder.provideServerFactory()).toBeInstanceOf(ExpressServerFactory)
  })

  it('should set stub body content dir to __content__ as the default', function () {
    const builder = new ExpressConfigurationsBuilder()
    const cfg = builder.stubsDirectory(Path.join(__dirname, 'test')).build()

    expect(cfg.stubsDirectory).toEqual(Path.join(__dirname, 'test'))
  })

  it('should only add the provided logger when default is disabled', function () {
    class FakeLog implements Logger {
      constructor(private readonly _name: string, private readonly spy: jest.Mock) {}

      name(): string {
        return this._name
      }

      debug(data: any, ...params: Array<any>): void {
        this.spy(data, ...params)
      }

      error(data: any, ...params: Array<any>): void {
        this.spy(data, ...params)
      }

      fatal(data: any, ...params: Array<any>): void {
        this.spy(data, ...params)
      }

      info(data: any, ...params: Array<any>): void {
        this.spy(data, ...params)
      }

      trace(data: any, ...params: Array<any>): void {
        this.spy(data, ...params)
      }

      warn(data: any, ...params: Array<any>): void {
        this.spy(data, ...params)
      }
    }

    const builder = new ExpressConfigurationsBuilder()
      .httpPort(3000)
      .dynamicHttpPort()
      .addLogger(new FakeLog('test-logger', jest.fn()))
      .verbose(false)
      .loadFileStubs(false)
      .stubsDirectory(Path.join(__dirname, 'test'))
      .disableDefaultLogger()
      .defaultLoggerLevel('warn')

    const cfg = builder.build()

    expect(cfg.loggers).toHaveLength(1)
    expect(cfg.loggers[0]).toBeInstanceOf(FakeLog)
  })

  describe('HTTPS', function () {
    it('should have https as false by default', function () {
      const builder = new ExpressConfigurationsBuilder()
      const cfg = builder.build()

      expect(cfg.useHttps).toBeFalsy()
      expect(cfg.httpsOptions).toBeUndefined()
    })

    it('should fail when https is enabled but no options are provided', function () {
      const builder = new ExpressConfigurationsBuilder()
      expect(() => builder.https(3000, undefined as any).build()).toThrowError(ReferenceError)
    })
  })
})
