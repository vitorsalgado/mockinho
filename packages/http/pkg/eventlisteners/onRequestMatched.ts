import { Stream } from 'stream'
import { green, greenBright, gray, bold, italic } from 'colorette'
import { extractPathname } from '@mockinho/core'
import { nowInMs } from '../utils'
import { HttpEvents } from './HttpEvents'
import { ifVerbose } from './ifVerbose'

export function onRequestMatched(event: HttpEvents['requestMatched']): void {
  // eslint-disable-next-line no-console
  console.log(
    `${greenBright(bold('REQUEST MATCHED'))} ${new Date().toISOString()} ${green(
      `<--- ${event.method} ${extractPathname(event.url)}`
    )}` +
      '\n' +
      `${event.method} ${event.url}\n` +
      ifVerbose(
        event.verbose,

        '\n' +
          (event.stub.id || event.stub.sourceDescription || event.stub.name
            ? `${
                green('Stub: ') +
                event.stub.id +
                (event.stub.id && event.stub.name ? ' | ' : '') +
                event.stub.name
              }\n` +
              `${
                event.stub.sourceDescription
                  ? green('Stub File: ') + event.stub.sourceDescription + '\n'
                  : ''
              }`
            : '') +
          `${green('Took: ')}${(nowInMs() - event.start).toFixed(2).toString()} ms\n\n` +
          `${green('Response Definition')}\n` +
          `${green('Status: ')}${event.responseDefinition.status}\n` +
          `${green('Headers:')}\n` +
          `${Object.entries(event.responseDefinition.headers)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')}\n` +
          `${
            event.responseDefinition.body
              ? `${green('Body:')}\n` +
                (event.responseDefinition.body instanceof Buffer
                  ? `${italic(gray('(buffer response body omitted)'))}`
                  : event.responseDefinition.body instanceof Stream
                  ? `${italic(gray('(stream response body omitted)'))}`
                  : JSON.stringify(event.responseDefinition.body))
              : ''
          }\n`
      )
  )
}
