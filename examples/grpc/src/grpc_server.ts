import Path from 'path'
import * as grpc from '@grpc/grpc-js'
import { ServerUnaryCall, ServerWritableStream } from '@grpc/grpc-js'
import { sendUnaryData } from '@grpc/grpc-js'
import { ServerReadableStream } from '@grpc/grpc-js'
import { ServerDuplexStream } from '@grpc/grpc-js'
import * as ProtoLoader from '@grpc/proto-loader'
import { PackageDefinition } from '@grpc/proto-loader'

const paths = [
  Path.join(process.cwd(), 'protos', 'chat.proto'),
  Path.join(process.cwd(), 'protos', 'cities.proto')
]
const packageDefinition = ProtoLoader.loadSync(paths, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})
const services = grpc.loadPackageDefinition(packageDefinition) as any

interface Point {
  latitude: number
  longitude: number
}

interface City {
  name: string
  country: string
  location: Point
}

interface CityRequest {
  name: string
}

interface CitySummary {
  total: number
}

interface ChatMessage {
  message: string
  action: string
}

const cities: Array<City> = [
  {
    name: 'Santiago',
    country: 'Chile',
    location: {
      latitude: 10,
      longitude: 20
    }
  },
  {
    name: 'Sao Paulo',
    country: 'Brasil',
    location: {
      latitude: 30,
      longitude: 40
    }
  },
  {
    name: 'Buenos Aires',
    country: 'Argentina',
    location: {
      latitude: 50,
      longitude: 60
    }
  }
]

function getCity(call: ServerUnaryCall<CityRequest, City>, callback: sendUnaryData<City>): void {
  callback(null, { name: 'Santiago', country: 'Chile', location: { latitude: 10, longitude: 20 } })
}

function listCities(call: ServerWritableStream<CityRequest, City>): void {
  for (const city of cities) {
    call.write(city)
  }

  call.end()
}

function sendCities(
  call: ServerReadableStream<City, CitySummary>,
  callback: sendUnaryData<CitySummary>
): void {
  let count = 0

  call.on('data', city => {
    cities.push(city)
    count++
  })

  call.on('end', () => {
    callback(null, { total: count })
  })
}

function chat(call: ServerDuplexStream<ChatMessage, ChatMessage>): void {
  call.on('data', message => {
    call.write({ message: `Replying: ${message.message} - Message: Hello`, action: 'RESPONSE' })
  })

  call.on('end', () => {
    call.end({ message: 'Farewell', action: 'END' })
  })
}

export function getPackageDefinition(): PackageDefinition {
  return packageDefinition
}

export function getServer(): grpc.Server {
  const server = new grpc.Server()

  server.addService(services.cities.CitiesService.service, {
    getCity,
    listCities,
    sendCities
  })

  server.addService(services.chat.ChatService.service, {
    chat
  })

  return server
}

if (require.main === module) {
  const server = getServer()

  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    process.on('SIGTERM', () => server.forceShutdown())
    process.on('SIGINT', () => server.forceShutdown())

    server.start()

    // eslint-disable-next-line no-console
    console.log('Example gRPC server connection on: 0.0.0.0:50051')
  })
}
