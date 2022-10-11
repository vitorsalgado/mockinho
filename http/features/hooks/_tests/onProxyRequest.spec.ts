import { onProxyRequest } from '../builtin/onProxyRequest.js'

describe('onProxyRequest', function () {
  it('should log proxy request events', function () {
    onProxyRequest({ target: 'http://example.org' })
  })
})
