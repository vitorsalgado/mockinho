import Pino from 'pino'
import { Logger } from './Logger.js'

export class PinoLogger implements Logger {
  private readonly pino: Pino.Logger

  constructor(level: string) {
    this.pino = Pino({
      prettyPrint: {
        levelFirst: true,
        colorize: true,
        messageFormat: '{msg}',
        translateTime: true,
        ignore: 'hostname,pid',
      },
      level: level,
    })
  }

  name(): string {
    return 'console-pino-pretty-internal'
  }

  trace(data: any, ...params: Array<any>): void {
    this.pino.trace(data, ...params)
  }

  debug(data: any, ...params: Array<any>): void {
    this.pino.debug(data, ...params)
  }

  info(data: any, ...params: Array<any>): void {
    this.pino.info(data, ...params)
  }

  warn(data: any, ...params: Array<any>): void {
    this.pino.warn(data, ...params)
  }

  error(data: any, ...params: Array<any>): void {
    this.pino.error(data, ...params)
  }

  fatal(data: any, ...params: Array<any>): void {
    this.pino.fatal(data, ...params)
  }
}
