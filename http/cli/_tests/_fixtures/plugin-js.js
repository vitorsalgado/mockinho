/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const { okJSON } = require('../../../reply/index.js')
const { get } = require('../../../mock_builder.js')

module.exports = (instance, _config, _opts) => {
  instance.mock(get('/js/plugin').reply(okJSON({ hello: 'world', ctx: 'js' })))
}
