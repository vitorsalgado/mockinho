import { onProxyRequest } from '../builtin/onProxyRequest'

describe('onProxyRequest', function () {
  it('should log proxy request events', function () {
    onProxyRequest({ target: 'http://example.org' })
  })
})
