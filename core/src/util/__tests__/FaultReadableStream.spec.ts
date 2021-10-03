import { FaultReadableStream } from '../FaultReadableStream'
import { splitInto } from '../splitInto'

describe('FaultReadableStream', function () {
  it('should process data chunks with the fault promise', async function () {
    const data = { name: 'test', message: 'super nice message', context: 'unit test' }
    const fn = jest.fn()
    const promise = new Promise<void>(resolve => {
      fn()
      return resolve()
    })
    const stream = new FaultReadableStream(splitInto(JSON.stringify(data), 2), promise)

    const res: Array<string> = []

    for await (const chunk of stream) {
      res.push(chunk)
    }

    expect(JSON.parse(res.join(''))).toEqual(data)
    expect(fn).toHaveBeenCalled()
  })
})
