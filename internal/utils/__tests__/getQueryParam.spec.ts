import { getQueryParam } from '../getQueryParam'

describe('getQueryParam', function () {
  it('should return only querystring portion of a url', function () {
    const url = 'http://localhost:3000/test?q=product&sort=asc&filter=01&filter=02'
    const qs = getQueryParam(url)

    expect(qs).toEqual('q=product&sort=asc&filter=01&filter=02')
  })

  it('should return query party of a url path', function () {
    const url = '/test?q=product&sort=asc&filter=01&filter=02'
    const qs = getQueryParam(url)

    expect(qs).toEqual('q=product&sort=asc&filter=01&filter=02')
  })
})
