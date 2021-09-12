import { yellow, yellowBright, bold } from 'colorette'
import { HttpMock } from '../../mock'
import { Hooks } from '../Hooks'

export function onRequestNotMatched(event: Hooks['onRequestNotMatched']): void {
  // eslint-disable-next-line no-console
  console.warn(
    `${yellowBright(bold('REQUEST WAS NOT MATCHED'))} ${new Date().toISOString()} ${yellow(
      `<--- ${event.method} ${event.path}`
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
      `Id: ${mock.id}\n` +
      (mock.name ? `Name: ${mock.name}\n` : '') +
      (mock.sourceDescription ? `File: ${bold(mock.sourceDescription)}` : '') +
      `${tryGetUrlAndMethod(mock)}\n`
  )
}

function tryGetUrlAndMethod(mock: HttpMock): string {
  if (mock.meta.size === 0) {
    return ''
  }

  const str = []

  for (const [key, value] of mock.meta.entries()) {
    str.push(`${key}: ${value}`)
  }

  return str.join('\n')
}
