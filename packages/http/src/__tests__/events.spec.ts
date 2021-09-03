import Supertest from 'supertest'
import { equalsTo } from '@mockinho/core-matchers'
import { opts } from '..'
import { post } from '..'
import { urlPath } from '..'
import { MediaTypes } from '..'
import { jsonPath } from '..'
import { ok } from '..'
import { Headers } from '..'
import { mockHttp } from '..'

describe('Events', function () {
  const $ = mockHttp(opts().dynamicHttpPort().formUrlEncodedOptions({ limit: 80 }))

  it('should trigger attach event listener', async function () {
    const start = jest.fn()
    const req = jest.fn()
    const close = jest.fn()
    const matched = jest.fn()
    const notMatched = jest.fn()
    const complete = jest.fn()

    $.on('started', evt => start(evt.info))
      .on('closed', close)
      .on('request', req)
      .on('requestMatched', matched)
      .on('requestNotMatched', notMatched)
      .on('complete', complete)

    await $.start()

    $.mock(
      post(urlPath('/test'))
        .header('content-type', equalsTo(MediaTypes.APPLICATION_FORM_URL_ENCODED))
        .requestBody(jsonPath('name', equalsTo('the name')))
        .reply(ok())
    )

    await Supertest($.server())
      .post('/test')
      .set(Headers.ContentType, MediaTypes.APPLICATION_FORM_URL_ENCODED)
      .send('name=the+name&description=some+description&age=32&job=teacher&job=developer')
      .expect(200)

    await Supertest($.server()).get('/none').expect(500)

    await $.close()

    expect(start).toHaveBeenCalledTimes(1)
    expect(req).toHaveBeenCalledTimes(2)
    expect(close).toHaveBeenCalledTimes(1)
    expect(matched).toHaveBeenCalledTimes(1)
    expect(notMatched).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(2)
  })
})
