import { Stream } from 'stream'
import { blue, blueBright, bold } from 'colorette'
import { Hooks } from '../Hooks'
import { ifVerbose } from '../utils'

export function onRequestReceived(event: Hooks['onRequestStart']): void {
  const headers = Object.entries(event.headers)
  const hasHeaders = headers.length > 0

  // eslint-disable-next-line no-console
  console.log(
    `${blueBright(bold('REQUEST RECEIVED'))} ${new Date().toISOString()} ${blueBright(
      `---> ${event.method} ${event.path}`
    )}` +
      '\n' +
      `${event.method} ${event.url}\n` +
      ifVerbose(
        event.verbose,
        `${blue('Headers:')}\n` +
          `${
            hasHeaders ? headers.map(([key, value]) => `${key}: ${value}`).join('\n') + '\n' : ''
          }` +
          `${
            event.body !== null &&
            typeof event.body !== 'undefined' &&
            !(
              event.body instanceof Buffer ||
              event.body instanceof Stream ||
              (typeof event.body === 'object' &&
                Object.keys(event.body as Record<string, unknown>).length === 0)
            )
              ? `${blue('Body:')}\n` + JSON.stringify(event.body)
              : ''
          }\n`
      )
  )
}
