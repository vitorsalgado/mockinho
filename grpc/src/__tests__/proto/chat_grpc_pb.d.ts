// package: chat
// file: chat.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as chat_pb from "./chat_pb";

interface IChatServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    chat: IChatServiceService_IChat;
}

interface IChatServiceService_IChat extends grpc.MethodDefinition<chat_pb.ChatMessage, chat_pb.ChatMessage> {
    path: "/chat.ChatService/Chat";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<chat_pb.ChatMessage>;
    requestDeserialize: grpc.deserialize<chat_pb.ChatMessage>;
    responseSerialize: grpc.serialize<chat_pb.ChatMessage>;
    responseDeserialize: grpc.deserialize<chat_pb.ChatMessage>;
}

export const ChatServiceService: IChatServiceService;

export interface IChatServiceServer {
    chat: grpc.handleBidiStreamingCall<chat_pb.ChatMessage, chat_pb.ChatMessage>;
}

export interface IChatServiceClient {
    chat(): grpc.ClientDuplexStream<chat_pb.ChatMessage, chat_pb.ChatMessage>;
    chat(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<chat_pb.ChatMessage, chat_pb.ChatMessage>;
    chat(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<chat_pb.ChatMessage, chat_pb.ChatMessage>;
}

export class ChatServiceClient extends grpc.Client implements IChatServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public chat(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<chat_pb.ChatMessage, chat_pb.ChatMessage>;
    public chat(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<chat_pb.ChatMessage, chat_pb.ChatMessage>;
}
