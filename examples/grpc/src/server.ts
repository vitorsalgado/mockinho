/* eslint-disable no-console */

import 'dotenv/config'
import { buildFastify } from './app.js'

const server = buildFastify(
  { logger: { level: 'info', prettyPrint: true } },
  {
    grpcAddress: process.env.API
      ? (process.env.API as string)
      : 'https://dadosabertos.camara.leg.br/api/v2'
  }
)

server.listen(process.env.PORT ? parseInt(process.env.PORT) : 0, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log('HTTP example server online on: ' + address)
})
