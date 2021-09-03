/* eslint-disable no-console */

import { green } from 'colorette'
import { greenBright } from 'colorette'
import { HttpConfiguration } from '../config'
import { HttpServerInfo } from '../HttpServer'
import { CliArgv } from '../config/CliArgv'
import Banner from './banner'
import { parseServerInfo } from './utils'

export function printInfo(
  config: HttpConfiguration,
  options: CliArgv,
  info: HttpServerInfo,
  pkg: Record<string, unknown>
): void {
  console.log(Banner)
  console.log(green('Version: ') + pkg.version)
  console.log(green('Log Mode: ') + config.mode)
  console.log(green('Mocks: ') + config.mockDirectory)
  console.log(green('Mock Extensions: ') + '*.' + config.mockFilesExtension + '.<yaml|yml|json>')

  if (config.corsEnabled) {
    console.log(green('CORS: ') + config.corsEnabled)
  }

  if (config.recordEnabled) {
    console.log(green('Recording: ') + config.recordOptions?.destination)
  }

  if (config.proxyEnabled) {
    console.log(green('Proxy: ') + config.proxyOptions.target)
  }

  if (options.watch) {
    console.log(green('Watching: ') + options.watch)
  }

  console.log(greenBright('Listening on: ') + parseServerInfo(info))
  console.log()
}
