/* eslint-disable no-console */

import { bold } from 'colorette'
import { Hooks } from '../Hooks.js'

export function onRecord(event: Hooks['onRecord']): void {
  process.stdout.write(`${bold('RECORDED RESPONSE')}\n`)
  process.stdout.write(`${bold('Mock: ')}${event.mock}\n`)

  if (event.mockBody) {
    process.stdout.write(`${bold('Body: ')}${event.mockBody}\n`)
  }
}
