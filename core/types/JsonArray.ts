import { Json } from './Json.js'

export type JsonArray = Array<string | number | boolean | Date | Json | JsonArray | null>
