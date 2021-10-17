// GENERATED CODE -- DO NOT EDIT!

'use strict'
const grpc = require('@grpc/grpc-js')
const cities_pb = require('./cities_pb.js')

function serialize_cities_City(arg) {
  if (!(arg instanceof cities_pb.City)) {
    throw new Error('Expected argument of type cities.City')
  }
  return Buffer.from(arg.serializeBinary())
}

function deserialize_cities_City(buffer_arg) {
  return cities_pb.City.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_cities_CityRequest(arg) {
  if (!(arg instanceof cities_pb.CityRequest)) {
    throw new Error('Expected argument of type cities.CityRequest')
  }
  return Buffer.from(arg.serializeBinary())
}

function deserialize_cities_CityRequest(buffer_arg) {
  return cities_pb.CityRequest.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_cities_CitySummary(arg) {
  if (!(arg instanceof cities_pb.CitySummary)) {
    throw new Error('Expected argument of type cities.CitySummary')
  }
  return Buffer.from(arg.serializeBinary())
}

function deserialize_cities_CitySummary(buffer_arg) {
  return cities_pb.CitySummary.deserializeBinary(new Uint8Array(buffer_arg))
}

const CitiesServiceService = (exports.CitiesServiceService = {
  getCity: {
    path: '/cities.CitiesService/GetCity',
    requestStream: false,
    responseStream: false,
    requestType: cities_pb.CityRequest,
    responseType: cities_pb.City,
    requestSerialize: serialize_cities_CityRequest,
    requestDeserialize: deserialize_cities_CityRequest,
    responseSerialize: serialize_cities_City,
    responseDeserialize: deserialize_cities_City
  },
  listCities: {
    path: '/cities.CitiesService/ListCities',
    requestStream: false,
    responseStream: true,
    requestType: cities_pb.CityRequest,
    responseType: cities_pb.City,
    requestSerialize: serialize_cities_CityRequest,
    requestDeserialize: deserialize_cities_CityRequest,
    responseSerialize: serialize_cities_City,
    responseDeserialize: deserialize_cities_City
  },
  sendCities: {
    path: '/cities.CitiesService/SendCities',
    requestStream: true,
    responseStream: false,
    requestType: cities_pb.City,
    responseType: cities_pb.CitySummary,
    requestSerialize: serialize_cities_City,
    requestDeserialize: deserialize_cities_City,
    responseSerialize: serialize_cities_CitySummary,
    responseDeserialize: deserialize_cities_CitySummary
  }
})

exports.CitiesServiceClient = grpc.makeGenericClientConstructor(CitiesServiceService)
