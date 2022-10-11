import { Stream } from 'stream'
import { blue, blueBright, bold } from 'colorette'
import { Hooks } from '../Hooks.js'
import { ifVerbose } from '../utils.js'

export function onRequestReceived(event: Hooks['onRequestStart']): void {
  const headers = Object.entries(event.headers)
  const hasHeaders = headers.length > 0

  // eslint-disable-next-line no-console
  process.stdout.write(
    `${blueBright(bold('REQUEST RECEIVED'))} ${new Date().toISOString()} ${blueBright(
      `---> ${event.method} ${event.path}`,
    )}` +
      '\n' +
      bold(`${event.method} ${event.url}\n`) +
      ifVerbose(
        event.verbose,
        `${
          hasHeaders
            ? `${blue('Headers:')}\n` + headers.map(([key, value]) => `${key}: ${value}`).join('\n')
            : ''
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
              ? `\n${blue('Body:')}\n` + JSON.stringify(event.body)
              : ''
          }\n`,
      ) +
      '\n',
  )
}
