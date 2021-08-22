import { Readable } from 'stream'
import { nowInMs } from '@mockinho/core'
import { HttpResponseFixture } from '../../mock'
import { onRequestMatched } from '../onRequestMatched'

describe('onRequestMatched', function () {
  it('should accept a regular event payload', function () {
    onRequestMatched({
      url: 'http://localhost:8080',
      verbose: true,
      start: nowInMs(),
      method: 'PATCH',
      responseDefinition: new HttpResponseFixture(
        200,
        { 'content-type': 'application/json' },
        { test: true },
        [],
        [],
        10
      ),
      mock: {
        id: '',
        name: '',
        sourceDescription: ''
      }
    })
  })

  it('should accept no response body', function () {
    onRequestMatched({
      url: 'http://localhost:8080',
      verbose: true,
      start: nowInMs(),
      method: 'POST',
      responseDefinition: new HttpResponseFixture(
        200,
        { 'content-type': 'application/json' },
        undefined,
        [],
        [],
        10
      ),
      mock: {
        id: '0c349f0f-10c7-49c4-beb2-62da0eda2fb5',
        name: 'stub-test',
        sourceDescription: '__fixtures__/nice-file.json'
      }
    })
  })

  it('should accept a buffer body', function () {
    onRequestMatched({
      url: 'http://localhost:8080',
      verbose: true,
      start: nowInMs(),
      method: 'DELETE',
      responseDefinition: new HttpResponseFixture(
        200,
        { 'content-type': 'application/json' },
        Buffer.from('nice txt'),
        [],
        [],
        10
      ),
      mock: {
        id: '',
        name: 'stub-test',
        sourceDescription: '__fixtures__/nice-file.json'
      }
    })
  })

  it('should accept a stream body', function () {
    function* txt() {
      yield 'start'
      yield '-'
      yield 'end'
    }

    onRequestMatched({
      url: 'http://localhost:8080',
      verbose: true,
      start: nowInMs(),
      method: 'GET',
      responseDefinition: new HttpResponseFixture(
        200,
        { 'content-type': 'application/json' },
        Readable.from(txt(), { objectMode: false }),
        [],
        [],
        10
      ),
      mock: {
        id: '0c349f0f-10c7-49c4-beb2-62da0eda2fb5',
        name: '',
        sourceDescription: '__fixtures__/nice-file.json'
      }
    })
  })
})
