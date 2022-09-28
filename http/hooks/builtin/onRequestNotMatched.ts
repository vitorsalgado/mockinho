/* eslint-disable no-console */

import { yellow, yellowBright, bold } from 'colorette'
import { HttpMock } from '../../mock/index.js'
import { Hooks } from '../Hooks.js'

export function onRequestNotMatched(event: Hooks['onRequestNotMatched']): void {
  console.warn(
    `${yellowBright(bold('REQUEST NOT MATCHED'))} ${new Date().toISOString()} ${yellow(
      `<--- ${event.method} ${event.path}`,
    )}`,
  )

  if (!event.verbose) {
    console.warn()
    return
  }

  const mock = event.closestMatch

  if (!mock) {
    console.warn()
    return
  }

  return console.warn(
    `${yellow('Closest Mock:')}` +
      '\n' +
      `Id: ${mock.id}\n` +
      (mock.name ? `Name: ${mock.name}\n` : '') +
      (mock.sourceDescription ? `File: ${bold(mock.sourceDescription)}` : '') +
      `${tryGetUrlAndMethod(mock)}\n`,
  )
}

function tryGetUrlAndMethod(mock: HttpMock): string {
  if (mock.meta.size === 0) {
    return ''
  }

  return Array.from(mock.meta.entries())
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}