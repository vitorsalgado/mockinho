/* eslint-disable no-case-declarations */

import { Matcher, notBlank, notNull } from '@mockinho/core'
import {
  allOf,
  anyOf,
  anything,
  containing,
  endsWith,
  equalsTo,
  hasLength,
  hitTimes,
  isPresent,
  isUUID,
  item,
  jsonPath,
  matching,
  not,
  startsWith
} from '@mockinho/core-matchers'
import { Configurations } from '../config'
import { HttpServerFactory } from '../HttpServer'
import { urlPath, urlPathMatching } from '../matchers'
import { HttpStubBuilder, response } from '../stub'
import { InvalidStubFileError } from './InvalidStubFileError'
import { StubFile } from './StubFile'

const MatcherConsts = [
  'isPresent',
  'isUUID',
  'urlPath',
  'urlPathMatching',
  'urlPathPattern',
  'contains',
  'containing',
  'url',
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
  'anyOf',
  'allOf',
  'item'
]

export function buildStubFromFile<Config extends Configurations<HttpServerFactory>>(
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
      const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(stub.request.body))
      builder.requestBody(
        discoverMatcherByKey(filename, matcherKey, stub.request.body[matcherKey], stub.request.body)
      )
    }
  }

  if (stub.scenario) {
    builder.scenario(stub.scenario.name, stub.scenario.requiredState, stub.scenario.newState)
  }

  const res = response().status(stub.response.status ?? 200)

  if (stub.response.headers) res.headers(stub.response.headers)
  if (stub.response.delayInMs) res.delayInMs(stub.response.delayInMs)

  if (stub.response.bodyFile) res.bodyFile(stub.response.bodyFile)
  else if (stub.response.body) res.body(stub.response.body)

  builder.reply(res)

  return builder
}

function discoverMatcherByValue(value: string): Matcher<any> {
  switch (value) {
    case '*':
    case 'any':
      return anything()

    case 'isPresent':
      return isPresent()

    case 'isUUID':
      return isUUID()

    default:
      return equalsTo(value)
  }
}

function discoverMatcherByKey(filename: string, key: string, values: any, root: any): Matcher<any> {
  const valueIsText = typeof values === 'string'
  const valueEntries = Object.entries(values)

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
  } else if (key === 'jsonPath') {
    return jsonPath(
      valueEntries[0][1] as string,
      discoverMatcherByKey(filename, valueEntries[1][0], valueEntries[1][1], valueEntries[1])
    )
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
    return item(
      valueEntries[0][1] as number,
      discoverMatcherByKey(filename, valueEntries[1][0], valueEntries[1][1], valueEntries[1])
    )
  } else {
    throw new InvalidStubFileError(`No matcher found for: ${key} -- ${values} in ${root}`, filename)
  }
}

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
  const matchers = keys.filter(x => MatcherConsts.includes(x))

  if (matchers.length === 0) {
    throw new InvalidStubFileError('No matchers set!', filename)
  }

  if (matchers.length > 1) {
    throw new InvalidStubFileError('More than one matcher set!', filename)
  }

  return matchers[0]
}
