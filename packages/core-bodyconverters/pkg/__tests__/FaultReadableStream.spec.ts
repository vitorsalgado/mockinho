import { FaultReadableStream } from '../FaultReadableStream'
import { splitInto } from '../splitInto'
import { toJSON } from '../toJSON'

describe('FaultReadableStream', function () {
  it('should process data chunks with the fault promise', async function () {
    const data = { name: 'test', message: 'super nice message', context: 'unit test' }
    const fn = jest.fn()
    const promise = new Promise<void>(resolve => {
      fn()
      return resolve()
    })
    const stream = new FaultReadableStream(splitInto(toJSON(data), 2), promise)

    const res = []

    for await (const chunk of stream) {
      res.push(chunk)
    }

    expect(JSON.parse(res.join(''))).toEqual(data)
    expect(fn).toHaveBeenCalled()
  })
})
