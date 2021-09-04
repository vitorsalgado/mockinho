import { chooseMockFileParser } from '../chooseMockFileParser'

describe('chooseMockFileParser', function () {
  it('should throw error when no parser is available for the provided extension', function () {
    expect(() => chooseMockFileParser('json')).not.toThrow()
    expect(() => chooseMockFileParser('yml')).not.toThrow()
    expect(() => chooseMockFileParser('yaml')).not.toThrow()
    expect(() => chooseMockFileParser('md')).toThrow()
  })
})
