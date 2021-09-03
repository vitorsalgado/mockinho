import { red } from 'colorette'
import { bold } from 'colorette'
import { HttpServerInfo } from '../HttpServer'

export function parseServerInfo(info: HttpServerInfo): string {
  let res = ''

  if (info.useHttp) {
    res += `http://${info.httpHost}${info.httpPort === 0 ? '' : ':' + info.httpPort}`
  }

  if (info.useHttps) {
    if (res.length > 0) {
      res += ', '
    }

    res += `https://${info.httpsHost}${info.httpsPort === 0 ? '' : ':' + info.httpsPort}`
  }

  return res
}

export function keyValue(input: Array<string>): { [header: string]: string } {
  const header: Record<string, string> = {}

  for (const str of input) {
    const [key, value] = str.split('=')
    header[key] = value
  }

  return header
}

export function isDef<T>(value: T): boolean {
  return typeof value !== 'undefined' && value !== null
}

export function printErrorAndExit(message: string): void {
  // eslint-disable-next-line no-console
  console.error(red(bold('Error: ')) + message)
  process.exit(1)
}
