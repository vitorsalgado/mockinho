import Path from 'path'
import { InitialOptions } from '../../config/index.js'

const config: InitialOptions = {
  mode: 'info',

  http: {
    port: 0,
  },

  timeout: 3_600_000,

  mockDirectory: Path.join(__dirname, '_fixtures'),
  mockFilesExtension: 'mock',

  record: {
    enabled: false,
  },

  proxy: {
    enabled: true,
    target: 'http://some.nice.place',
    options: {
      headers: {
        'x-test': 'abc',
        'x-ctx': 'test',
      },
    },
  },

  plugins: ['./_fixtures/plugin-ts.ts'],
}

export default config
