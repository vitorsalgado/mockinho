export function extractPathname(url: string): string {
  return url.substr(0, url.indexOf('?'))
}

export function ifVerbose(verbose: boolean, content: string): string {
  if (verbose) {
    return content
  }

  return ''
}
