/* eslint-disable no-console */

import { green, greenBright, bold } from 'colorette'
import { nowInMs } from '@mockdog/core'
import { ifVerbose } from '../utils.js'
import { Hooks } from '../Hooks.js'

export function onProxyResponse(event: Hooks['onProxyResponse']): void {
  const headers = Object.entries(event.response.headers)
  const hasHeaders = headers.length > 0

  console.log(
    `${greenBright(bold('PROXY RESPONSE'))} ${new Date().toISOString()} ${green(
      `<--- ${event.method} ${event.path}`,
    )}` +
      '\n' +
      `${event.method} ${event.url}\n` +
      ifVerbose(
        event.verbose,

        '\n' +
          `${green('Took: ')}${(nowInMs() - event.start).toFixed(2).toString()} ms\n\n` +
          `${green('Response Information')}\n` +
          `${green('Status: ')}${event.response.status}\n` +
          `${
            hasHeaders
              ? `${green('Headers:')}\n` +
                headers.map(([key, value]) => `${key}: ${value}`).join('\n')
              : ''
          }\n`,
      ),
  )
}
