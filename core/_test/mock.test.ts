import { Mock } from '../mock.js'

describe('mock', function () {
  it('should init mock and set a uuid when none is provided', function () {
    const mock = new Mock({
      id: '',
      name: 'test',
      priority: 1,
      enabled: true,
      source: 'code',
      sourceDetail: 'desc',
      matchers: [],
      postActions: [],
      hits: 0,
    })

    expect(mock.id).toBeDefined()
    expect(mock.name).toEqual('test')
    expect(mock.priority).toEqual(1)
    expect(mock.source).toEqual('code')
    expect(mock.sourceDetail).toEqual('desc')
    expect(mock.matchers).toEqual([])
  })

  it('should keep provided id', function () {
    const mock = new Mock({ id: 'test-id' })

    expect(mock.id).toEqual('test-id')
  })

  it('should increase hits and mark called true', function () {
    const mock = new Mock({
      hits: 10,
    })

    expect(mock.hits).toEqual(10)

    mock.inc()

    expect(mock.hasBeenCalled()).toBeTruthy()
    expect(mock.hits).toEqual(11)
  })
})
