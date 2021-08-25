import { MockaccinoError } from '@mockinho/core'
import { ErrorCodes } from '../types'

export class ConfigError extends MockaccinoError {
  constructor(message: string) {
    super(message, ErrorCodes.ERR_CONFIG)
  }
}
