import { contains, equalsTo } from 'matchers'
import { HttpRequest } from '../../HttpRequest'
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
        accept: 'json',
      },
      body: null,
    } as any

    const correct = accept(contains('json'))(req)
    const wrong = accept(equalsTo('xml'))(req)

    expect(correct).toBeTruthy()
    expect(wrong).toBeFalsy()
  })
})
