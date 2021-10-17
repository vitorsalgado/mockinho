// GENERATED CODE -- DO NOT EDIT!

'use strict'
const grpc = require('@grpc/grpc-js')
const chat_pb = require('./chat_pb.js')

function serialize_chat_ChatMessage(arg) {
  if (!(arg instanceof chat_pb.ChatMessage)) {
    throw new Error('Expected argument of type chat.ChatMessage')
  }
  return Buffer.from(arg.serializeBinary())
}

function deserialize_chat_ChatMessage(buffer_arg) {
  return chat_pb.ChatMessage.deserializeBinary(new Uint8Array(buffer_arg))
}

const ChatServiceService = (exports.ChatServiceService = {
  chat: {
    path: '/chat.ChatService/Chat',
    requestStream: true,
    responseStream: true,
    requestType: chat_pb.ChatMessage,
    responseType: chat_pb.ChatMessage,
    requestSerialize: serialize_chat_ChatMessage,
    requestDeserialize: deserialize_chat_ChatMessage,
    responseSerialize: serialize_chat_ChatMessage,
    responseDeserialize: deserialize_chat_ChatMessage
  }
})

exports.ChatServiceClient = grpc.makeGenericClientConstructor(ChatServiceService)
