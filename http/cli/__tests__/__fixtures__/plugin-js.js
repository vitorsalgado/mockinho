/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const { okJSON } = require('../../../mock/index.js')
const { get } = require('../../../mock/index.js')

module.exports = (instance, _config, _opts) => {
  instance.mock(get('/js/plugin').reply(okJSON({ hello: 'world', ctx: 'js' })))
}
