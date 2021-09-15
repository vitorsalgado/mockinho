/* eslint-disable no-console */

import { bold } from 'colorette'
import { Hooks } from '../Hooks'

export function onRecord(event: Hooks['onRecord']): void {
  console.log(`${bold('RECORDED RESPONSE')}`)
  console.log(`${bold('Mock: ')}${event.mock}`)

  if (event.mockBody) {
    console.log(`${bold('Body: ')}${event.mockBody}`)
  }
}
