/* eslint-disable no-console */

import { bold } from 'colorette'
import { blueBright } from 'colorette'
import { Hooks } from '../Hooks.js'

export function onProxyRequest(event: Hooks['onProxyRequest']): void {
  process.stdout.write(
    `${blueBright(bold('PROXYING REQUEST'))}${blueBright(' ---> ' + event.target)}\n\n`,
  )
}
