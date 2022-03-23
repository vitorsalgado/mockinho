export function isStr(val: unknown): val is string {
  return typeof val === 'string'
}
