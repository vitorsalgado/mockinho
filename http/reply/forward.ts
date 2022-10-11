import http from 'node:http'
import { Response } from 'express'
import { notBlank, notNull } from '@mockdog/x'
import { HeaderList } from '../headers.js'
import { SC } from '../http.js'
import { SrvRequest } from '../request.js'
import { Reply, ReplyCtx, SrvResponse } from './reply.js'

const hopByHopHeaders = [
  'Connection',
  'Keep-Alive',
  'Proxy-Authenticate',
  'Proxy-Authorization',
  'TE',
  'Trailers',
  'Transfer-Encoding',
  'Upgrade',
]

export const forwardedFrom = (target: string = '') => new ForwardReply(target)

export class ForwardReply implements Reply {
  private _stripPrefix = ''
  private _stripSuffix = ''
  private _status: number = 0
  private _statusMessage?: string
  private _delay = 0
  private readonly _proxyHeaders = new HeaderList()
  private readonly _proxyHeadersToRemove: string[] = []
  private readonly _responseHeaders = new HeaderList()

  constructor(private _target: string = '') {}

  target(target: string): this {
    notBlank(target)

    this._target = target

    return this
  }

  status(status: number): this {
    this._status = status
    return this
  }

  statusMessage(statusMessage: string): this {
    this._statusMessage = statusMessage
    return this
  }

  responseHeader(key: string, value: string): this {
    this._responseHeaders.set(key, value)
    return this
  }

  proxyHeader(key: string, value: string): this {
    notBlank(key)
    notNull(value)

    this._proxyHeaders.set(key, value)

    return this
  }

  proxyHeaders(headers: Record<string, string>): this {
    notNull(headers)

    for (const [key, value] of Object.entries(headers)) {
      this.proxyHeader(key, value)
    }

    return this
  }

  removeHeader(header: string): this {
    this._proxyHeadersToRemove.push(header.toLowerCase())
    return this
  }

  stripPrefix(prefix: string): this {
    this._stripPrefix = prefix
    return this
  }

  stripSuffix(suffix: string): this {
    this._stripSuffix = suffix
    return this
  }

  build(req: SrvRequest, res: Response, _: ReplyCtx): Promise<SrvResponse | null> {
    let path = req.url
    const u = new URL(this._target)

    if (this._stripPrefix !== '') {
      if (path.startsWith(this._stripPrefix)) {
        path = path.substring(0, this._stripPrefix.length)
      }
    }

    if (this._stripSuffix) {
      if (path.endsWith(this._stripSuffix)) {
        path = path.substring(path.length - this._stripSuffix.length)
      }
    }

    const h = new HeaderList(req.headers)

    for (const n of this._proxyHeadersToRemove) {
      if (h.has(n)) {
        h.delete(n)
      }
    }

    for (const [n, v] of this._proxyHeaders) {
      h.set(n, v)
    }

    const options: http.RequestOptions = {
      port: u.port,
      host: u.hostname,
      method: req.method,
      headers: h.toObject(),
      path,
    }

    return new Promise((resolve, reject) => {
      const proxy = http.request(options, m => {
        for (const [name, value] of Object.entries(m.headers)) {
          res.header(name, value)
        }

        for (const hh of hopByHopHeaders) {
          res.removeHeader(hh)
        }

        for (const [name, value] of this._responseHeaders) {
          res.header(name, value)
        }

        if (this._status !== 0) {
          res.writeHead(this._status, this._statusMessage)
        } else {
          res.writeHead(this._status || SC.OK, m.statusMessage)
        }

        m.on('data', chunk => res.write(chunk))
        m.on('close', () => res.end())
        m.on('end', () => res.end())
        m.on('error', err => reject(err))
      })

      proxy.on('error', err => reject(err))
      proxy.write(req.$internals.rawBody)
      proxy.end(() => resolve(null))
    })
  }
}
