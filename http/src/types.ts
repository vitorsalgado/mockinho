import { Stream } from 'stream'
import { HttpResponseFixtureBuilder } from './mock'
import { HttpMockBuilder } from './mock'
import { Configuration } from './config'

export type Schemes = 'http' | 'https'
export type BodyType =
  | string
  | Buffer
  | Stream
  | undefined
  | Record<string, unknown>
  | unknown
  | null
export type HttpMethods =
  | string
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT'
export type DefaultConfiguration = Configuration
export type DefaultResponseBuilder = HttpResponseFixtureBuilder
export type DefaultMockBuilder = HttpMockBuilder
