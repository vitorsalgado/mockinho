import { Stream } from 'stream'
import { green, greenBright, gray, bold, italic } from 'colorette'
import { nowInMs } from '@mockinho/core'
import { extractPathname } from './utils'
import { ifVerbose } from './utils'
import { Events } from './Events'

export function onRequestMatched(event: Events['requestMatched']): void {
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
          (event.mock.id || event.mock.sourceDescription || event.mock.name
            ? `${
                green('Mock: ') +
                event.mock.id +
                (event.mock.id && event.mock.name ? ' | ' : '') +
                event.mock.name
              }\n` +
              `${
                event.mock.sourceDescription
                  ? green('Mock File: ') + event.mock.sourceDescription + '\n'
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
