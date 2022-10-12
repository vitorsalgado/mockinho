/* eslint-disable no-console */

import { nowInMs } from '@mockdog/x'
import { onProxyResponse } from '../builtin/onProxyResponse.js'

describe('onProxyResponse', function () {
  beforeEach(() => {
    jest.spyOn(process.stdout, 'write')
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
        headers: { 'content-type': 'application/json' },
      },
    })

    expect(process.stdout.write).toHaveBeenCalled()
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
        headers: {},
      },
    })

    expect(process.stdout.write).toHaveBeenCalled()
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
        headers: {},
      },
    })

    expect(process.stdout.write).toHaveBeenCalled()
  })
})
