// package: cities
// file: cities.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from '@grpc/grpc-js'
import * as cities_pb from './cities_pb'

interface ICitiesServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  getCity: ICitiesServiceService_IGetCity
  listCities: ICitiesServiceService_IListCities
  sendCities: ICitiesServiceService_ISendCities
}

interface ICitiesServiceService_IGetCity
  extends grpc.MethodDefinition<cities_pb.CityRequest, cities_pb.City> {
  path: '/cities.CitiesService/GetCity'
  requestStream: false
  responseStream: false
  requestSerialize: grpc.serialize<cities_pb.CityRequest>
  requestDeserialize: grpc.deserialize<cities_pb.CityRequest>
  responseSerialize: grpc.serialize<cities_pb.City>
  responseDeserialize: grpc.deserialize<cities_pb.City>
}
interface ICitiesServiceService_IListCities
  extends grpc.MethodDefinition<cities_pb.CityRequest, cities_pb.City> {
  path: '/cities.CitiesService/ListCities'
  requestStream: false
  responseStream: true
  requestSerialize: grpc.serialize<cities_pb.CityRequest>
  requestDeserialize: grpc.deserialize<cities_pb.CityRequest>
  responseSerialize: grpc.serialize<cities_pb.City>
  responseDeserialize: grpc.deserialize<cities_pb.City>
}
interface ICitiesServiceService_ISendCities
  extends grpc.MethodDefinition<cities_pb.City, cities_pb.CitySummary> {
  path: '/cities.CitiesService/SendCities'
  requestStream: true
  responseStream: false
  requestSerialize: grpc.serialize<cities_pb.City>
  requestDeserialize: grpc.deserialize<cities_pb.City>
  responseSerialize: grpc.serialize<cities_pb.CitySummary>
  responseDeserialize: grpc.deserialize<cities_pb.CitySummary>
}

export const CitiesServiceService: ICitiesServiceService

export interface ICitiesServiceServer {
  getCity: grpc.handleUnaryCall<cities_pb.CityRequest, cities_pb.City>
  listCities: grpc.handleServerStreamingCall<cities_pb.CityRequest, cities_pb.City>
  sendCities: grpc.handleClientStreamingCall<cities_pb.City, cities_pb.CitySummary>
}

export interface ICitiesServiceClient {
  getCity(
    request: cities_pb.CityRequest,
    callback: (error: grpc.ServiceError | null, response: cities_pb.City) => void
  ): grpc.ClientUnaryCall
  getCity(
    request: cities_pb.CityRequest,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: cities_pb.City) => void
  ): grpc.ClientUnaryCall
  getCity(
    request: cities_pb.CityRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (error: grpc.ServiceError | null, response: cities_pb.City) => void
  ): grpc.ClientUnaryCall
  listCities(
    request: cities_pb.CityRequest,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<cities_pb.City>
  listCities(
    request: cities_pb.CityRequest,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<cities_pb.City>
  sendCities(
    callback: (error: grpc.ServiceError | null, response: cities_pb.CitySummary) => void
  ): grpc.ClientWritableStream<cities_pb.City>
  sendCities(
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: cities_pb.CitySummary) => void
  ): grpc.ClientWritableStream<cities_pb.City>
  sendCities(
    options: Partial<grpc.CallOptions>,
    callback: (error: grpc.ServiceError | null, response: cities_pb.CitySummary) => void
  ): grpc.ClientWritableStream<cities_pb.City>
  sendCities(
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (error: grpc.ServiceError | null, response: cities_pb.CitySummary) => void
  ): grpc.ClientWritableStream<cities_pb.City>
}

export class CitiesServiceClient extends grpc.Client implements ICitiesServiceClient {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object)
  public getCity(
    request: cities_pb.CityRequest,
    callback: (error: grpc.ServiceError | null, response: cities_pb.City) => void
  ): grpc.ClientUnaryCall
  public getCity(
    request: cities_pb.CityRequest,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: cities_pb.City) => void
  ): grpc.ClientUnaryCall
  public getCity(
    request: cities_pb.CityRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (error: grpc.ServiceError | null, response: cities_pb.City) => void
  ): grpc.ClientUnaryCall
  public listCities(
    request: cities_pb.CityRequest,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<cities_pb.City>
  public listCities(
    request: cities_pb.CityRequest,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<cities_pb.City>
  public sendCities(
    callback: (error: grpc.ServiceError | null, response: cities_pb.CitySummary) => void
  ): grpc.ClientWritableStream<cities_pb.City>
  public sendCities(
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: cities_pb.CitySummary) => void
  ): grpc.ClientWritableStream<cities_pb.City>
  public sendCities(
    options: Partial<grpc.CallOptions>,
    callback: (error: grpc.ServiceError | null, response: cities_pb.CitySummary) => void
  ): grpc.ClientWritableStream<cities_pb.City>
  public sendCities(
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (error: grpc.ServiceError | null, response: cities_pb.CitySummary) => void
  ): grpc.ClientWritableStream<cities_pb.City>
}
