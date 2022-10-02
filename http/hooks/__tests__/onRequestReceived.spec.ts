/* eslint-disable no-console */

import { Readable } from 'stream'
import { MediaTypes } from '../../http.js'
import { onRequestReceived } from '../builtin/onRequestReceived'

describe('onRequestReceived', function () {
  beforeEach(() => {
    jest.spyOn(console, 'log')
  })

  it('should log more data when in verbose mode', function () {
    onRequestReceived({
      verbose: true,
      method: 'PATCH',
      url: 'http://localhost:3000/test',
      path: '/test',
      headers: { 'content-type': MediaTypes.APPLICATION_JSON },
      body: Buffer.from('data'),
    })

    expect(console.log).toHaveBeenCalled()
  })

  it('should log some data when not in verbose mode', function () {
    onRequestReceived({
      verbose: false,
      method: 'POST',
      url: 'http://localhost:3000/test',
      path: '/test',
      headers: {},
      body: 'data',
    })

    expect(console.log).toHaveBeenCalled()
  })

  it('should log request body when it is a object', function () {
    onRequestReceived({
      verbose: false,
      method: 'PUT',
      url: 'http://localhost:3000/test',
      path: '/test',
      headers: { 'content-type': MediaTypes.APPLICATION_JSON },
      body: { hello: 'world' },
    })

    expect(console.log).toHaveBeenCalled()
  })

  it('should not log body when body is object with no keys', function () {
    onRequestReceived({
      verbose: false,
      method: 'PUT',
      url: 'http://localhost:3000/test',
      path: '/test',
      headers: { 'content-type': MediaTypes.APPLICATION_JSON },
      body: {},
    })

    expect(console.log).toHaveBeenCalled()
  })

  it('should not log body when it a stream', function () {
    function* txt() {
      yield 'start'
      yield '-'
      yield 'end'
    }

    onRequestReceived({
      verbose: false,
      method: 'PUT',
      url: 'http://localhost:3000/test',
      path: '/test',
      headers: { 'content-type': MediaTypes.APPLICATION_JSON },
      body: Readable.from(txt(), { objectMode: false }),
    })

    expect(console.log).toHaveBeenCalled()
  })
})
