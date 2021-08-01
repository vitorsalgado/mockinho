import { chooseStubFileParser } from '../chooseStubFileParser'

describe('chooseStubFileParser', function () {
  it('should throw error when no parser is available for the provided extension', function () {
    expect(() => chooseStubFileParser('json')).not.toThrow()
    expect(() => chooseStubFileParser('yml')).not.toThrow()
    expect(() => chooseStubFileParser('yaml')).not.toThrow()
    expect(() => chooseStubFileParser('md')).toThrow()
  })
})
