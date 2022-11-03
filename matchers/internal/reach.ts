const FieldRegexp = /(\w+)\[(\d+)](.*)/
const IndexRegexp = /^\[(\d+)](.*)/

export function reach(path: string, obj: Record<string, any>): any {
  if (Array.isArray(obj)) {
    if (!path.startsWith('[')) {
      throw new TypeError('')
    }
  }

  return path.split('.').reduce((p, c) => {
    const f = p[c]

    if (f === undefined) {
      return null
    }

    return f
  }, obj)
}
