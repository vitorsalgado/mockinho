import { yellow, yellowBright, bold } from 'colorette'
import { HttpMock } from '../mock'
import { Events } from './Events'
import { extractPathname } from './utils'

export function onRequestNotMatched(event: Events['requestNotMatched']): void {
  // eslint-disable-next-line no-console
  console.warn(
    `${yellowBright(bold('REQUEST WAS NOT MATCHED'))} ${new Date().toISOString()} ${yellow(
      `<--- ${event.method} ${extractPathname(event.url)}`
    )}`
  )

  const mock = event.closestMatch

  if (!mock) {
    return
  }

  // eslint-disable-next-line no-console
  return console.warn(
    `${yellow('Closest Mock:')}` +
      '\n' +
      `Id: ${mock.id}${mock.name ? '\nName: ' + mock.name : ''}${
        mock.sourceDescription ? '\nFile: ' + bold(mock.sourceDescription) : ''
      }${tryGetUrlAndMethod(mock)}\n`
  )
}

function tryGetUrlAndMethod(mock: HttpMock): string {
  const str = []

  if (mock.meta.has('method')) {
    str.push(mock.meta.get('method'))
  }

  if (mock.meta.has('url')) {
    str.push(mock.meta.get('url'))
  }

  if (str.length > 0) {
    return '\n' + 'Url: ' + bold(str.join(' '))
  }

  return ''
}
