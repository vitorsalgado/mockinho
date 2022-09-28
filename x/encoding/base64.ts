function encode(value: string): string {
  return Buffer.from(value).toString('base64')
}

function decode(value: string): string {
  return Buffer.from(value, 'base64').toString()
}

export const base64 = {
  encode,
  decode,
}
