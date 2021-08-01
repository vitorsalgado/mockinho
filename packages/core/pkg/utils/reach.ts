export const reach = <T>(path: string, obj: T): any => {
  return path.split('.').reduce((p: any, c) => {
    return (p && p[c]) || null
  }, obj)
}
