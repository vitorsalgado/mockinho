import { Json } from './Json'

export type JsonArray = Array<string | number | boolean | Date | Json | JsonArray | null>
