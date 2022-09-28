import { Readable } from 'stream'

export function stringify(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object' || Buffer.isBuffer(value) || value instanceof Readable) {
    return '<omitted>'
  }

  return JSON.stringify(value)
}
