import { isNil } from './isNil.js'

export function noNullElements<K, V = unknown>(
  value: Array<K> | Map<K, V> | Set<K>,
  message: string = 'Collection argument must not be empty.'
): Array<K> | Map<K, V> | Set<K> {
  if (Array.isArray(value)) {
    if (value.some(isNil)) {
      throw new Error(message)
    }
  }

  if (value instanceof Set) {
    for (const item of value.values()) {
      if (isNil(item)) {
        throw new Error(message)
      }
    }
  }

  if (value instanceof Map) {
    for (const [k, v] of value.entries()) {
      if (isNil(k) || isNil(v)) {
        throw new Error(message)
      }
    }
  }

  return value
}
