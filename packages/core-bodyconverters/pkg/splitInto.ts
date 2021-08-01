export function splitInto(data: string, size: number): Array<string> {
  return data.match(new RegExp(`.{1,${size}}`, 'g')) as Array<string>
}
