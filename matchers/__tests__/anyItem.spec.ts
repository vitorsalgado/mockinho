import { noop } from '../_test.js'
import { anyItem } from '../anyItem.js'

describe('anyItem', function () {
  it('should return true when any provided item matches with incoming value', function () {
    const items = ['dev', 'js', 'ts']
    const item = 'js'

    const matcher = anyItem(...items)

    expect(matcher(item, noop())).toBeTruthy()
    expect(matcher('go', noop())).toBeFalsy()
  })
})
