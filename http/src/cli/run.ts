/* eslint-disable no-console */

import { red } from 'colorette'
import { bold } from 'colorette'
import { mockHttp } from '..'
import { MockDogHttp } from '..'
import { Argv } from '../config'
import { opts } from '../config'
import { Defaults } from '../config'
import { initialOptionsReader } from '../config'
import { argvReader } from '../config'
import { envReader } from '../config'
import { printInfo } from './printInfo'
import { configureWatcher } from './configureWatcher'

export async function run(options: Argv): Promise<MockDogHttp> {
  const builder = opts().enableFileMocks().verbose()

  const configurationProviders = [
    initialOptionsReader(options.rootDir, options.config),
    envReader(process.env),
    argvReader(options)
  ]

  for (const provider of configurationProviders) {
    await provider(builder)
  }

  const config = builder.build()
  const mockhttp = mockHttp(config)

  // Watch remains disabled when record is enabled
  // to avoid issues with newly created files from recorded responses
  if (config.watch && !config.recordEnabled) {
    configureWatcher(config, mockhttp)
  }

  process.on('SIGTERM', () => mockhttp.close())
  process.on('SIGINT', () => mockhttp.close())

  process.on('unhandledRejection', reason =>
    console.error(red(`Unhandled Rejection. Reason: ${reason}`))
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

  mockhttp.on('onClose', () => {
    if (process.stdin && process.stdin.unref) process.stdin.unref()
  })

  return mockhttp.start().then(info => {
    printInfo(config, options, info)

    return mockhttp
  })
}
