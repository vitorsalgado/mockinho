import { Mode } from '@mockinho/core'
import { Level } from '@mockinho/core'

export const Defaults = {
  fixturesDir: '__fixtures__',
  port: 0,
  host: '127.0.0.1',
  mode: 'verbose' as Mode,
  timeout: 5 * 60 * 1000,
  rootDir: process.cwd(),
  logLevel: 'error' as Level,
  mocksExtension: 'mock',
  restartCommand: 'rs',
  watch: false,
  record: false,
  proxy: false,
  recordOptions: {
    captureRequestHeaders: ['accept', 'content-type'],
    captureResponseHeaders: [
      'content-type',
      'link',
      'content-length',
      'cache-control',
      'retry-after',
      'date',
      'access-control-expose-headers',
      'connection'
    ]
  }
}
