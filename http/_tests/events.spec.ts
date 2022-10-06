import Supertest from 'supertest'
import { equalTo } from '@mockdog/matchers'
import { opts } from '../index.js'
import { post } from '../index.js'
import { urlPath } from '../index.js'
import { MediaTypes } from '../index.js'
import { field } from '../index.js'
import { ok } from '../index.js'
import { H } from '../index.js'
import { mockHttp } from '../index.js'

describe('Events', function () {
  const $ = mockHttp(opts().dynamicHttpPort().formUrlEncodedOptions({ limit: 80 }))

  it('should trigger attach event listener', async function () {
    const start = jest.fn()
    const req = jest.fn()
    const close = jest.fn()
    const matched = jest.fn()
    const notMatched = jest.fn()
    const complete = jest.fn()

    $.on('onStart', evt => start(evt.info))
      .on('onClose', close)
      .on('onRequestStart', req)
      .on('onRequestMatched', matched)
      .on('onRequestNotMatched', notMatched)
      .on('onRequestEnd', complete)

    await $.start()

    $.mock(
      post(urlPath('/test'))
        .header('content-type', equalTo(MediaTypes.APPLICATION_FORM_URL_ENCODED))
        .requestBody(field('name', equalTo('the name')))
        .reply(ok()),
    )

    await Supertest($.listener())
      .post('/test')
      .set(H.ContentType, MediaTypes.APPLICATION_FORM_URL_ENCODED)
      .send('name=the+name&description=some+description&age=32&job=teacher&job=developer')
      .expect(200)

    await Supertest($.listener()).get('/none').expect(500)

    await $.close()

    expect(start).toHaveBeenCalledTimes(1)
    expect(req).toHaveBeenCalledTimes(2)
    expect(close).toHaveBeenCalledTimes(1)
    expect(matched).toHaveBeenCalledTimes(1)
    expect(notMatched).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledTimes(2)
  })
})
