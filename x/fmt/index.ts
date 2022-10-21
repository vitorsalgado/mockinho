import prettyFormat from 'pretty-format'

function stringify(v: unknown): string {
  return prettyFormat(v, { min: true })
}

function indent(str: string, c: number = 2, i: string = ' '): string {
  return str.replace(/^/gm, i.repeat(c))
}

export const fmt = {
  stringify,
  indent,
}
