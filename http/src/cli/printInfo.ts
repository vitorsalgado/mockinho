/* eslint-disable no-console */

import { greenBright } from 'colorette'
import { bold } from 'colorette'
import { Configuration } from '../config'
import { Argv } from '../config'
import { Info } from '../Info'
import Banner from './banner'
import { parseServerInfo } from './utils'

export function printInfo(config: Configuration, options: Argv, info: Info): void {
  console.log(Banner)
  console.log(bold('Version: ') + '1.0.0')
  console.log(bold('Log Mode: ') + config.mode)
  console.log(bold('Mocks: ') + config.mockDirectory)
  console.log(bold('Mock Extensions: ') + '*.' + config.mockFilesExtension + '.<yaml|yml|json>')

  if (config.corsEnabled) {
    console.log(bold('CORS: ') + config.corsEnabled)
  }

  if (config.recordEnabled) {
    console.log(bold('Recording: ') + config.recordOptions?.destination)
  }

  if (config.proxyEnabled) {
    console.log(bold('Proxy: ') + config.proxyOptions.target)
  }

  if (options.watch) {
    console.log(bold('Watching: ') + options.watch)
  }

  console.log()
  console.log(greenBright('Listening on: ') + parseServerInfo(info))
  console.log()
}
