export function nowInMs(): number {
  const hrTime = process.hrtime()
  return (hrTime[0] * 1000000 + hrTime[1] / 1000) / 1000
}
