import { yellow, yellowBright, bold } from 'colorette'
import { extractPathname, isoDateTime } from '@mockinho/core'
import { HttpStub } from '../stub'
import { HttpEvents } from './HttpEvents'

export function onRequestNotMatched(event: HttpEvents['requestNotMatched']): void {
  // eslint-disable-next-line no-console
  console.warn(
    `${yellowBright(bold('REQUEST WAS NOT MATCHED'))} ${isoDateTime()} ${yellow(
      `<--- ${event.method} ${extractPathname(event.url)}`
    )}`
  )

  const stub = event.closestMatch

  if (!stub) {
    return
  }

  // eslint-disable-next-line no-console
  return console.warn(
    `${yellow('Closest Stub:')}` +
      '\n' +
      `Id: ${stub.id}${stub.name ? '\nName: ' + stub.name : ''}${
        stub.sourceDescription ? '\nFile: ' + bold(stub.sourceDescription) : ''
      }${tryGetUrlAndMethod(stub)}\n`
  )
}

function tryGetUrlAndMethod(stub: HttpStub): string {
  const str = []

  if (stub.meta.has('method')) {
    str.push(stub.meta.get('method'))
  }

  if (stub.meta.has('url')) {
    str.push(stub.meta.get('url'))
  }

  if (str.length > 0) {
    return '\n' + 'Url: ' + bold(str.join(' '))
  }

  return ''
}
