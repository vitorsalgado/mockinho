import { HttpRequest } from '../../../../http/HttpRequest'
import { fakeMatcherContext } from '../../__tests__/testUtils'
import { equalsTo } from '../../equalsTo'
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

    expect(contentType(equalsTo(header))(req, fakeMatcherContext())).toBeTruthy()
    expect(contentType(header)(req, fakeMatcherContext())).toBeTruthy()
  })
})
