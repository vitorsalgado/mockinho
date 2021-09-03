/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Fs from 'fs'
import Path from 'path'
import { ServerOptions } from 'https'
import { Options } from 'http-proxy-middleware'
import { Level } from '@mockinho/core'
import { CliArgv } from '../CliArgv'
import { ConfigBuilder } from '../ConfigBuilder'
import { isDef } from '../../cli/utils'
import { keyValue } from '../../cli/utils'
import { rec } from '../../rec/rec'
import { importMiddlewaresFromConfig } from './importMiddlewaresFromConfig'

export function configFromArgv(argv: CliArgv) {
  return async function (builder: ConfigBuilder): Promise<void> {
    if (isDef(argv.noHttp) && argv.noHttp) {
      builder.disableHttp()
    } else {
      if (isDef(argv.port)) builder.httpPort(argv.port!)
      if (argv.host) builder.httpHost(argv.host)
    }

    if (isDef(argv.noHttps) && argv.noHttps) {
      builder.disableHttps()
    } else {
      if (isDef(argv.httpsPort) || argv.httpsHost) {
        if (isDef(argv.httpsPort)) builder.httpsPort(argv.httpsPort!)
        if (argv.httpsHost) builder.httpsHost(argv.httpsHost)

        const opts = {} as ServerOptions

        if (isDef(argv.httpsKey)) opts.key = Fs.readFileSync(Path.resolve(argv.httpsKey!))
        if (isDef(argv.httpsCert)) opts.cert = Fs.readFileSync(Path.resolve(argv.httpsCert!))
        if (isDef(argv.httpsCiphers)) opts.ciphers = argv.httpsCiphers
        if (isDef(argv.httpsPassphrase)) opts.passphrase = argv.httpsPassphrase
        if (isDef(argv.httpsPfx)) opts.pfx = argv.httpsPfx

        builder.httpsOptions(opts)
      }
    }

    if (isDef(argv.cors)) builder.enableCors(argv.cors)

    if (argv.cookieSecrets) builder.cookieOptions(argv.cookieSecrets)

    if (argv.timeout) builder.timeout(argv.timeout)
    if (argv.mode) builder.mode(argv.mode)
    if (argv.logLevel) builder.logLevel(argv.logLevel as Level)

    if (argv.rootDir) builder.rootDir(Path.resolve(argv.rootDir))
    if (argv.mockDir) builder.mockDirectory(Path.resolve(argv.mockDir))
    if (argv.mockExtension) builder.mockFileExtension(argv.mockExtension)

    if (isDef(argv.noProxy) && argv.noProxy) {
      builder.enableProxy(false)
    } else {
      if (argv.proxy) {
        const opts = {} as Options

        opts.target = argv.proxy

        if (isDef(argv.proxyTimeout)) opts.proxyTimeout = argv.proxyTimeout
        if (argv.proxyHeaders) opts.headers = keyValue(argv.proxyHeaders)
        if (argv.proxyAuth) opts.auth = argv.proxyAuth
        if (isDef(argv.proxyPrependPath) && argv.proxyPrependPath)
          opts.prependPath = argv.proxyPrependPath
        if (isDef(argv.proxyXfwd) && argv.proxyXfwd) opts.xfwd = argv.proxyXfwd

        builder.enableProxy(opts)
      }
    }

    if (isDef(argv.record)) {
      if (argv.record) {
        const recOptions = rec()

        if (argv.recordDir) recOptions.destination(argv.recordDir)
        if (argv.recordRequestHeaders)
          recOptions.captureRequestHeaders(...argv.recordRequestHeaders)
        if (argv.recordResponseHeaders)
          recOptions.captureResponseHeaders(...argv.recordResponseHeaders)

        builder.record(recOptions)
      } else {
        builder.record(false)
      }
    }

    if (isDef(argv.watch) && argv.watch) builder.watch(argv.watch)

    if (argv.use) {
      await importMiddlewaresFromConfig(argv.use, builder)
    }
  }
}