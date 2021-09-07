import { mockHttp } from '..'
import { MockaccinoHttp } from '..'
import Pkg from '../../package.json'
import { Argv } from '../config'
import { opts } from '../config'
import { Defaults } from '../config'
import { readConfigFromFile } from '../config/providers'
import { readConfigFromArgv } from '../config/providers'
import { readConfigFromEnv } from '../config/providers'
import { printInfo } from './printInfo'
import { configureWatcher } from './configureWatcher'

export async function run(options: Argv): Promise<MockaccinoHttp> {
  const builder = opts().enableFileMocks().verbose()

  const configurationProviders = [
    readConfigFromFile(options.rootDir, options.config),
    readConfigFromEnv(process.env),
    readConfigFromArgv(options)
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

  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', async data => {
    const str = data.toString().trim().toLowerCase()

    if (str === Defaults.restartCommand) {
      await mockhttp.rebuild()
    }
  })

  mockhttp.on('close', () => process.stdin.unref())

  return mockhttp.start().then(info => {
    printInfo(config, options, info, Pkg)

    return mockhttp
  })
}
