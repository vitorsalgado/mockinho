import { equalsTo } from '@mockinho/core-matchers'
import { HttpRequest } from '../../HttpRequest'
import { contentType } from '../contentType'

describe('Content Type', function () {
  it('should apply matcher to the header content-type', function () {
    const header = 'application/json'
    const req: HttpRequest = {
      id: '',
      href: '',
      url: '',
      method: 'PATCH',
      headers: {
        'content-type': header
      },
      body: null
    } as any

    expect(contentType(equalsTo(header))(req)).toBeTruthy()
    expect(contentType(header)(req)).toBeTruthy()
  })
})
