import { UnaryResponseBuilder } from '../UnaryResponseBuilder.js'

export function clientStreaming(): UnaryResponseBuilder {
  return new UnaryResponseBuilder()
}
