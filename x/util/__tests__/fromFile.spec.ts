import Path from 'path'
import { fromFile } from '../fromFile'

describe('fromFile', function () {
  it('should return a readable stream from a file', async function () {
    const stream = fromFile(Path.join(__dirname, 'test.txt'))
    const content: Array<string> = []

    for await (const line of stream) {
      content.push(line)
    }

    expect(content.join()).toEqual('Hello\nWorld\n')
  })

  it('should throw error when file does not exists', function () {
    expect(() => fromFile(Path.join(__dirname, 'nonexistent.txt'))).toThrow()
  })
})
