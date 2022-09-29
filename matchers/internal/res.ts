import { Result } from '../base/index.js'

export function res(
  name: string,
  message: () => string,
  pass: boolean,
  onMockServed?: () => void,
): Result {
  return { name, pass, message, onMockServed }
}
