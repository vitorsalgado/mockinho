import { OnMockServed, Result } from '../base/index.js'

export function res(
  name: string,
  message: () => string,
  pass: boolean,
  onMockServed?: OnMockServed,
): Result {
  return { name, pass, message, onMockServed }
}
