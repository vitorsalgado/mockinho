'use strict'

const Path = require('path')

module.exports = {
  mode: 'silent',

  http: {
    port: 0
  },

  timeout: 3_600_000,

  mockDirectory: Path.join(__dirname, '__fixtures__'),
  mockFilesExtension: 'test-js',

  record: {
    enabled: false
  },

  proxy: {
    enabled: false
  },

  preHandlerMiddlewares: []
}
