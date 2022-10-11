/* eslint-disable no-console */

import { yellow, yellowBright, bold } from 'colorette'
import { Hooks } from '../Hooks.js'

export function onRequestNotMatched(event: Hooks['onRequestNotMatched']): void {
  process.stdout.write(
    `${yellowBright(bold('REQUEST NOT MATCHED'))} ${new Date().toISOString()} ${yellow(
      `<--- ${event.method} ${event.path}`,
    )}`,
  )

  if (!event.verbose) {
    process.stdout.write('\n')
    return
  }

  const mock = event.closestMatch

  if (!mock) {
    process.stdout.write('\n')
    return
  }

  process.stdout.write(
    `${yellow('Closest Mock:')}` +
      '\n' +
      `Id: ${mock.id}\n` +
      (mock.name ? `Name: ${mock.name}\n` : '') +
      (mock.sourceDescription ? `File: ${bold(mock.sourceDescription)}` : '' + '\n'),
  )
}
