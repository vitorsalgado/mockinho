import { ServerStreamingResponseBuilder } from '../ServerStreamingResponseBuilder.js'

export function serverStreaming(): ServerStreamingResponseBuilder {
  return new ServerStreamingResponseBuilder()
}
