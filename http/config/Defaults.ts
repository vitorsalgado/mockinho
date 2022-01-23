import { Mode } from '@mockdog/core'
import { Level } from '@mockdog/core'

export const Defaults = {
  fixturesDir: '__fixtures__',
  port: 0,
  host: 'localhost',
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
      'retry-after'
    ]
  }
}
