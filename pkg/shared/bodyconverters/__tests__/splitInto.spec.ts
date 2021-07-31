import { splitInto } from '../splitInto'

describe('splitInto', function () {
  it('should split string into chunks specified by size parameter', function () {
    const str = 'abcdefghijkl'
    const chunks = splitInto(str, 3)

    expect(chunks.length).toEqual(4)
    expect(chunks.join('')).toEqual(str)
  })
})
