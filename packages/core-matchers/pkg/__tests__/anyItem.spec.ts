import { anyItem } from '../anyItem'

describe('anyItem', function () {
  it('should return true when any provided item matches with incoming value', function () {
    const items = ['dev', 'js', 'ts']
    const item = 'js'

    const matcher = anyItem(items)

    expect(matcher(item)).toBeTruthy()
    expect(matcher('go')).toBeFalsy()
  })
})
