import { JsonArray } from './JsonArray'

export interface Json {
  [x: string]: string | number | boolean | Date | Json | JsonArray | null | undefined
}
