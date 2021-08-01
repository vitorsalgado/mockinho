import Path from 'path'
import { Logger, LoggerPino } from '@mockinho/core'
import { ExpressConfigurationsBuilder } from '../ExpressConfigurationsBuilder'
import { ExpressServerFactory } from '../../ExpressServerFactory'

describe('Configurations Builder', function () {
  it('should build configurations with builder values', function () {
    const builder = new ExpressConfigurationsBuilder()
    const pinoLogger = new LoggerPino()

    const cfg = builder
      .port(3000)
      .host('127.0.0.1')
      .dynamicPort()
      .log(pinoLogger)
      .verbose(false)
      .loadFileStubs(false)
      .stubsDirectory(Path.join(__dirname, 'test'), Path.join(__dirname, 'test', 'bodies'))
      .disableDefaultLogger(false)
      .defaultLoggerLevel('warn')
      .trace()
      .serverFactory(new ExpressServerFactory())
      .formUrlEncodedOptions({ limit: 1000 })
      .enableCors({ maxAge: 10 })
      .multiPartOptions({ limits: { fieldNameSize: 1000 } })
      .build()

    expect(cfg.port).toEqual(3000)
    expect(cfg.host).toEqual('127.0.0.1')
    expect(cfg.dynamicPort).toBeTruthy()
    expect(cfg.loggers).toHaveLength(1)
    expect(cfg.loggers[0]).toBeInstanceOf(LoggerPino)
    expect(cfg.verbose).toBeFalsy()
    expect(cfg.loadFileStubs).toBeFalsy()
    expect(cfg.stubsDirectory).toEqual(Path.join(__dirname, 'test'))
    expect(cfg.stubsBodyContentDirectory).toEqual(Path.join(__dirname, 'test', 'bodies'))
    expect(cfg.trace).toBeTruthy()
    expect(cfg.serverFactory).toBeInstanceOf(ExpressServerFactory)
    expect(cfg.formUrlEncodedOptions).toEqual({ extended: false, limit: 1000 })
    expect(cfg.corsOptions).toEqual({ maxAge: 10 })
    expect(cfg.cors).toBeTruthy()
    expect(cfg.multiPartOptions).toEqual({ limits: { fieldNameSize: 1000 } })
  })

  it('should add default logger when enable and not previously added', function () {
    const builder = new ExpressConfigurationsBuilder()

    const cfg = builder.disableDefaultLogger(false).build()

    expect(cfg.loggers).toHaveLength(1)
    expect(cfg.loggers[0]).toBeInstanceOf(LoggerPino)
  })

  it('should add fastify server factory when none was specified', function () {
    const builder = new ExpressConfigurationsBuilder()
    const cfg = builder.build()

    expect(cfg.serverFactory).toBeInstanceOf(ExpressServerFactory)
  })

  it('should set stub body content dir to __content__ as the default', function () {
    const builder = new ExpressConfigurationsBuilder()
    const cfg = builder.stubsDirectory(Path.join(__dirname, 'test')).build()

    expect(cfg.stubsDirectory).toEqual(Path.join(__dirname, 'test'))
    expect(cfg.stubsBodyContentDirectory).toEqual(Path.join(__dirname, 'test', '__content__'))
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

    const cfg = builder
      .port(3000)
      .host('127.0.0.1')
      .dynamicPort()
      .log(new FakeLog('test-logger', jest.fn()))
      .verbose(false)
      .loadFileStubs(false)
      .stubsDirectory(Path.join(__dirname, 'test'), Path.join(__dirname, 'test', 'bodies'))
      .disableDefaultLogger()
      .defaultLoggerLevel('warn')
      .build()

    expect(cfg.loggers).toHaveLength(1)
    expect(cfg.loggers[0]).toBeInstanceOf(FakeLog)
  })
})
