import { Readable } from 'stream'
import { onRequestMatched } from '../onRequestMatched'
import { HttpResponseDefinition } from '../../stub'

describe('onRequestMatched', function () {
  it('should accept a regular event payload', function () {
    onRequestMatched({
      url: 'http://localhost:8080',
      verbose: true,
      method: 'PATCH',
      responseDefinition: new HttpResponseDefinition(
        200,
        { 'content-type': 'application/json' },
        { test: true },
        10
      ),
      stub: {
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
      method: 'POST',
      responseDefinition: new HttpResponseDefinition(
        200,
        { 'content-type': 'application/json' },
        undefined,
        10
      ),
      stub: {
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
      method: 'DELETE',
      responseDefinition: new HttpResponseDefinition(
        200,
        { 'content-type': 'application/json' },
        Buffer.from('nice txt'),
        10
      ),
      stub: {
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
      method: 'GET',
      responseDefinition: new HttpResponseDefinition(
        200,
        { 'content-type': 'application/json' },
        Readable.from(txt(), { objectMode: false }),
        10
      ),
      stub: {
        id: '0c349f0f-10c7-49c4-beb2-62da0eda2fb5',
        name: '',
        sourceDescription: '__fixtures__/nice-file.json'
      }
    })
  })
})
