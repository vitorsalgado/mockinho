/* eslint-disable @typescript-eslint/no-var-requires,no-console */

const Fs = require('fs')
const Path = require('path')
const Util = require('util')
const Stream = require('stream').Stream
const { parentPort, workerData } = require('worker_threads')
const { isMainThread } = require('worker_threads')
const Hash = require('object-hash')
const Mime = require('mime-types')

// Exit if not in the context of a Worker
// File can be imported just to ensure it will be on TypeScript build output
if (!parentPort || isMainThread) return

const writeFile = Util.promisify(Fs.writeFile)
const access = Util.promisify(Fs.access)

parentPort.on('message', async data => {
  const { destination, extension, captureRequestHeaders, captureResponseHeaders } = workerData
  const { request, response } = data

  const name = `${request.method}${request.path.split('/').join('-')}`
  const hasResponseBody = response.body.length && response.body.length > 0

  let query
  let requestBody
  const requestHeaders = {}
  const responseHeaders = {}

  if (captureRequestHeaders) {
    for (const [name, value] of Object.entries(request.headers)) {
      if (captureRequestHeaders.some(h => h === name)) {
        requestHeaders[name] = value
      }
    }
  }

  if (captureResponseHeaders) {
    for (const [name, value] of Object.entries(response.headers)) {
      if (captureResponseHeaders.some(h => h === name)) {
        responseHeaders[name] = value
      }
    }
  }

  if (Object.keys(request.query).length > 0) {
    query = request.query
  }

  if (request.body) {
    requestBody = request.body
  }

  const ext = Mime.extension(response.headers['content-type'])
  const mockHash = Hash(
    {
      url: request.url,
      method: request.method,
      headers: requestHeaders,
      query,
      body: requestBody,
    },
    { algorithm: 'sha1' },
  ).substr(0, 8)

  const mockFile = `${name}-${mockHash}.${extension}.json`
  const mockPath = Path.join(destination, mockFile)
  const mockBodyFile = `${name}-${mockHash}.${ext ?? 'bin'}`
  const mockBodyPath = Path.join(destination, mockBodyFile)

  const mock = {
    id: request.id,
    name,

    request: {
      urlPath: request.path,
      headers: requestHeaders,
      querystring: query,
      body:
        !(requestBody instanceof Buffer) && !(requestBody instanceof Stream)
          ? {
              equalsTo: requestBody,
            }
          : undefined,
    },

    response: {
      status: response.status,
      headers: responseHeaders,
      bodyFile: hasResponseBody ? mockBodyFile : undefined,
    },
  }

  let exists

  try {
    await access(mockFile)
    exists = true
  } catch {
    exists = false
  }

  if (!exists) {
    Promise.all([
      writeFile(mockPath, Buffer.from(JSON.stringify(mock, null, 2))),
      hasResponseBody ? writeFile(mockBodyPath, response.body) : Promise.resolve(),
    ])
      .then(() => parentPort.postMessage({ mock: mockFile, mockBody: mockBodyFile }))
      .catch(err => parentPort.postMessage(err))
  }
})
