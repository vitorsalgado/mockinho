import { FastifyCorsOptions } from 'fastify-cors'
import { FormBodyPluginOptions } from 'fastify-formbody'
import { FastifyMultipartOptions } from 'fastify-multipart'
import { FastifyHttpServerFactory } from '../FastifyHttpServerFactory'
import { Configurations } from './Configurations'

export interface FastifyConfigurations extends Configurations<FastifyHttpServerFactory> {
  readonly formBodyOptions?: FormBodyPluginOptions
  readonly multiPartOptions?: FastifyMultipartOptions
  readonly cors: boolean
  readonly corsOptions?: FastifyCorsOptions
}
