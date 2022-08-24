export function notEmpty<K, V = unknown>(
  value: Array<K> | Map<K, V> | Set<K> | string,
  message: string = 'Collection argument must not be null or empty.'
): Array<K> | Map<K, V> | Set<K> | string {
  if (value === null || typeof value === 'undefined') {
    throw new Error(message)
  }

  if (typeof value === 'string') {
    if (value.length === 0) {
      throw new Error('String argument must not be zero length.')
    }
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error(message)
    }
  }

  if (value instanceof Set || value instanceof Map) {
    if (value.size === 0) {
      throw new Error(message)
    }
  }

  return value
}
