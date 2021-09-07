import Path from 'path'
import { InitialOptions } from '../../config'

const config: InitialOptions = {
  mode: 'info',

  http: {
    port: 0
  },

  timeout: 3_600_000,

  mockDirectory: Path.join(__dirname, '__fixtures__'),
  mockFilesExtension: 'mock',

  record: {
    enabled: false
  },

  proxy: {
    enabled: true,
    target: 'http://some.nice.place',
    options: {
      headers: {
        'x-test': 'abc',
        'x-ctx': 'test'
      }
    }
  },

  middlewares: []
}

export default config
