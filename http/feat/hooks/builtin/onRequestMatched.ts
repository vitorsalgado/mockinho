import { Stream } from 'stream'
import { green, greenBright, gray, bold, italic } from 'colorette'
import { nowInMs } from '@mockdog/x'
import { ifVerbose } from '../utils.js'
import { Hooks } from '../Hooks.js'

export function onRequestMatched(event: Hooks['onRequestMatched']): void {
  const headers = Object.entries(event.responseDefinition.headers)
  const hasHeaders = headers.length > 0

  // eslint-disable-next-line no-console
  process.stdout.write(
    `${greenBright(bold('REQUEST MATCHED'))} ${new Date().toISOString()} ${green(
      `<--- ${event.method} ${event.path}`,
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
          `${hasHeaders ? headers.map(([key, value]) => `${key}: ${value}`).join('\n') : ''}\n` +
          `${
            event.responseDefinition.body
              ? `${green('Body:')}\n` +
                (event.responseDefinition.body instanceof Buffer
                  ? `${italic(gray('(buffer response body omitted)'))}`
                  : event.responseDefinition.body instanceof Stream
                  ? `${italic(gray('(stream response body omitted)'))}`
                  : JSON.stringify(event.responseDefinition.body))
              : ''
          }\n`,
      ) +
      '\n',
  )
}
