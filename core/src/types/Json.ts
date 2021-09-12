import { JsonArray } from './JsonArray'

export interface Json {
  // eslint-disable-next-line no-use-before-define
  [x: string]: string | number | boolean | Date | Json | JsonArray | null
}
