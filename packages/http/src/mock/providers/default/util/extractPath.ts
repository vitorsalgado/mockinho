export function extractPath(url: string): string {
  const q = url.indexOf('?')

  if (q < 0) {
    return url
  }

  return url.substr(0, q)
}
