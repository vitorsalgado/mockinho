/* eslint-disable no-console */

import { inspectedMatcher } from '../inspectedMatcher'
import { Mock } from '../Mock'
import { Matcher } from '../Matcher'

describe('inspectedMatcher', function () {
  const equalsTo = (expectation: string) => (value: string) => expectation === value

  const expectation = {
    matcher: equalsTo('test') as Matcher<unknown>,
    weight: 1,
    valueGetter: () => 'dev'
  }

  const mock = new Mock('id', 'test', 1, 'code', '', [expectation], [], 0, new Map(), new Map())

  it('should log when result is false', function () {
    jest.spyOn(console, 'log').mockImplementation()

    inspectedMatcher(expectation, mock)('dev')

    expect(console.log).toHaveBeenCalledTimes(3)
  })

  it('should log just one time when result is true', function () {
    jest.spyOn(console, 'log').mockImplementation()

    inspectedMatcher(expectation, mock)('test')

    expect(console.log).toHaveBeenCalledTimes(1)
  })

  it('should log with source description filled', function () {
    const mock = new Mock(
      'id',
      'test',
      1,
      'file',
      'file://someplace',
      [expectation],
      [],
      0,
      new Map(),
      new Map()
    )

    jest.spyOn(console, 'log').mockImplementation()

    inspectedMatcher(expectation, mock)('test')

    expect(console.log).toHaveBeenCalledTimes(1)
  })

  it('should log mock id instead of name when name is empty', function () {
    const mock = new Mock('id', '', 1, 'file', '', [expectation], [], 0, new Map(), new Map())

    jest.spyOn(console, 'log').mockImplementation()

    inspectedMatcher(expectation, mock)('test')

    expect(console.log).toHaveBeenCalledTimes(1)
  })
})
