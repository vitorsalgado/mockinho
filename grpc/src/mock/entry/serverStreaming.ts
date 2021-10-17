import { ServerStreamingResponseBuilder } from '../ServerStreamingResponseBuilder'

export function serverStreaming(): ServerStreamingResponseBuilder {
  return new ServerStreamingResponseBuilder()
}
