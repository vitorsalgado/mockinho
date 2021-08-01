import { extractPathname } from '@mockinho/core'
import Chalk from 'chalk'
import { Stream } from 'stream'
import { HttpEvents } from './HttpEvents'
import { ifVerbose } from './ifVerbose'

export function onRequestReceived(event: HttpEvents['requestReceived']): void {
  // eslint-disable-next-line no-console
  console.log(
    `\n${Chalk.blueBright.bold('REQUEST RECEIVED')} ${new Date().toISOString()} ${Chalk.blueBright(
      `---> ${event.method} ${extractPathname(event.url)}`
    )}` +
      '\n' +
      `${event.method} ${event.url}\n` +
      ifVerbose(
        event.verbose,
        `${Chalk.blue('Headers:')}\n` +
          `${Object.entries(event.headers)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')}\n` +
          `${
            event.body && !(event.body instanceof Buffer || event.body instanceof Stream)
              ? `${Chalk.blue('Body:')}\n` + JSON.stringify(event.body)
              : ''
          }`
      )
  )
}
