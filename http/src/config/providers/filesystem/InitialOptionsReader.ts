import Fs from 'fs'
import Path from 'path'
import { requireOrImportModule } from '@mockdog/core'
import { HttpConfigurationBuilder } from '../../HttpConfigurationBuilder.js'
import { importPlugins } from '../importPlugins.js'
import { InitialOptions } from './InitialOptions.js'

const Files = [
  'mockhttprc.js',
  'mockhttprc.ts',
  'mockhttprc.json',
  'mockhttprc',
  '.mockhttprc.js',
  '.mockhttprc.ts',
  '.mockhttprc.json',
  '.mockhttprc'
]

export function initialOptionsReader(rootDir?: string, configFile?: string) {
  return async function (builder: HttpConfigurationBuilder): Promise<void> {
    let config: InitialOptions | undefined

    rootDir = rootDir ?? process.cwd()

    if (configFile) {
      const path = Path.isAbsolute(configFile) ? configFile : Path.join(rootDir, configFile)

      if (!Fs.existsSync(path)) {
        throw new ReferenceError(`Configuration file ${path} not found.`)
      }

      config = await requireOrImportModule(path)
    } else {
      for (const file of Files) {
        const path = Path.isAbsolute(file) ? file : Path.join(rootDir, file)

        if (Fs.existsSync(path)) {
          config = await requireOrImportModule(path)
          break
        }
      }
    }

    if (!config) {
      return
    }

    builder.file(config)

    if (config.mode) builder.mode(config.mode)

    if (config.http) {
      if (config.http.port) builder.httpPort(config.http.port)
      if (config.http.host) builder.httpHost(config.http.host)
      if (config.http.options) builder.httpOptions(config.http.options)
    }

    if (config.https) {
      if (config.https.port) builder.httpsPort(config.https.port)
      if (config.https.host) builder.httpsHost(config.https.host)
      if (config.https.options) builder.httpsOptions(config.https.options)
    }

    if (config.timeout) builder.timeout(config.timeout)
    if (config.mockDirectory) builder.mockDirectory(config.mockDirectory)
    if (config.mockFilesExtension) builder.mockFileExtension(config.mockFilesExtension)

    if (config.record && config.record.enabled) builder.record(config.record.options)

    if (config.formUrlEncodedOptions) builder.formUrlEncodedOptions(config.formUrlEncodedOptions)
    if (config.multiPartOptions) builder.multiPartOptions(config.multiPartOptions)
    if (config.corsEnabled || config.corsOptions) builder.enableCors(config.corsOptions)
    if (config.cookieSecrets) builder.cookieOptions(config.cookieSecrets)

    if (config.proxy && config.proxy.enabled) {
      if (config.proxy.target) {
        builder.proxy(config.proxy.target, config.proxy.options)
      }
    }

    if (config.watch) {
      builder.watch()
    }

    if (config.plugins) {
      await importPlugins(config.plugins, builder, rootDir)
    }
  }
}
