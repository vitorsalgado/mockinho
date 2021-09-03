import { opts } from '../config'
import { mockHttp } from '..'
import { MockaccinoHttp } from '..'
import Pkg from '../../package.json'
import { CliArgv } from '../config/CliArgv'
import { configFromFile } from '../config/providers/configFromFile'
import { configFromArgv } from '../config/providers/configFromArgv'
import { configFromEnv } from '../config/providers/configFromEnv'
import { printInfo } from './printInfo'
import { configureWatcher } from './configureWatcher'

export async function run(options: CliArgv): Promise<MockaccinoHttp> {
  const builder = opts().enableFileMocks().detailed()

  const configurationProviders = [
    configFromFile(options.rootDir, options.config),
    configFromEnv(process.env),
    configFromArgv(options)
  ]

  for (const provider of configurationProviders) {
    await provider(builder)
  }

  const config = builder.build()
  const mockhttp = mockHttp(config)

  if (config.watch) {
    configureWatcher(config, mockhttp)
  }

  process.on('SIGTERM', () => mockhttp.close())
  process.on('SIGINT', () => mockhttp.close())

  return mockhttp.start().then(info => {
    printInfo(config, options, info, Pkg)

    return mockhttp
  })
}
