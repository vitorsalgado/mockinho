import Path from 'path'
import { notBlank, notNull } from '@mockinho/core'
import { Matcher } from '@mockinho/core'
import { isPresent } from '@mockinho/core-matchers'
import { matching } from '@mockinho/core-matchers'
import { equalsTo } from '@mockinho/core-matchers'
import { anything } from '@mockinho/core-matchers'
import { item } from '@mockinho/core-matchers'
import { containing } from '@mockinho/core-matchers'
import { anyOf } from '@mockinho/core-matchers'
import { jsonPath } from '@mockinho/core-matchers'
import { isUUID } from '@mockinho/core-matchers'
import { allOf } from '@mockinho/core-matchers'
import { not } from '@mockinho/core-matchers'
import { upperCase } from '@mockinho/core-matchers'
import { lowerCase } from '@mockinho/core-matchers'
import { endsWith } from '@mockinho/core-matchers'
import { hitTimes } from '@mockinho/core-matchers'
import { hasLength } from '@mockinho/core-matchers'
import { startsWith } from '@mockinho/core-matchers'
import { trim } from '@mockinho/core-matchers'
import { Configurations } from '../../config'
import { urlPath, urlPathMatching } from '../../matchers'
import { HttpStubBuilder, response } from '../../stub'
import { InvalidStubFileError } from './InvalidStubFileError'
import { StubFile } from './StubFile'
import { textCaseProperties } from './utils/textCaseProperties'
import { getSingleMatcherFromObjectKeys } from './utils/getSingleMatcherFromObjectKeys'
import { findRequiredParameter } from './utils/findRequiredParameter'
import { findRequiredMatcherEntry } from './utils/findRequiredMatcherEntry'
import { findOptionalParameter } from './utils/findOptionalParameter'
import { FieldParser } from './FieldParser'

export function buildStubFromFile<Config extends Configurations>(
  configurations: Config,
  fieldParsers: Array<FieldParser>,
  stub: StubFile,
  filename: string
): HttpStubBuilder {
  notNull(configurations)
  notNull(stub)
  notBlank(filename)

  const builder = new HttpStubBuilder('file', filename).inspect(configurations.isVerbose)

  if (stub.id) builder.id(stub.id)
  if (stub.name) builder.name(stub.name)
  if (stub.priority) builder.priority(stub.priority)

  if (stub.request.method) builder.method(discoverMatcherByValue(stub.request.method, fieldParsers))

  if (stub.request.url) builder.url(equalsTo(stub.request.url))
  else if (stub.request.urlPath) builder.url(urlPath(stub.request.urlPath))
  else if (stub.request.urlPattern) builder.url(matching(stub.request.urlPattern as any))
  else if (stub.request.urlPathPattern)
    builder.url(urlPathMatching(stub.request.urlPathPattern as any))

  if (stub.request.querystring) {
    for (const [key, value] of Object.entries(stub.request.querystring)) {
      if (typeof value !== 'object') {
        builder.query(key, equalsTo(value) as any)
      } else {
        const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(value))
        builder.query(
          key,
          discoverMatcherByKey(filename, matcherKey, value[matcherKey], value, fieldParsers)
        )
      }
    }
  }

  if (stub.request.headers) {
    for (const [key, value] of Object.entries(stub.request.headers)) {
      if (typeof value !== 'object') {
        builder.header(key.toLowerCase(), equalsTo(value))
      } else {
        const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(value))
        builder.header(
          key,
          discoverMatcherByKey(filename, matcherKey, value[matcherKey], value, fieldParsers)
        )
      }
    }
  }

  if (stub.request.body) {
    if (typeof stub.request.body !== 'object') {
      builder.requestBody(equalsTo(stub.request.body) as any)
    } else {
      if (Object.keys(stub.request.body).length > 0) {
        const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(stub.request.body))
        builder.requestBody(
          discoverMatcherByKey(
            filename,
            matcherKey,
            stub.request.body[matcherKey],
            stub.request.body,
            fieldParsers
          )
        )
      }
    }
  }

  if (stub.request.files) {
    for (const [key, value] of Object.entries(stub.request.files)) {
      if (typeof value !== 'object') {
        if (value === '*' || value === 'anything' || value === 'any') {
          builder.file(key.toLowerCase(), anything())
        } else if (value === 'isPresent') {
          builder.file(key.toLowerCase(), isPresent())
        }
      } else {
        const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(value))
        builder.file(
          key,
          discoverMatcherByKey(filename, matcherKey, value[matcherKey], value, fieldParsers)
        )
      }
    }
  }

  if (stub.scenario) {
    builder.scenario(stub.scenario.name, stub.scenario.requiredState, stub.scenario.newState)
  }

  const res = response().status(stub.response.status ?? 200)

  if (stub.response.headers) res.headers(stub.response.headers)
  if (stub.response.delayInMs) res.delayInMs(stub.response.delayInMs)

  if (stub.response.proxyFrom) {
    res.proxyHeaders(stub.response.proxyHeaders)
    res.proxyFrom(stub.response.proxyFrom)
  } else {
    if (stub.response.bodyFile) {
      if (Path.isAbsolute(stub.response.bodyFile)) {
        res.bodyFile(stub.response.bodyFile)
      } else {
        res.bodyFile(Path.resolve(Path.dirname(filename), stub.response.bodyFile))
      }
    } else if (stub.response.body) res.body(stub.response.body)
  }

  builder.reply(res)

  for (const additionalBuilder of fieldParsers) {
    additionalBuilder.parse(configurations, filename, stub, builder)
  }

  return builder
}

// region Utils

function discoverMatcherByValue(
  value: string,
  parsers: Array<FieldParser>,
  def = equalsTo
): Matcher<any> {
  if (value === '*' || value === 'any' || value === 'anything') {
    return anything()
  } else if (value === 'isPresent') {
    return isPresent()
  } else if (value === 'isUUID') {
    return isUUID()
  } else {
    let matcher: Matcher<unknown> | undefined

    for (const parser of parsers) {
      matcher = parser.discoverMatcherByValue(value)

      if (matcher) {
        return matcher
      }
    }

    return def(value)
  }
}

function discoverMatcherByKey(
  filename: string,
  key: string,
  values: any,
  root: any,
  parsers: Array<FieldParser>
): Matcher<any> {
  const valueIsText = typeof values === 'string'
  const valueEntries = Object.entries(values)

  // Matchers
  // ---

  if (key === 'urlPath') {
    const textCase = textCaseProperties(root)
    return urlPath(values, textCase.ignoreCase, textCase.locale)
  } else if (key === 'urlPathMatching' || key === 'urlPathPattern') {
    return urlPathMatching(values)
  } else if (key === 'contains' || key === 'containing') {
    return containing(values)
  } else if (key === 'url' || key === 'equals' || key === 'equalsTo') {
    const textCase = textCaseProperties(root)
    return equalsTo(values, textCase.ignoreCase, textCase.locale)
  } else if (key === 'matching' || key === 'regex') {
    return matching(values)
  } else if (key === 'endsWith') {
    return endsWith(values)
  } else if (key === 'startsWith') {
    return startsWith(values)
  } else if (key === 'hasLength') {
    return hasLength(values)
  } else if (key === 'isPresent') {
    return isPresent()
  } else if (key === 'isUUID') {
    return isUUID()
  } else if (key === 'times' || key === 'hitTimes') {
    return hitTimes(values)
  } else if (key === 'not') {
    if (valueIsText) {
      return not(discoverMatcherByValue(values, parsers))
    }

    const [notK, notV] = Object.entries(values)[0]

    return not(discoverMatcherByKey(filename, notK, notV, values, parsers))
  } else if (key === 'jsonPath' || key === 'fieldPath') {
    const path = findRequiredParameter<string>(
      'path',
      valueEntries,
      filename,
      '"jsonPath" needs a json key path.'
    )
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"jsonPath" requires a matcher to apply on the json key. Eg.: "jsonPath": { path: "data.message", equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return jsonPath(path as string, discoverMatcherByKey(filename, k, v, matcherEntry, parsers))
  } else if (key === 'anyOf') {
    const anyOfMatchers = []

    for (const entry of values) {
      // noinspection SuspiciousTypeOfGuard
      if (typeof entry === 'string') {
        anyOfMatchers.push(discoverMatcherByValue(entry, parsers))
        continue
      }

      for (const [k, v] of Object.entries(entry)) {
        anyOfMatchers.push(discoverMatcherByKey(filename, k, v, entry, parsers))
      }
    }

    return anyOf(...anyOfMatchers)
  } else if (key === 'allOf') {
    const allOfMatchers = []

    for (const entry of values) {
      for (const [k, v] of Object.entries(entry)) {
        allOfMatchers.push(discoverMatcherByKey(filename, k, v, entry, parsers))
      }
    }

    return allOf(...allOfMatchers)
  } else if (key === 'item') {
    const index = findRequiredParameter<number>(
      'index',
      valueEntries,
      filename,
      '"items" needs "index" parameter.'
    )
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"item" requires a matcher. Eg.: "item": { index: 1, equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return item(index, discoverMatcherByKey(filename, k, v, matcherEntry, parsers))
  }

  // Matcher Transformers
  // ---
  else if (key === 'lowerCase') {
    const locales = findOptionalParameter('locale', valueEntries, undefined)
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"lowerCase" requires a matcher. Eg.: "lowerCase": { equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return lowerCase(discoverMatcherByKey(filename, k, v, matcherEntry, parsers), locales)
  } else if (key === 'upperCase') {
    const locales = findOptionalParameter('locale', valueEntries, undefined)
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"upperCase" requires a matcher. Eg.: "upperCase": { equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return upperCase(discoverMatcherByKey(filename, k, v, matcherEntry, parsers), locales)
  } else if (key === 'trim') {
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"trim" requires a matcher. Eg.: "trim": { equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return trim(discoverMatcherByKey(filename, k, v, matcherEntry, parsers))
  }

  // Will try to find one in the additional builders
  else {
    let matcher: Matcher<unknown> | undefined

    for (const parser of parsers) {
      matcher = parser.discoverMatcherByKey(filename, key, values, root)

      if (matcher) {
        return matcher
      }
    }

    // No Matcher Found
    // Throw Error
    throw new InvalidStubFileError(`No matcher found for: ${key} -- ${values} in ${root}`, filename)
  }
}

// endregion
