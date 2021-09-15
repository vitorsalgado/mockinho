/* eslint-disable no-console */

import { bold } from 'colorette'
import { blueBright } from 'colorette'
import { Hooks } from '../Hooks'

export function onProxyRequest(event: Hooks['onProxyRequest']): void {
  console.log(`${blueBright(bold('PROXYING REQUEST'))}${blueBright(' ---> ' + event.target)}\n`)
}
