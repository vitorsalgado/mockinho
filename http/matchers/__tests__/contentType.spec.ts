import { equalTo } from '@mockdog/matchers'
import { HttpRequest } from '../../request.js'
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
        'content-type': header,
      },
      body: null,
    } as any

    expect(contentType(equalTo(header))(req).pass).toBeTruthy()
    expect(contentType(header)(req).pass).toBeTruthy()
  })
})
