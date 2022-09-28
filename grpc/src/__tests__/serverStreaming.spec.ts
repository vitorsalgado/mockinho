import { Readable } from 'stream'
import * as grpc from '@grpc/grpc-js'
import { ChannelCredentials } from '@grpc/grpc-js'
import { equalsTo } from 'matchers'
import { options } from '../config/mod'
import { mockRpc } from '../mockRpc'
import { serverStreaming } from '../mock/mod'
import { serverStreamingCall } from '../mock/mod'
import * as CitiesService from './proto/cities_grpc_pb'
import { getPackageDefinition } from './utils'
import { City } from './proto/cities_pb'
import { Point } from './proto/cities_pb'
import { CityRequest } from './proto/cities_pb'

jest.setTimeout(3600000)

describe('Server Streaming', function () {
  const $ = mockRpc(options().packageDefinition(getPackageDefinition()))

  beforeAll(async () => {
    await $.start()
  })

  afterAll(async () => {
    await $.finalize()
  })

  afterEach(() => {
    $.resetMocks()
  })

  describe('when mocking a server streaming operation', function () {
    it('should use the provided Readable to stream the response back to the client', async function () {
      const point = new Point()
      point.setLatitude(10)
      point.setLongitude(20)

      const sp = new City()
      sp.setName('sao paulo')
      sp.setCountry('brasil')
      sp.setLocation(point)

      const scl = new City()
      scl.setName('santiago')
      scl.setCountry('chile')
      scl.setLocation(point)

      function* cities() {
        yield sp.toObject()
        yield scl.toObject()
      }

      $.mock(
        serverStreamingCall()
          .method('listCities')
          .meta('test-key', equalsTo(['test-value']))
          .reply(serverStreaming().stream(Readable.from(cities()))),
      )

      const meta = new grpc.Metadata()
      meta.add('test-key', 'test-value')

      const request = new CityRequest()
      request.setName('any')

      const client = new CitiesService.CitiesServiceClient(
        $.serverInfo().address,
        ChannelCredentials.createInsecure(),
      )

      const readable = client.listCities(request, meta)
      const result: Array<City> = []

      for await (const city of readable) {
        result.push(city)
      }

      expect(result).toHaveLength(2)
      expect(result[0].toObject()).toEqual(sp.toObject())
      expect(result[1].toObject()).toEqual(scl.toObject())
    })
  })
})
