import { Logger } from './Logger.js'

export class LoggerUtil implements Logger {
  public static INSTANCE: LoggerUtil = new LoggerUtil()
  private readonly loggers: Array<Logger> = []

  public static instance = (): LoggerUtil => LoggerUtil.INSTANCE

  subscribe(log: Logger): void {
    this.loggers.push(log)
  }

  unsubscribe(name: string): void {
    const idx = this.loggers.findIndex(x => x.name() === name)

    if (idx > -1) {
      this.loggers.splice(idx, 1)
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
    for (const logger of this.loggers) {
      logger[level](data, ...params)
    }
  }
}
