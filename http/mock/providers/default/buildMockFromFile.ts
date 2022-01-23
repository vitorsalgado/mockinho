import Path from 'path'
import * as Fs from 'fs'
import { notBlank, notNull } from '@mockdog/core'
import { Matcher } from '@mockdog/core'
import { requireOrImportModule } from '@mockdog/core'
import { Helper } from '@mockdog/core'
import { LoadMockError } from '@mockdog/core'
import { isPresent } from '@mockdog/core-matchers'
import { matches } from '@mockdog/core-matchers'
import { equalsTo } from '@mockdog/core-matchers'
import { anything } from '@mockdog/core-matchers'
import { item } from '@mockdog/core-matchers'
import { contains } from '@mockdog/core-matchers'
import { anyOf } from '@mockdog/core-matchers'
import { jsonPath } from '@mockdog/core-matchers'
import { isUUID } from '@mockdog/core-matchers'
import { allOf } from '@mockdog/core-matchers'
import { not } from '@mockdog/core-matchers'
import { toUpperCase } from '@mockdog/core-matchers'
import { toLowerCase } from '@mockdog/core-matchers'
import { endsWith } from '@mockdog/core-matchers'
import { repeatTimes } from '@mockdog/core-matchers'
import { hasLength } from '@mockdog/core-matchers'
import { startsWith } from '@mockdog/core-matchers'
import { trim } from '@mockdog/core-matchers'
import { everyItem } from '@mockdog/core-matchers'
import { empty } from '@mockdog/core-matchers'
import { HttpConfiguration } from '../../../config/index.js'
import { urlPath, urlPathMatching } from '../../../matchers/index.js'
import { HttpMockBuilder, response } from '../../index.js'
import { ResponseBuilder } from '../../ResponseBuilder.js'
import { multipleResponses } from '../../entry/multipleResponses.js'
import { MockFile } from './MockFile.js'
import { MockFileResponse } from './MockFile.js'
import { getSingleMatcherFromObjectKeys } from './util/getSingleMatcherFromObjectKeys.js'
import { findRequiredParameter } from './util/findRequiredParameter.js'
import { findRequiredMatcherEntry } from './util/findRequiredMatcherEntry.js'
import { findOptionalParameter } from './util/findOptionalParameter.js'
import { FieldParser } from './FieldParser.js'
import { extractPath } from './util/extractPath.js'

const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/

export async function buildMockFromFile(
  configuration: HttpConfiguration,
  mock: MockFile,
  filename: string
): Promise<HttpMockBuilder> {
  notNull(configuration)
  notNull(mock)
  notBlank(filename)

  const builder = new HttpMockBuilder('file', filename)

  if (mock.id) builder.id(mock.id)
  if (mock.name) builder.name(mock.name)
  if (mock.priority) builder.priority(mock.priority)

  if (mock.request.method) builder.method(mock.request.method)
  if (mock.request.scheme) builder.scheme(mock.request.scheme)

  if (mock.request.url) {
    if (ABSOLUTE_URL_REGEX.test(mock.request.url)) {
      builder.url(equalsTo(mock.request.url, true))
    } else {
      builder.url(urlPath(extractPath(mock.request.url)))
    }
  } else if (mock.request.urlPath) {
    builder.url(urlPath(mock.request.urlPath))
  } else if (mock.request.urlPattern) {
    builder.url(matches(mock.request.urlPattern))
  } else if (mock.request.urlPathPattern) {
    builder.url(urlPathMatching(mock.request.urlPathPattern))
  } else if (mock.request.urlExact) {
    builder.url(equalsTo(mock.request.url))
  }

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
            mock,
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
            mock,
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
      builder.requestBody(equalsTo<unknown>(mock.request.body))
    } else {
      if (Object.keys(mock.request.body).length > 0) {
        const matcherKey = getSingleMatcherFromObjectKeys(filename, Object.keys(mock.request.body))
        builder.requestBody(
          discoverMatcherByKey(
            filename,
            mock,
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
            mock,
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

  if (Array.isArray(mock.response)) {
    const multiple = multipleResponses().type(mock.responseType ?? 'sequential')

    if (
      mock.returnErrorOnNoResponse !== null &&
      typeof mock.returnErrorOnNoResponse !== 'undefined'
    ) {
      multiple.errorOnNotFound(mock.returnErrorOnNoResponse)
    }

    for (const response of mock.response) {
      multiple.add(await buildResponse(response, filename))
    }

    builder.reply(multiple.build())
  } else {
    const response = await buildResponse(mock.response, filename)
    builder.reply(response.build())
  }

  for (const additionalBuilder of configuration.mockFieldParsers) {
    additionalBuilder.parse(configuration, filename, mock, builder)
  }

  return builder
}

// region Utils

async function buildResponse(mock: MockFileResponse, filename: string): Promise<ResponseBuilder> {
  const res = response().status(mock.status ?? 200)

  if (mock.headers) res.headers(mock.headers)
  if (mock.latency) res.latency(mock.latency)

  if (mock.proxyFrom) {
    if (mock.proxyHeaders) res.proxyHeaders(mock.proxyHeaders)
    res.proxyFrom(mock.proxyFrom)
  } else {
    if (mock.bodyFile) {
      if (Path.isAbsolute(mock.bodyFile)) {
        res.bodyFile(mock.bodyFile)
      } else {
        res.bodyFile(Path.resolve(Path.dirname(filename), mock.bodyFile))
      }
    } else if (mock.bodyTemplate) {
      res.bodyTemplate(mock.bodyTemplate)
    } else if (mock.bodyTemplateFile) {
      res.bodyTemplatePath(mock.bodyTemplateFile)
    } else if (mock.body) {
      res.body(mock.body)
    }
  }

  if (mock.modelFile) {
    const file = Path.isAbsolute(mock.modelFile)
      ? mock.modelFile
      : Path.resolve(Path.dirname(filename), mock.modelFile)

    const buf = Fs.readFileSync(file)
    const content = buf.toString()

    res.model(JSON.parse(content))
  }

  if (mock.headerTemplates) {
    for (const [key, value] of Object.entries(mock.headerTemplates)) {
      res.headerTemplate(key, value)
    }
  }

  if (mock.helpers) {
    const file = Path.isAbsolute(mock.helpers)
      ? mock.helpers
      : Path.resolve(Path.dirname(filename), mock.helpers)

    const helpers = await requireOrImportModule(file)

    res.helpers(helpers as Helper)
  }

  return res
}

function discoverMatcherByValue(
  mock: MockFile,
  value: string,
  parsers: Array<FieldParser>,
  def = equalsTo
): Matcher<unknown> {
  if (value === 'isPresent') {
    return isPresent()
  } else if (value === 'isUUID') {
    return isUUID() as Matcher<unknown>
  } else {
    let matcher: Matcher<unknown> | undefined

    for (const parser of parsers) {
      matcher = parser.discoverMatcherByValue(mock, value)

      if (matcher) {
        return matcher
      }
    }

    return def(value) as Matcher<unknown>
  }
}

function discoverMatcherByKey(
  filename: string,
  mock: MockFile,
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
    return urlPath(values, true, mock.locale)
  } else if (key === 'url') {
    return equalsTo(values, true, mock.locale)
  } else if (key === 'urlPathMatching' || key === 'urlPathPattern') {
    return urlPathMatching(values)
  } else if (key === 'contains') {
    return contains(values)
  } else if (key === 'equals' || key === 'equalsTo') {
    return equalsTo(values)
  } else if (key === 'equalsIgnoringCase' || key === 'equalsToIgnoringCase') {
    return equalsTo(values, true, mock.locale)
  } else if (key === 'matches' || key === 'regex') {
    return matches(values)
  } else if (key === 'endsWith') {
    return endsWith(values)
  } else if (key === 'startsWith') {
    return startsWith(values)
  } else if (key === 'hasLength') {
    return hasLength(values)
  } else if (key === 'empty') {
    return empty()
  } else if (key === 'isPresent') {
    return isPresent()
  } else if (key === 'isUUID') {
    return isUUID()
  } else if (key === 'times' || key === 'repeatTimes') {
    return repeatTimes(values)
  } else if (key === 'everyItem') {
    if (valueIsText) {
      return everyItem(discoverMatcherByValue(mock, values, parsers))
    }

    const [key, value] = Object.entries(values)[0]

    return everyItem(discoverMatcherByKey(filename, mock, key, value, values, parsers))
  } else if (key === 'not') {
    if (valueIsText) {
      return not(discoverMatcherByValue(mock, values, parsers))
    }

    const [notK, notV] = Object.entries(values)[0]

    return not(discoverMatcherByKey(filename, mock, notK, notV, values, parsers))
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

    return jsonPath(
      path as string,
      discoverMatcherByKey(filename, mock, k, v, matcherEntry, parsers)
    )
  } else if (key === 'anyOf') {
    const anyOfMatchers: Array<Matcher<unknown>> = []

    for (const entry of values) {
      if (typeof entry === 'string') {
        anyOfMatchers.push(discoverMatcherByValue(mock, entry, parsers))
        continue
      }

      for (const [k, v] of Object.entries(entry)) {
        anyOfMatchers.push(discoverMatcherByKey(filename, mock, k, v, entry, parsers))
      }
    }

    return anyOf(...anyOfMatchers)
  } else if (key === 'allOf') {
    const allOfMatchers: Array<Matcher<unknown>> = []

    for (const entry of values) {
      for (const [k, v] of Object.entries(entry)) {
        allOfMatchers.push(discoverMatcherByKey(filename, mock, k, v, entry, parsers))
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

    return item(index, discoverMatcherByKey(filename, mock, k, v, matcherEntry, parsers))
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

    return toLowerCase(discoverMatcherByKey(filename, mock, k, v, matcherEntry, parsers), locales)
  } else if (key === 'upperCase') {
    const locales = findOptionalParameter('locale', valueEntries, undefined)
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"upperCase" requires a matcher. Eg.: "upperCase": { equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return toUpperCase(discoverMatcherByKey(filename, mock, k, v, matcherEntry, parsers), locales)
  } else if (key === 'trim') {
    const matcherEntry = findRequiredMatcherEntry(
      valueEntries,
      filename,
      '"trim" requires a matcher. Eg.: "trim": { equalsTo: "test" }'
    )
    const [k, v] = matcherEntry

    return trim(discoverMatcherByKey(filename, mock, k, v, matcherEntry, parsers))
  }

  // Will try to find a matcher in the field parsers
  else {
    let matcher: Matcher<unknown> | undefined

    for (const parser of parsers) {
      matcher = parser.discoverMatcherByKey(filename, mock, key, values, root)

      if (matcher) {
        return matcher
      }
    }

    // No Matcher Found
    // Throw Error
    throw new LoadMockError(
      `No matcher found for: ${key} -- ${values} in ${root}. File: ${filename}`,
      filename
    )
  }
}

// endregion
