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
