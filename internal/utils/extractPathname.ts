export function extractPathname(url: string): string {
  return url.substr(0, url.indexOf('?'))
}
