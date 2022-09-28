export type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'

export interface Logger {
  name(): string

  trace(data: any, ...params: Array<any>): void

  debug(data: any, ...params: Array<any>): void

  info(data: any, ...params: Array<any>): void

  warn(data: any, ...params: Array<any>): void

  error(data: any, ...params: Array<any>): void

  fatal(data: any, ...params: Array<any>): void
}

class LoggerUtil implements Logger {
  private static readonly _instance: LoggerUtil = new LoggerUtil()
  private readonly _loggers: Array<Logger> = []

  public static instance = (): LoggerUtil => LoggerUtil._instance

  subscribe(log: Logger): void {
    this._loggers.push(log)
  }

  unsubscribe(name: string): void {
    const idx = this._loggers.findIndex(x => x.name() === name)

    if (idx > -1) {
      this._loggers.splice(idx, 1)
    }
  }

  // region Logger

  name(): string {
    return 'LoggerUtil'
  }

  trace(data: any, ...params: Array<any>): void {
    this.log('trace', data, ...params)
  }

  debug(data: any, ...params: Array<any>): void {
    this.log('debug', data, ...params)
  }

  info(data: any, ...params: Array<any>): void {
    this.log('info', data, ...params)
  }

  warn(data: any, ...params: Array<any>): void {
    this.log('warn', data, ...params)
  }

  error(data: any, ...params: Array<any>): void {
    this.log('error', data, ...params)
  }

  fatal(data: any, ...params: Array<any>): void {
    this.log('fatal', data, ...params)
  }

  // endregion

  private log(level: keyof Logger, data: any, ...params: Array<any>): void {
    for (const logger of this._loggers) {
      logger[level](data, ...params)
    }
  }
}

export const log = LoggerUtil.instance()
