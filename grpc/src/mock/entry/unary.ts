import { UnaryResponseBuilder } from '../UnaryResponseBuilder.js'

export function unary(): UnaryResponseBuilder {
  return new UnaryResponseBuilder()
}
