import { Mock } from './mock.js'

describe('Mock', function () {
  it('should init mock and set a uuid when none is provided', function () {
    const mock = new Mock('', 'test', 1, true, 'code', 'desc', [], [], 0)

    expect(mock.id).toBeDefined()
    expect(mock.name).toEqual('test')
    expect(mock.priority).toEqual(1)
    expect(mock.source).toEqual('code')
    expect(mock.sourceDescription).toEqual('desc')
    expect(mock.matchers).toEqual([])
  })

  it('should keep provided id', function () {
    const mock = new Mock('test-id', 'test', 1, true, 'code', 'desc', [], [], 0)

    expect(mock.id).toEqual('test-id')
  })

  it('should increase hits and mark called true', function () {
    const mock = new Mock('', 'test', 1, true, 'code', 'desc', [], [], 0)

    expect(mock.hits).toEqual(0)

    mock.hit()

    expect(mock.hasBeenCalled()).toBeTruthy()
    expect(mock.hits).toEqual(1)
  })
})
