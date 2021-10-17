import { ServerReadableStream } from '@grpc/grpc-js'
import { Args } from './Args'

export class ClientStreamingArgs implements Args<ServerReadableStream<unknown, unknown>> {
  constructor(
    public readonly service: string,
    public readonly serviceMethod: string,
    public readonly path: string,
    public readonly call: ServerReadableStream<unknown, unknown>,
    public readonly data: unknown
  ) {}
}
