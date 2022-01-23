import { JsonArray } from './JsonArray.js'

export interface Json {
  [x: string]: string | number | boolean | Date | Json | JsonArray | null | undefined
}
