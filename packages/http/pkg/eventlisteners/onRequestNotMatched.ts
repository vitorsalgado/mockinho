import Chalk from 'chalk'
import { extractPathname, isoDateTime } from '@mockinho/core'
import { HttpStub } from '../stub'
import { HttpEvents } from './HttpEvents'

export function onRequestNotMatched(event: HttpEvents['requestNotMatched']): void {
  // eslint-disable-next-line no-console
  console.warn(
    `${Chalk.yellowBright.bold('REQUEST WAS NOT MATCHED')} ${isoDateTime()} ${Chalk.yellow(
      `<--- ${event.method} ${extractPathname(event.url)}`
    )}`
  )

  const stub = event.closestMatch

  if (!stub) {
    return
  }

  // eslint-disable-next-line no-console
  return console.warn(
    `${Chalk.yellow('Closest Stub:')}` +
      '\n' +
      `Id: ${stub.id}${stub.name ? '\nName: ' + stub.name : ''}${
        stub.sourceDescription ? '\nFile: ' + Chalk.bold(stub.sourceDescription) : ''
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
    return '\n' + 'Url: ' + Chalk.bold(str.join(' '))
  }

  return ''
}
