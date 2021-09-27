import { Metadata } from '@grpc/grpc-js'

export interface Response {
  metadata?: Metadata
  flags?: number
  delay?: number
}
