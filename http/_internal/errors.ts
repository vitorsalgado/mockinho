import { format } from 'node:util'

export const ErrorCodes = {
  ERR_UNKNOWN_REASON: 'ERR_UNKNOWN_REASON',

  ERR_NO_MOCK_FOUND: 'ERR_NO_MOCK',
  ERR_PENDING_SCOPE: 'ERR_HTTP_PENDING_SCOPE',
  ERR_INVALID_MOCK_CONFIG: 'ERR_HTTP_INVALID_MOCK_CONFIG',
  ERR_INVALID_MOCK_FILE: 'ERR_HTTP_INVALID_MOCK_FILE',
  ERR_INVALID_RESPONSE_DEFINITION: 'ERR_HTTP_INVALID_RESPONSE_DEFINITION',
  ERR_CONFIG: 'ERR_CONFIG',
  ERR_PROXY: 'ERR_PROXY_ERROR',
}

class LhamaError {
  public readonly name: string
  public readonly message: string

  constructor(
    public readonly code: string,
    message: string,
    solution = '',
    ...args: Array<unknown>
  ) {
    Error.captureStackTrace(this, LhamaError)

    this.name = 'LhamaError'
    this.message =
      solution === ''
        ? format(message, args)
        : `${format(message, args)}\n\nPossible Solution:\n${solution}`
  }

  toString() {
    return `${this.name} [${this.code}]: ${this.message}`
  }

  get [Symbol.toStringTag]() {
    return 'Error'
  }
}

function newError(code: string, message: string, solution: string = ''): LhamaError {
  return new LhamaError(code, message, solution)
}

function code(c: string) {
  return `LHA_ERR_${c}`
}

export const err = {
  ErrNoResponseDefined: () => newError(code('NO_RESPONSE_DEFINED'), 'no response'),
}
