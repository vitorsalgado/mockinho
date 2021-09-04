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
import { toUpperCase } from '@mockinho/core-matchers'
import { toLowerCase } from '@mockinho/core-matchers'
import { endsWith } from '@mockinho/core-matchers'
import { repeatTimes } from '@mockinho/core-matchers'
import { hasLength } from '@mockinho/core-matchers'
import { startsWith } from '@mockinho/core-matchers'
import { trim } from '@mockinho/core-matchers'
import { Configuration } from '../../../config'
import { urlPath, urlPathMatching } from '../../../matchers'
import { HttpMockBuilder, response } from '../..'
import { HttpResponseFixtureBuilder } from '../..'
import { multipleResponses } from '../../entry/multipleResponses'
import { InvalidMockFileError } from './InvalidMockFileError'
import { MockFile } from './MockFile'
import { MockFileResponse } from './MockFile'
import { textCaseProperties } from './utils/textCaseProperties'
import { getSingleMatcherFromObjectKeys } from './utils/getSingleMatcherFromObjectKeys'
import { findRequiredParameter } from './utils/findRequiredParameter'
import { findRequiredMatcherEntry } from './utils/findRequiredMatcherEntry'
import { findOptionalParameter } from './utils/findOptionalParameter'
import { FieldParser } from './FieldParser'

export function buildMockFromFile<Config extends Configuration>(
  configuration: Config,
  mock: MockFile,
  filename: string
): HttpMockBuilder {
  notNull(configuration)
  notNull(mock)
  notBlank(filename)

  const builder = new HttpMockBuilder('file', filename)

  if (mock.id) builder.id(mock.id)
  if (mock.name) builder.name(mock.name)
  if (mock.priority) builder.priority(mock.priority)

  if (mock.request.method) {
    builder.method(discoverMatcherByValue(mock.request.method, configuration.mockFieldParsers))
  }

  if (mock.request.url) builder.url(equalsTo(mock.request.url))
  else if (mock.request.urlPath) builder.url(urlPath(mock.request.urlPath))
  else if (mock.request.urlPattern) builder.url(matching(mock.request.urlPattern as any))
  else if (mock.request.urlPathPattern)
    builder.url(urlPathMatching(mock.request.urlPathPattern as any))

  if (mock.request.querystring) {
    for (const [key, value] of Object.entries(mock.request.querystring)) {
      if (typeof value !== 'object') {
        builder.query(key, equalsTo(value) as any)
      } else {
        const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(value))
        builder.query(
          key,
          discoverMatcherByKey(
            filename,
            matcherKey,
            value[matcherKey],
            value,
            configuration.mockFieldParsers
          )
        )
      }
    }
  }

  if (mock.request.headers) {
    for (const [key, value] of Object.entries(mock.request.headers)) {
      if (typeof value !== 'object') {
        builder.header(key.toLowerCase(), equalsTo(value))
      } else {
        const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(value))
        builder.header(
          key,
          discoverMatcherByKey(
            filename,
            matcherKey,
            value[matcherKey],
            value,
            configuration.mockFieldParsers
          )
        )
      }
    }
  }

  if (mock.request.body) {
    if (typeof mock.request.body !== 'object') {
      builder.requestBody(equalsTo(mock.request.body) as any)
    } else {
      if (Object.keys(mock.request.body).length > 0) {
        const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(mock.request.body))
        builder.requestBody(
          discoverMatcherByKey(
            filename,
            matcherKey,
            mock.request.body[matcherKey],
            mock.request.body,
            configuration.mockFieldParsers
          )
        )
      }
    }
  }

  if (mock.request.files) {
    for (const [key, value] of Object.entries(mock.request.files)) {
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
          discoverMatcherByKey(
            filename,
            matcherKey,
            value[matcherKey],
            value,
            configuration.mockFieldParsers
          )
        )
      }
    }
  }

  if (mock.scenario) {
    builder.scenario(mock.scenario.name, mock.scenario.requiredState, mock.scenario.newState)
  }

  if (mock.response) {
    if (Array.isArray(mock.response)) {
      const multiple = multipleResponses().type(mock.responseType)

      if (
        mock.returnErrorOnNoResponse !== null &&
        typeof mock.returnErrorOnNoResponse !== 'undefined'
      ) {
        multiple.errorOnNotFound(mock.returnErrorOnNoResponse)
      }

      for (const response of mock.response) {
        multiple.add(buildResponse(response, filename))
      }

      builder.reply(multiple.build())
    } else {
      builder.reply(buildResponse(mock.response, filename).build())
    }
  }

  for (const additionalBuilder of configuration.mockFieldParsers) {
    additionalBuilder.parse(configuration, filename, mock, builder)
  }

  return builder
}

// region Utils

function buildResponse(mock: MockFileResponse, filename: string): HttpResponseFixtureBuilder {
  const res = response().status(mock.status ?? 200)

  if (mock.headers) res.headers(mock.headers)
  if (mock.latency) res.latency(mock.latency)

  if (mock.proxyFrom) {
    res.proxyHeaders(mock.proxyHeaders)
    res.proxyFrom(mock.proxyFrom)
  } else {
    if (mock.bodyFile) {
      if (Path.isAbsolute(mock.bodyFile)) {
        res.bodyFile(mock.bodyFile)
      } else {
        res.bodyFile(Path.resolve(Path.dirname(filename), mock.bodyFile))
      }
    } else if (mock.body) {
      res.body(mock.body)
    }
  }

  return res
}

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
  } else if (key === 'times' || key === 'repeatTimes') {
    return repeatTimes(values)
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

    return toLowerCase(discoverMatcherByKey(filename, k, v, matcherEntry, parsers), locales)
  } else if (key === 'upperCase') {
    const locales = findOptionalParameter('locale', valueEntries, undefined)
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"upperCase" requires a matcher. Eg.: "upperCase": { equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return toUpperCase(discoverMatcherByKey(filename, k, v, matcherEntry, parsers), locales)
  } else if (key === 'trim') {
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"trim" requires a matcher. Eg.: "trim": { equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return trim(discoverMatcherByKey(filename, k, v, matcherEntry, parsers))
  }

  // Will try to find a matcher in the field parsers
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
    throw new InvalidMockFileError(`No matcher found for: ${key} -- ${values} in ${root}`, filename)
  }
}

// endregion
