'use strict'

const Fastify = require('fastify')
const Axios = require('axios').default
const { MediaTypes } = require('@mockdog/http')

module.exports = function buildFastify(opts, config) {
  const app = Fastify(opts)

  Axios.defaults.baseURL = config.api

  app.get('/deputies', (request, reply) =>
    Axios.request({
      url: `/deputados?siglaPartido=${request.query.party}`,
      method: 'get',
      responseType: 'json',
      headers: {
        'content-type': MediaTypes.APPLICATION_JSON
      }
    })
      .then(result => reply.status(200).send(result.data.dados))
      .catch(error => reply.status(500).send({ message: error.message }))
  )

  return app
}
