import { HttpRequest } from '../../../../http/HttpRequest'
import { fakeMatcherContext } from '../../__tests__/testUtils'
import { containing } from '../../containing'
import { equalsTo } from '../../equalsTo'
import { accept } from '../accept'

describe('Accept', function () {
  it('should apply matcher to the header accept', function () {
    const req: HttpRequest = {
      id: '',
      href: '',
      url: '',
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        accept: 'json'
      },
      body: null
    } as any

    const correct = accept(containing('json'))(req, fakeMatcherContext())
    const wrong = accept(equalsTo('xml'))(req, fakeMatcherContext())

    expect(correct).toBeTruthy()
    expect(wrong).toBeFalsy()
  })
})
