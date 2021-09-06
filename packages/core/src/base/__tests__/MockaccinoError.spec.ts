import { MockaccinoError } from '../MockaccinoError'

describe('MockaccinoError', function () {
  it('should add lib prefix when none is provided', function () {
    const err = new MockaccinoError('some failure', 'code-1')

    expect(err.message).toEqual('Mockaccino: some failure')
    expect(err.code).toEqual('code-1')
  })

  it('should return message as is when it contains a lib prefix', function () {
    const err = new MockaccinoError('Mockaccino: some failure', 'code-1')

    expect(err.message).toEqual('Mockaccino: some failure')
    expect(err.code).toEqual('code-1')
  })
})
