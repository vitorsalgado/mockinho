export function decorate<T, V = unknown>(target: T, prop: keyof T, fn: V | (() => V)) {
  if (typeof fn === 'function') {
    Object.defineProperty(target, prop, {
      get: fn as () => V,
    })
  } else {
    Object.defineProperty(target, prop, {
      value: fn,
    })
  }
}
