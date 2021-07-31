export function encodeBase64(value: string): string {
  return Buffer.from(value).toString('base64')
}

export function decodeBase64(value: string): string {
  return Buffer.from(value, 'base64').toString()
}
