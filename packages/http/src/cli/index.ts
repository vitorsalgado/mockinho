#!/usr/bin/env node

import 'dotenv/config'
import Yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import { Mode } from '@mockinho/core'
import Pkg from '../../package.json'
import { Argv } from '../config'
import { run } from './run'
import { printErrorAndExit } from './utils'
import { Groups } from './groups'

export default Yargs(hideBin(process.argv))
  .scriptName('mockhttp')
  .usage('Usage: $0 [options]')
  .epilog('Take a look on this opensource project on https://github.com/vitorsalgado/mockinho')
  .version('v', Pkg.version)
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .wrap(yargs.terminalWidth() / 2)
  .completion('', 'Generate completion script to your .zshrc, .bashrc or similar')

  .example([
    ['$0', 'Mock server listening on localhost with a random port'],
    ['$0 -p 3000', 'Mock server listening on: http://localhost:3000'],
    [
      '$0 -p 8080 --proxy http://example.org',
      'Mock server listening on port 8080 and forwarding requests to http://example.org'
    ]
  ])

  .options({
    mode: {
      alias: 'm',
      describe: 'Mock server information detail',
      choices: ['silent', 'info', 'trace', 'verbose'] as Array<Mode>,
      type: 'string'
    },

    port: {
      alias: 'p',
      describe: 'HTTP server port',
      group: Groups.http,
      type: 'number',
      defaultDescription: 'Random dynamic port'
    },
    host: {
      describe: 'HTTP server host',
      group: Groups.http,
      type: 'string',
      defaultDescription: 'localhost'
    },
    'no-http': {
      describe:
        'Disable HTTP server. Usually this options is used to disable a configuration from file or environment variable.',
      group: Groups.http,
      type: 'boolean'
    },
    timeout: {
      describe: 'Server timeout',
      group: Groups.server,
      type: 'number',
      defaultDescription: '60000 (1 minute)'
    },
    'https-port': {
      describe: 'HTTPS server port',
      group: Groups.https,
      type: 'number'
    },
    'https-host': {
      describe: 'HTTPS server host',
      group: Groups.https,
      type: 'string'
    },
    'https-key': {
      describe: 'HTTPS cert key',
      group: Groups.https,
      type: 'string'
    },
    'https-cert': {
      describe: 'HTTPS cert',
      group: Groups.https,
      type: 'string'
    },
    'https-ciphers': {
      describe: 'HTTPS ciphers',
      group: Groups.https,
      type: 'string'
    },
    'https-passphrase': {
      describe: 'HTTPS passphrase',
      group: Groups.https,
      type: 'string'
    },
    'https-pfx': {
      describe: 'HTTPS pfx',
      group: Groups.https,
      type: 'string'
    },
    'no-https': {
      describe:
        'Disable HTTPS server. Usually this options is used to disable a configuration from file or environment variable.',
      group: Groups.https,
      type: 'boolean'
    },

    use: {
      describe: 'Custom exported middleware locations',
      group: Groups.server,
      type: 'array'
    },
    cors: {
      describe: 'Enable CORS',
      group: Groups.server,
      type: 'boolean',
      defaultDescription: 'false (disabled)'
    },
    'cookie-secrets': {
      describe: 'Cookie secrets',
      group: Groups.server,
      type: 'array'
    },

    config: {
      alias: 'c',
      describe:
        'The path to a configuration file. If none is provided, Mockaccino will try to find one using the default naming conventions',
      type: 'string'
    },
    'root-dir': {
      describe: 'Root work directory',
      type: 'string'
    },
    'mock-dir': {
      describe: 'Mock files directory. defaults to __fixtures__ relative to the root directory.',
      type: 'string'
    },
    'mock-extension': {
      alias: 'mock-ext',
      describe:
        'Mock files extension modifier. eg: If value is "mock" files need to be similar to: "users.mock.yaml"',
      type: 'string'
    },

    record: {
      alias: 'r',
      describe: 'Enable file record. Prefer to use this option along with --proxy',
      group: Groups.record,
      type: 'boolean'
    },
    'record-dir': {
      describe:
        'The path to a custom directory to receive recorded mocks. If none is used the mock directory will be used.',
      group: Groups.record,
      type: 'string'
    },
    'record-capture-request-headers': {
      describe: 'Request headers to be captured during record',
      group: Groups.record,
      type: 'array'
    },
    'record-capture-response-headers': {
      describe: 'Response headers to be captured during record',
      group: Groups.record,
      type: 'array'
    },

    proxy: {
      describe: 'Run as a forward proxy server',
      group: Groups.proxy,
      type: 'string'
    },
    'no-proxy': {
      describe:
        'Disable forward proxy. Usually this options is used to disable a configuration from file or environment variable.',
      group: Groups.proxy,
      type: 'boolean'
    },
    'proxy-timeout': {
      describe: 'Proxy timeout',
      group: Groups.proxy,
      type: 'number'
    },
    'proxy-headers': {
      describe: 'Extra headers to be added to target requests. Eg: x-context=abc,x-id=100',
      group: Groups.proxy,
      type: 'array'
    },
    'proxy-auth': {
      describe: 'Proxy basic authentication. Eg: user:password',
      group: Groups.proxy,
      type: 'string'
    },
    'proxy-prepend-path': {
      describe: "Prepend the target's path to the proxy path",
      group: Groups.proxy,
      type: 'string'
    },
    'proxy-xfwd': {
      describe: 'Adds x-forward headers',
      group: Groups.proxy,
      type: 'boolean'
    },

    watch: {
      alias: 'w',
      describe: 'Watch mock files for changes and update server automatically',
      group: Groups.watch,
      type: 'boolean',
      defaultDescription: 'false (disabled)'
    },
    'no-watch': {
      describe: 'Disable file watch',
      group: Groups.watch,
      type: 'boolean'
    },

    'log-level': {
      describe: 'Internal log level. For development only.',
      choices: ['silent', 'trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      group: Groups.internal,
      type: 'string'
    }
  })
  .parseAsync()
  .then(argv => run(argv as unknown as Argv).catch(printErrorAndExit))
