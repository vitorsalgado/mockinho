import { format } from 'node:util'

export class LhamaError {
  public readonly code: string
  public readonly name: string
  public readonly message: string
  public readonly solution: string

  constructor(code: string, message: string, solution = '', ...args: Array<unknown>) {
    Error.captureStackTrace(this, LhamaError)

    this.code = code
    this.name = 'LhamaError'
    this.solution = solution
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

export const coreerr = {
  ErrScopePending: (message: string) => newError(code('SCOPE_PENDING'), message),
  ErrScopeNotPending: (message: string) => newError(code('SCOPE_NOT_PENDING'), message),
  ErrScopedMockNotFound: (id: string) =>
    newError(code('SCOPED_MOCK_NOT_FOUND'), `Scoped mock with id ${id} not found`),

  wrap: (err: LhamaError, message: string) =>
    newError(err.code, message + '\n' + err.message, err.solution),
}
