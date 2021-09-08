require('dotenv').config()

const buildFastify = require('./app')
const server = buildFastify(
  { logger: { level: 'info', prettyPrint: true } },
  {
    api: process.env.API ? process.env.API : 'https://dadosabertos.camara.leg.br/api/v2'
  }
)

server.listen(process.env.PORT ? parseInt(process.env.PORT) : 0, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log('HTTP example server online on: ' + address)
})
