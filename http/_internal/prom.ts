export function isPromise<T>(p: Promise<T> | T): boolean {
  return 'then' in p
}
