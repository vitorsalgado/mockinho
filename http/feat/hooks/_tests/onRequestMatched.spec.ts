/* eslint-disable no-console */

import { Readable } from 'stream'
import { nowInMs } from '@mockdog/x'
import { HeaderList } from '../../../headers.js'
import { SrvResponse } from '../../../reply/index.js'
import { onRequestMatched } from '../builtin/onRequestMatched.js'

describe('onRequestMatched', function () {
  beforeEach(() => {
    jest.spyOn(process.stdout, 'write')
  })

  it('should accept a regular event payload', function () {
    onRequestMatched({
      url: 'http://localhost:8080',
      path: '/',
      verbose: true,
      start: nowInMs(),
      method: 'PATCH',
      responseDefinition: new SrvResponse(
        200,
        undefined,
        new HeaderList({ 'content-type': 'application/json' }),
        { test: true },
        new HeaderList(),
        [],
        [],
        10,
      ),
      mock: {
        id: '',
        name: '',
        sourceDescription: '',
      },
    })

    expect(process.stdout.write).toHaveBeenCalled()
  })

  it('should accept no response body', function () {
    onRequestMatched({
      url: 'http://localhost:8080',
      path: '/',
      verbose: true,
      start: nowInMs(),
      method: 'POST',
      responseDefinition: new SrvResponse(
        200,
        undefined,
        new HeaderList({ 'content-type': 'application/json' }),
        undefined,
        new HeaderList(),
        [],
        [],
        10,
      ),
      mock: {
        id: '0c349f0f-10c7-49c4-beb2-62da0eda2fb5',
        name: 'stub-test',
        sourceDescription: '_fixtures/nice-file.json',
      },
    })

    expect(process.stdout.write).toHaveBeenCalled()
  })

  it('should accept a buffer body', function () {
    onRequestMatched({
      url: 'http://localhost:8080/test',
      path: '/test',
      verbose: true,
      start: nowInMs(),
      method: 'DELETE',
      responseDefinition: new SrvResponse(
        200,
        undefined,
        new HeaderList({ 'content-type': 'application/json' }),
        Buffer.from('nice txt'),
        new HeaderList(),
        [],
        [],
        10,
      ),
      mock: {
        id: '',
        name: 'stub-test',
        sourceDescription: '_fixtures/nice-file.json',
      },
    })

    expect(process.stdout.write).toHaveBeenCalled()
  })

  it('should accept a stream body', function () {
    function* txt() {
      yield 'start'
      yield '-'
      yield 'end'
    }

    onRequestMatched({
      url: 'http://localhost:8080',
      path: '/',
      verbose: true,
      start: nowInMs(),
      method: 'GET',
      responseDefinition: new SrvResponse(
        200,
        undefined,
        new HeaderList({ 'content-type': 'application/json' }),
        Readable.from(txt(), { objectMode: false }),
        new HeaderList(),
        [],
        [],
        10,
      ),
      mock: {
        id: '0c349f0f-10c7-49c4-beb2-62da0eda2fb5',
        name: '',
        sourceDescription: '_fixtures/nice-file.json',
      },
    })

    expect(process.stdout.write).toHaveBeenCalled()
  })
})
