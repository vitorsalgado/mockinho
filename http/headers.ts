const sHeaders = Symbol('headers')

export type HeaderListInitTypes =
  | [string, string]
  | Record<string, string | string[] | undefined>
  | string[][]

export class HeaderList {
  private readonly [sHeaders]: Map<string, string>

  constructor(init?: HeaderListInitTypes) {
    this[sHeaders] = new Map<string, string>()
    this.initialize(init)
  }

  append(name: string, value: string): void {
    if (!name || name.length === 0) {
      throw new TypeError('Header name must not be null or empty.')
    }

    const existing = this.get(name)
    const newValue = existing ? existing + ',' + value : value

    this.set(HeaderList.normalizeHeaderName(name), newValue)
  }

  set(name: string, value: string): this {
    if (!name || name.length === 0) {
      throw new TypeError('Header name must not be null or empty.')
    }

    this[sHeaders].set(HeaderList.normalizeHeaderName(name), value)

    return this
  }

  get(key: string): string | undefined {
    return this[sHeaders].get(HeaderList.normalizeHeaderName(key))
  }

  delete(key: string): boolean {
    return this[sHeaders].delete(HeaderList.normalizeHeaderName(key))
  }

  has(key: string): boolean {
    return this[sHeaders].has(HeaderList.normalizeHeaderName(key))
  }

  keys(): IterableIterator<string> {
    return this[sHeaders].keys()
  }

  values(): IterableIterator<string> {
    return this[sHeaders].values()
  }

  entries(): IterableIterator<[string, string]> {
    return this[sHeaders].entries()
  }

  get size(): number {
    return this[sHeaders].size
  }

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this[sHeaders][Symbol.iterator]()
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  toString(): string {
    const str: string[] = []

    for (const [key, value] of this.entries()) {
      str.push(key + ': ' + value)
    }

    return str.join('\n')
  }

  // region Utils

  toObject(): Record<string, string> {
    return Array.from(this[sHeaders]).reduce(
      (obj, [key, value]) => Object.assign(obj, { [key]: value }),
      {},
    )
  }

  merge(headers: HeaderList): void {
    for (const [name, value] of headers) {
      if (!this.has(name)) {
        this.set(name, value)
      }
    }
  }

  isEmpty(): boolean {
    return this[sHeaders].size === 0
  }

  // endregion

  private static normalizeHeaderName(name: string): string {
    return name.toLowerCase()
  }

  private initialize(init?: HeaderListInitTypes): void {
    if (init === null || init === undefined) {
      return
    }

    if (Array.isArray(init)) {
      for (let i = 0; i < init.length; i++) {
        const h = init[i]

        if (h.length !== 2) {
          throw new TypeError('Header init must be an 2d array or an object.')
        }

        const [k, v] = init[i]

        this.append(k, v)
      }
    } else if (typeof init === 'object') {
      for (const [k, v] of Object.entries(init)) {
        if (!this.has(k)) {
          if (Array.isArray(v)) {
            this.set(k, v.join(', '))
          } else {
            this.set(k, v || '')
          }
        }
      }
    }
  }
}
