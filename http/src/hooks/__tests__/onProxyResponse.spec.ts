/* eslint-disable no-console */

import { nowInMs } from '@mockdog/core'
import { onProxyResponse } from '../builtin/onProxyResponse'

describe('onProxyResponse', function () {
  beforeEach(() => {
    jest.spyOn(console, 'log')
  })

  it('should accept a regular event payload', function () {
    onProxyResponse({
      url: 'http://localhost:8080',
      path: '/',
      verbose: true,
      start: nowInMs(),
      method: 'PATCH',
      response: {
        status: 200,
        headers: { 'content-type': 'application/json' }
      }
    })

    expect(console.log).toHaveBeenCalled()
  })

  it('should log event without headers', function () {
    onProxyResponse({
      url: 'http://localhost:8080',
      path: '/',
      verbose: true,
      start: nowInMs(),
      method: 'PATCH',
      response: {
        status: 200,
        headers: {}
      }
    })

    expect(console.log).toHaveBeenCalled()
  })

  it('should log event not verbose', function () {
    onProxyResponse({
      url: 'http://localhost:8080',
      path: '/',
      verbose: false,
      start: nowInMs(),
      method: 'PATCH',
      response: {
        status: 200,
        headers: {}
      }
    })

    expect(console.log).toHaveBeenCalled()
  })
})
