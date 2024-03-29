/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const Path = require('path')

module.exports = {
  mode: 'silent',

  http: {
    port: 0,
  },

  timeout: 3_600_000,

  mockDirectory: Path.join(__dirname, '_fixtures'),
  mockFilesExtension: 'test-js',

  record: {
    enabled: false,
  },

  proxy: {
    enabled: false,
  },

  plugins: ['./_fixtures/plugin-js.js'],
}
