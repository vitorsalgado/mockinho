export function reach<T>(path: string, obj: T): any {
  return path.split('.').reduce((p: any, c) => (p && p[c]) || null, obj)
}
