/* eslint-disable no-console */

import { red } from 'colorette'
import { bold } from 'colorette'
import { httpMock } from '../index.js'
import { MockDogHttp } from '../MockDogHttp.js'
import { Argv } from '../config/index.js'
import { opts } from '../config/index.js'
import { Defaults } from '../config/index.js'
import { initialOptionsReader } from '../config/index.js'
import { argvReader } from '../config/index.js'
import { envReader } from '../config/index.js'
import { printInfo } from './printInfo.js'
import { configureWatcher } from './configureWatcher.js'

export async function run(options: Argv, banner: string): Promise<MockDogHttp> {
  const builder = opts().enableFileMocks().verbose()

  const configurationProviders = [
    initialOptionsReader(options.rootDir, options.config),
    envReader(process.env),
    argvReader(options),
  ]

  for (const provider of configurationProviders) {
    await provider(builder)
  }

  const config = builder.build()
  const mockhttp = httpMock(config)

  // Watch remains disabled when record is enabled
  // to avoid issues with newly created files from recorded responses
  if (config.watch && !config.recordEnabled) {
    await configureWatcher(config, mockhttp)
  }

  process.on('SIGTERM', () => mockhttp.close())
  process.on('SIGINT', () => mockhttp.close())

  process.on('unhandledRejection', reason =>
    console.error(red(`Unhandled Rejection. Reason: ${reason}`)),
  )
  process.on('uncaughtException', error => {
    console.error(red(`Found an unexpected error. Reason: ${error.message}`))
    console.error(red(bold('Error:')))
    console.error(error)
  })

  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', async data => {
    const str = data.toString().trim().toLowerCase()

    if (str === Defaults.restartCommand) {
      await mockhttp.rebuild()
    }
  })

  mockhttp.hooks.on('onClose', () => {
    if (process.stdin && process.stdin.unref) process.stdin.unref()
  })

  return mockhttp.start().then(info => {
    printInfo(config, options, info, banner)

    return mockhttp
  })
}
