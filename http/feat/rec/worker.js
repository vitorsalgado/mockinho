/* eslint-disable @typescript-eslint/no-var-requires */

const Fs = require('fs/promises')
const Path = require('path')
const Stream = require('stream').Stream
const { parentPort, workerData } = require('worker_threads')
const { isMainThread } = require('worker_threads')
const Mime = require('mime-types')

// Exit if not in the context of a Worker
// File can be imported just to ensure it will be on TypeScript build output
if (!parentPort || isMainThread) {
  return
}

parentPort.on('message', async data => {
  const { destination, extension, captureRequestHeaders, captureResponseHeaders } = workerData
  const { request, response } = data

  const sanitized = request.path.replaceAll(/ /g, '-').replaceAll(/[^a-z0-9]/gi, '_')
  const name = `${request.method}_${sanitized}`
  const hasResponseBody = response.body.length && response.body.length > 0

  let query
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

  const ext = Mime.extension(response.headers['content-type'])
  const mockFile = `${name}.${extension}.json`
  const mockPath = Path.join(destination, mockFile)
  const mockBodyFile = `${name}.${ext ?? 'bin'}`
  const mockBodyPath = Path.join(destination, mockBodyFile)

  const mock = {
    id: request.id,
    name,

    request: {
      urlPath: request.path,
      headers: requestHeaders,
      querystring: query,
      body:
        !(request.body instanceof Buffer) && !(request.body instanceof Stream)
          ? {
              equalsTo: request.body,
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
    await Fs.access(mockFile)
    exists = true
  } catch {
    exists = false
  }

  if (!exists) {
    Promise.all([
      Fs.writeFile(mockPath, Buffer.from(JSON.stringify(mock, null, 2))),
      hasResponseBody ? Fs.writeFile(mockBodyPath, response.body) : Promise.resolve(),
    ])
      .then(() => parentPort.postMessage({ mock: mockFile, mockBody: mockBodyFile }))
      .catch(err => parentPort.postMessage(err))
  }
})
