import { anyItem } from '../anyItem.js'

describe('anyItem', function () {
  it('should return true when any provided item matches with incoming value', function () {
    const matcher = anyItem(...['dev', 'js', 'ts'])

    expect(matcher('js').pass).toBeTruthy()
    expect(matcher('go').pass).toBeFalsy()
  })
})
