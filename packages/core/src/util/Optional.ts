/* eslint-disable @typescript-eslint/no-non-null-assertion */

export class Optional<T> {
  constructor(public readonly value?: T) {}

  static empty = <T>(): Optional<T> => new Optional<T>()

  static ofNullable = <T>(value?: T): Optional<T> =>
    value ? Optional.of(value) : Optional.empty<T>()

  static of = <T>(value: T): Optional<T> => new Optional(Optional.checkNotNull(value))

  private static checkNotNull<T>(value: T): T {
    if (value === null || typeof value === 'undefined') {
      throw new ReferenceError('value must not be null or undefined.')
    }

    return value
  }

  isEmpty = (): boolean => !this.value

  isPresent = (): boolean => this.value !== null && typeof this.value !== 'undefined'

  // or = (fn: () => T): T => (this.isEmpty() ? fn() : this.value!)

  get = (): T => Optional.checkNotNull(this.value!)

  orValue(value: T): T {
    if (this.value) {
      return this.value
    }

    return value
  }

  orNothing = (): T | undefined => (this.isPresent() ? this.value : undefined)

  map = <R>(mapper: (value: T) => R): Optional<R> =>
    this.isPresent() ? Optional.ofNullable(mapper(this.value!)) : Optional.empty()

  ifPresent = (fn: (value: T | null) => void): void => {
    if (this.isPresent()) {
      fn(this.value!)
    }
  }
}

export const empty = <T>(): Optional<T> => Optional.ofNullable()

export const fromNullable = <T>(value: T): Optional<T> => new Optional<T>(value)
