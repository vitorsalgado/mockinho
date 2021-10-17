import { UnaryResponseBuilder } from '../UnaryResponseBuilder'

export function unary(): UnaryResponseBuilder {
  return new UnaryResponseBuilder()
}
