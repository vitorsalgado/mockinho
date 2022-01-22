import { validate } from 'uuid'
import { Mock } from '../Mock'

describe('Mock', function () {
  it('should init mock and set a uuid when none is provided', function () {
    const mock = new Mock(
      '',
      'test',
      1,
      'code',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    expect(validate(mock.id)).toBeTruthy()
    expect(mock.name).toEqual('test')
    expect(mock.priority).toEqual(1)
    expect(mock.source).toEqual('code')
    expect(mock.sourceDescription).toEqual('desc')
    expect(mock.expectations).toEqual([])
    expect(mock.statefulExpectations()).toEqual([])
    expect(mock.meta.size).toEqual(0)
    expect(mock.properties.size).toEqual(0)
  })

  it('should keep provided id', function () {
    const mock = new Mock(
      'test-id',
      'test',
      1,
      'code',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    expect(mock.id).toEqual('test-id')
  })

  it('should increase hits and mark called true', function () {
    const mock = new Mock(
      '',
      'test',
      1,
      'code',
      'desc',
      [],
      [],
      0,
      new Map<string, unknown>(),
      new Map<string, unknown>()
    )

    expect(mock.hits).toEqual(0)

    mock.hit()

    expect(mock.hasBeenCalled()).toBeTruthy()
    expect(mock.hits).toEqual(1)
  })
})
