import { Matcher } from '@mockdog/core'

const UUID_REGEX =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i

export const isUUID = (): Matcher<string> =>
  function isUUID(value): boolean {
    return typeof value === 'string' && UUID_REGEX.test(value)
  }
