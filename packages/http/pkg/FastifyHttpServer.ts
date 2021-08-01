import { Server } from 'http'
import { AddressInfo } from 'net'
import Fastify, { FastifyInstance } from 'fastify'
import FastifyCors from 'fastify-cors'
import FormBodyPlugin from 'fastify-formbody'
import FastifyMultipart from 'fastify-multipart'
import { FastifyConfigurations } from './config'
import { FastifyRequestHandler } from './FastifyRequestHandler'
import { HttpServer, HttpServerInfo } from './HttpServer'

const TraceLoggerOptions = {
  level: 'info',
  prettyPrint: {
    colorize: true,
    messageFormat: '{msg}',
    translateTime: true,
    ignore: 'hostname,pid'
  }
}

export class FastifyHttpServer implements HttpServer {
  private readonly fastify: FastifyInstance

  constructor(
    private readonly configurations: FastifyConfigurations,
    private readonly requestHandler: FastifyRequestHandler
  ) {
    this.fastify = Fastify<Server>({ logger: configurations.trace ? TraceLoggerOptions : false })
  }

  preSetup(): void {
    this.fastify.register(FormBodyPlugin, this.configurations.formBodyOptions)
    this.fastify.register(FastifyMultipart, this.configurations.multiPartOptions)

    if (this.configurations.cors) {
      this.setupCors()
    } else {
      this.fastify.all('*', async (request, reply) => {
        await this.requestHandler.handle(request, reply)
      })
    }

    this.fastify.setErrorHandler((error, request, reply) => {
      request.log.error(error)
      reply
        .status(error.statusCode ?? 500)
        .send({ message: error.message, code: error.code, stack: error.stack })
    })
    this.modifyJsonContentParser()
  }

  async start(): Promise<string> {
    const { port, host } = this.configurations
    return await this.fastify
      .ready()
      .then(() => this.fastify.listen(this.configurations.dynamicPort ? 0 : port, host))
  }

  async close(): Promise<void> {
    await this.fastify.close()
  }

  server(): Server {
    return this.fastify.server
  }

  info(): HttpServerInfo {
    return {
      port: (this.server().address() as AddressInfo).port
    }
  }

  // region Utilities

  private setupCors() {
    this.fastify.register(FastifyCors, {
      strictPreflight: false,
      preflightContinue: true,
      preflight: true,

      ...this.configurations.corsOptions
    })

    const methods: Array<keyof FastifyInstance> = ['get', 'post', 'put', 'patch', 'delete', 'head']

    for (const method of methods) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.fastify[method]('*', async (request, reply) => {
        await this.requestHandler.handle(request, reply)
      })
    }
  }

  private modifyJsonContentParser() {
    this.fastify.addContentTypeParser(
      'application/json',
      { parseAs: 'string' },
      function (req, body, done) {
        try {
          if (body) {
            const json = JSON.parse(body as never)
            done(null, json)
            return
          }

          done(null, null)
        } catch (err) {
          err.statusCode = 400
          done(err, undefined)
        }
      }
    )
  }

  // endregion
}
