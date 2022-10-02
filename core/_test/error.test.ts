import { MockDogError } from '../error.js'

describe('MockDogError', function () {
  it('should add lib prefix when none is provided', function () {
    const err = new MockDogError('some failure', 'code-1')

    expect(err.message).toEqual('MockDog: some failure')
    expect(err.code).toEqual('code-1')
  })

  it('should return message as is when it contains a lib prefix', function () {
    const err = new MockDogError('MockDog: some failure', 'code-1')

    expect(err.message).toEqual('MockDog: some failure')
    expect(err.code).toEqual('code-1')
  })
})
