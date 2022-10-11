import { contains, equalTo } from '@mockdog/matchers'
import { SrvRequest } from '../../../request.js'
import { accept } from '../accept.js'

describe('Accept', function () {
  it('should apply matcher to the header accept', function () {
    const req: SrvRequest = {
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
