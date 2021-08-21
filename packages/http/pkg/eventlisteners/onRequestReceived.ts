import { Stream } from 'stream'
import { blue, blueBright, bold } from 'colorette'
import { extractPathname } from '@mockinho/core'
import { HttpEvents } from './HttpEvents'
import { ifVerbose } from './ifVerbose'

export function onRequestReceived(event: HttpEvents['requestReceived']): void {
  // eslint-disable-next-line no-console
  console.log(
    `${blueBright(bold('REQUEST RECEIVED'))} ${new Date().toISOString()} ${blueBright(
      `---> ${event.method} ${extractPathname(event.url)}`
    )}` +
      '\n' +
      `${event.method} ${event.url}\n` +
      ifVerbose(
        event.verbose,
        `${blue('Headers:')}\n` +
          `${Object.entries(event.headers)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')}\n` +
          `${
            event.body !== null &&
            typeof event.body !== 'undefined' &&
            !(
              event.body instanceof Buffer ||
              event.body instanceof Stream ||
              (typeof event.body === 'object' && Object.keys(event.body as any).length === 0)
            )
              ? `${blue('Body:')}\n` + JSON.stringify(event.body) + '\n'
              : ''
          }`
      )
  )
}
