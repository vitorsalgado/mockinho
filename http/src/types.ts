import { Stream } from 'stream'
import { HttpResponseFixtureBuilder } from './mock'
import { HttpMockBuilder } from './mock'
import { Configuration } from './config'

export interface Json {
  // eslint-disable-next-line no-use-before-define
  [x: string]: string | number | boolean | Date | Json | JsonArray | null
}

export type JsonArray = Array<string | number | boolean | Date | Json | JsonArray | null>

export type JsonType = Json | JsonArray

export type Schemes = 'http' | 'https'
export type BodyType = string | Buffer | Stream | undefined | JsonType | unknown | null
export type HttpMethods =
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
