export type JsonArray = Array<string | number | boolean | Date | Json | JsonArray | null>

export interface Json {
  [x: string]: string | number | boolean | Date | Json | JsonArray | null | undefined
}

export type JsonType = Json | JsonArray
