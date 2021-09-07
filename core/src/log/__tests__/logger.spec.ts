import { Logger } from '..'
import { LoggerUtil } from '..'

describe('Logger', function () {
  class FakeLog implements Logger {
    constructor(private readonly _name: string, private readonly spy: jest.Mock) {}

    name(): string {
      return this._name
    }

    trace(data: any, ...params: Array<any>): void {
      this.spy(data, ...params)
    }

    debug(data: any, ...params: Array<any>): void {
      this.spy(data, ...params)
    }

    info(data: any, ...params: Array<any>): void {
      this.spy(data, ...params)
    }

    warn(data: any, ...params: Array<any>): void {
      this.spy(data, ...params)
    }

    error(data: any, ...params: Array<any>): void {
      this.spy(data, ...params)
    }

    fatal(data: any, ...params: Array<any>): void {
      this.spy(data, ...params)
    }
  }

  it('should call all subscribed logs', function () {
    const spyOne = jest.fn()
    const spyTwo = jest.fn()

    LoggerUtil.instance().subscribe(new FakeLog('fake 1', spyOne))
    LoggerUtil.instance().subscribe(new FakeLog('fake 2', spyTwo))

    const traceData = 'trace-data'
    const traceParam = 'trace-param'
    LoggerUtil.instance().trace(traceData, traceParam)
    expect(spyOne).toHaveBeenCalledWith('trace-data', traceParam)
    expect(spyTwo).toHaveBeenCalledWith('trace-data', traceParam)

    const debugData = 'debug-data'
    const debugParam = 'debug-param'
    LoggerUtil.instance().debug(debugData, debugParam)
    expect(spyOne).toHaveBeenCalledWith(debugData, debugParam)
    expect(spyTwo).toHaveBeenCalledWith(debugData, debugParam)

    const infoData = 'info-data'
    const infoParam = 'info-param'
    LoggerUtil.instance().info(infoData, infoParam)
    expect(spyOne).toHaveBeenCalledWith(infoData, infoParam)
    expect(spyTwo).toHaveBeenCalledWith(infoData, infoParam)

    const warnData = 'warn-data'
    const warnParam = 'warn-param'
    LoggerUtil.instance().warn(warnData, warnParam)
    expect(spyOne).toHaveBeenCalledWith(warnData, warnParam)
    expect(spyTwo).toHaveBeenCalledWith(warnData, warnParam)

    const errorData = 'error-data'
    const errorParam = 'error-param'
    LoggerUtil.instance().error(errorData, errorParam)
    expect(spyOne).toHaveBeenCalledWith(errorData, errorParam)
    expect(spyTwo).toHaveBeenCalledWith(errorData, errorParam)

    const fatalData = 'fatal-data'
    const fatalParam = 'fatal-param'
    LoggerUtil.instance().fatal(fatalData, fatalParam)
    expect(spyOne).toHaveBeenCalledWith(fatalData, fatalParam)
    expect(spyTwo).toHaveBeenCalledWith(fatalData, fatalParam)

    spyOne.mockReset()
    LoggerUtil.instance().unsubscribe('fake 1')

    LoggerUtil.instance().fatal('test', 'test')
    expect(spyOne).not.toHaveBeenCalled()
    expect(spyTwo).toHaveBeenCalledWith('test', 'test')

    expect(LoggerUtil.instance().name()).toBeDefined()
  })
})
