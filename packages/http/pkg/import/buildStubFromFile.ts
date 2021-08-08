/* eslint-disable no-case-declarations */

import Path from 'path'
import { Matcher, notBlank, notNull } from '@mockinho/core'
import { item } from '@mockinho/core-matchers'
import { containing } from '@mockinho/core-matchers'
import { isPresent } from '@mockinho/core-matchers'
import { anyOf } from '@mockinho/core-matchers'
import { jsonPath } from '@mockinho/core-matchers'
import { isUUID } from '@mockinho/core-matchers'
import { matching } from '@mockinho/core-matchers'
import { allOf } from '@mockinho/core-matchers'
import { not } from '@mockinho/core-matchers'
import { endsWith } from '@mockinho/core-matchers'
import { hitTimes } from '@mockinho/core-matchers'
import { equalsTo } from '@mockinho/core-matchers'
import { hasLength } from '@mockinho/core-matchers'
import { startsWith } from '@mockinho/core-matchers'
import { anything } from '@mockinho/core-matchers'
import { trim } from '@mockinho/core-matchers'
import { lowerCase } from '@mockinho/core-matchers'
import { upperCase } from '@mockinho/core-matchers'
import { HttpStubBuilder, response } from '../stub'
import { urlPath, urlPathMatching } from '../matchers'
import { Configurations } from '../config'
import { StubFile } from './StubFile'
import { InvalidStubFileError } from './InvalidStubFileError'

const MatcherConstants = [
  // Matchers
  // --
  'isPresent',
  'isUUID',
  'contains',
  'containing',
  'equals',
  'equalsTo',
  'matching',
  'regex',
  'endsWith',
  'startsWith',
  'hasLength',
  'isPresent',
  'times',
  'hitTimes',
  'not',
  'jsonPath',
  'fieldPath',
  'anyOf',
  'allOf',
  'item',

  // Matchers Transformers
  // --
  'trim',
  'lowerCase',
  'upperCase',

  // HTTP
  // --
  'url',
  'urlPath',
  'urlPathMatching',
  'urlPathPattern',

  // Multi-Part
  // --
  'fileContent',
  'fileEncoding',
  'fileMimeType'
]

export function buildStubFromFile<Config extends Configurations>(
  configurations: Config,
  stub: StubFile,
  filename: string
): HttpStubBuilder {
  notNull(configurations)
  notNull(stub)
  notBlank(filename)

  const builder = new HttpStubBuilder('file', filename)

  if (stub.id) builder.id(stub.id)
  if (stub.name) builder.name(stub.name)
  if (stub.priority) builder.priority(stub.priority)

  if (stub.request.method) builder.method(discoverMatcherByValue(stub.request.method))

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
        builder.query(key, discoverMatcherByKey(filename, matcherKey, value[matcherKey], value))
      }
    }
  }

  if (stub.request.headers) {
    for (const [key, value] of Object.entries(stub.request.headers)) {
      if (typeof value !== 'object') {
        builder.header(key.toLowerCase(), equalsTo(value))
      } else {
        const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(value))
        builder.header(key, discoverMatcherByKey(filename, matcherKey, value[matcherKey], value))
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
            stub.request.body
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
        builder.file(key, discoverMatcherByKey(filename, matcherKey, value[matcherKey], value))
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

  return builder
}

function discoverMatcherByValue(value: string, def = equalsTo): Matcher<any> {
  switch (value) {
    case '*':
    case 'any':
    case 'anything':
      return anything()

    case 'isPresent':
      return isPresent()

    case 'isUUID':
      return isUUID()

    default:
      return def(value)
  }
}

function discoverMatcherByKey(filename: string, key: string, values: any, root: any): Matcher<any> {
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
      return not(discoverMatcherByValue(values))
    }

    const [notK, notV] = Object.entries(values)[0]

    return not(discoverMatcherByKey(filename, notK, notV, values))
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

    return jsonPath(path as string, discoverMatcherByKey(filename, k, v, matcherEntry))
  } else if (key === 'anyOf') {
    const anyOfMatchers = []

    for (const entry of values) {
      // noinspection SuspiciousTypeOfGuard
      if (typeof entry === 'string') {
        anyOfMatchers.push(discoverMatcherByValue(entry))
        continue
      }

      for (const [k, v] of Object.entries(entry)) {
        anyOfMatchers.push(discoverMatcherByKey(filename, k, v, entry))
      }
    }

    return anyOf(...anyOfMatchers)
  } else if (key === 'allOf') {
    const allOfMatchers = []

    for (const entry of values) {
      for (const [k, v] of Object.entries(entry)) {
        allOfMatchers.push(discoverMatcherByKey(filename, k, v, entry))
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

    return item(index, discoverMatcherByKey(filename, k, v, matcherEntry))
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

    return lowerCase(discoverMatcherByKey(filename, k, v, matcherEntry), locales)
  } else if (key === 'upperCase') {
    const locales = findOptionalParameter('locale', valueEntries, undefined)
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"upperCase" requires a matcher. Eg.: "upperCase": { equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return upperCase(discoverMatcherByKey(filename, k, v, matcherEntry), locales)
  } else if (key === 'trim') {
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"trim" requires a matcher. Eg.: "trim": { equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return trim(discoverMatcherByKey(filename, k, v, matcherEntry))
  }

  // No Matcher Found
  // ---
  else {
    throw new InvalidStubFileError(`No matcher found for: ${key} -- ${values} in ${root}`, filename)
  }
}

// region Utils

function textCaseProperties(
  root: any,
  def: boolean = false
): { ignoreCase: boolean; locale: string | string[] | undefined } {
  const locale = root.locale as string | string[] | undefined
  let ignoreCase = def

  if (root.ignoreCase) {
    ignoreCase = root.ignoreCase
  } else if (root.caseInsensitive) {
    ignoreCase = root.caseInsensitive
  }

  return {
    ignoreCase,
    locale
  }
}

function getSingleMatcherFromObjectKeys(filename: string, keys: string[]): string {
  const matchers = keys.filter(x => MatcherConstants.includes(x))

  if (matchers.length === 0) {
    throw new InvalidStubFileError('No matchers set!', filename)
  }

  if (matchers.length > 1) {
    throw new InvalidStubFileError('More than one matcher set!', filename)
  }

  return matchers[0]
}

function findRequiredParameter<T>(
  parameter: string,
  values: [string, unknown][],
  filename: string,
  errorMessage: string
): T {
  const entry = values.find(([k]) => k === parameter)

  if (!entry) {
    throw new InvalidStubFileError(errorMessage, filename)
  }

  return entry[1] as T
}

function findRequiredMatcherEntry(
  values: [string, unknown][],
  filename: string,
  errorMessage: string
): [string, unknown] {
  const entry = values.find(([key]) => MatcherConstants.includes(key))

  if (!entry) {
    if (!entry) {
      throw new InvalidStubFileError(errorMessage, filename)
    }
  }

  return entry
}

function findOptionalParameter<T>(parameter: string, values: [string, unknown][], def: T): T {
  const entry = values.find(([k]) => k === parameter)

  if (!entry) {
    return def
  }

  return entry[1] as T
}

// endregion
