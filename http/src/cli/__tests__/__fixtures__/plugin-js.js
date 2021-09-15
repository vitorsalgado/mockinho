/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const { okJSON } = require('../../../mock')
const { get } = require('../../../mock')

module.exports = (instance, _config, _opts) => {
  instance.mock(get('/js/plugin').reply(okJSON({ hello: 'world', ctx: 'js' })))
}
