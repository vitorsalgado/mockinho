import { Stream } from 'stream'
import Chalk from 'chalk'
import { extractPathname } from '@mockinho/core'
import { HttpEvents } from './HttpEvents'
import { ifVerbose } from './ifVerbose'

export function onRequestMatched(event: HttpEvents['requestMatched']): void {
  // eslint-disable-next-line no-console
  console.log(
    `\n${Chalk.greenBright.bold('REQUEST MATCHED')} ${new Date().toISOString()} ${Chalk.green(
      `<--- ${event.method} ${extractPathname(event.url)}`
    )}` +
      '\n' +
      `${event.method} ${event.url}\n` +
      ifVerbose(
        event.verbose,

        '\n' +
          (event.stub.id || event.stub.sourceDescription || event.stub.name
            ? `${
                Chalk.green('Stub: ') +
                event.stub.id +
                (event.stub.id ? ' | ' : '') +
                event.stub.name
              }\n` +
              `${
                event.stub.sourceDescription
                  ? Chalk.green('Stub File: ') + event.stub.sourceDescription + '\n'
                  : ''
              }\n`
            : '') +
          `${Chalk.green('Response Definition:')}\n` +
          `${Chalk.green('Status: ')}${event.responseDefinition.status}\n` +
          `${Chalk.green('Headers:')}\n` +
          `${Object.entries(event.responseDefinition.headers)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')}\n` +
          `${
            event.responseDefinition.body
              ? `${Chalk.green('Body:')}\n` +
                (event.responseDefinition.body instanceof Buffer
                  ? `${Chalk.italic.gray('(Buffer Body)')}`
                  : event.responseDefinition.body instanceof Stream
                  ? `${Chalk.italic.gray('(Stream Body)')}`
                  : JSON.stringify(event.responseDefinition.body))
              : ''
          }`
      )
  )
}
