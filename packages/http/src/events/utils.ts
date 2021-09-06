export function ifVerbose(verbose: boolean, content: string): string {
  if (verbose) {
    return content
  }

  return ''
}
