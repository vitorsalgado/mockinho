import { handleUnaryCall } from '@grpc/grpc-js'
import { ServerUnaryCall } from '@grpc/grpc-js'
import { sendUnaryData } from '@grpc/grpc-js'
import { handleBidiStreamingCall } from '@grpc/grpc-js'
import { ServerDuplexStream } from '@grpc/grpc-js'
import { handleServerStreamingCall } from '@grpc/grpc-js'
import { ServerWritableStream } from '@grpc/grpc-js'
import { handleClientStreamingCall } from '@grpc/grpc-js'
import { ServerReadableStream } from '@grpc/grpc-js'
import { ServerMethodDefinition } from '@grpc/grpc-js/build/src/make-client'

export type UnaryHandler = handleUnaryCall<unknown, unknown>
export type UnaryCall = ServerUnaryCall<unknown, unknown>
export type UnaryCallback = sendUnaryData<unknown>

export type ServerStreamingHandler = handleServerStreamingCall<unknown, unknown>
export type ServerStreamingCall = ServerWritableStream<unknown, unknown>

export type ClientStreamingHandler = handleClientStreamingCall<unknown, unknown>
export type ClientStreamingCall = ServerReadableStream<unknown, unknown>

export type DuplexHandler = handleBidiStreamingCall<unknown, unknown>
export type DuplexCall = ServerDuplexStream<unknown, unknown>

export type Method = ServerMethodDefinition<unknown, unknown>
