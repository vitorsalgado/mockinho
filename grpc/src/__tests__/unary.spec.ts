import * as grpc from '@grpc/grpc-js'
import { ChannelCredentials } from '@grpc/grpc-js'
import { equalsTo } from '@mockdog/matchers'
import { options } from '../config/mod'
import { mockRpc } from '../mockRpc'
import { unary } from '../mock/mod'
import { unaryCall } from '../mock/mod'
import * as CitiesService from './proto/cities_grpc_pb'
import { getPackageDefinition } from './utils'
import { City } from './proto/cities_pb'
import { Point } from './proto/cities_pb'
import { CityRequest } from './proto/cities_pb'

describe('Unary', function () {
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

  describe('when mocking a unary call', function () {
    it('should return the mapped response', function (done) {
      const point = new Point()
      point.setLatitude(10)
      point.setLongitude(20)

      const city = new City()
      city.setName('sao paulo')
      city.setCountry('brasil')
      city.setLocation(point)

      $.mock(
        unaryCall()
          .method('getCity')
          .meta('test-key', equalsTo(['test-value']))
          .reply(unary().data(city.toObject()))
      )

      const meta = new grpc.Metadata()
      meta.add('test-key', 'test-value')

      const request = new CityRequest()
      request.setName('sao paulo')

      const client = new CitiesService.CitiesServiceClient(
        $.serverInfo().address,
        ChannelCredentials.createInsecure()
      )

      client.getCity(request, meta, function (err, response) {
        if (err) {
          return done(err)
        }

        expect(response.toObject()).toEqual(city.toObject())

        done()
      })
    })
  })
})
