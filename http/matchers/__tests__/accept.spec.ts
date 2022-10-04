import { contains, equalTo } from '@mockdog/matchers'
import { HttpRequest } from '../../request.js'
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
    const wrong = accept(equalTo('xml'))(req)

    expect(correct.pass).toBeTruthy()
    expect(wrong.pass).toBeFalsy()
  })
})
