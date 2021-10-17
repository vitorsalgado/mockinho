// package: chat
// file: chat.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class ChatMessage extends jspb.Message { 
    getMessage(): string;
    setMessage(value: string): ChatMessage;
    getAction(): string;
    setAction(value: string): ChatMessage;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChatMessage.AsObject;
    static toObject(includeInstance: boolean, msg: ChatMessage): ChatMessage.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ChatMessage, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChatMessage;
    static deserializeBinaryFromReader(message: ChatMessage, reader: jspb.BinaryReader): ChatMessage;
}

export namespace ChatMessage {
    export type AsObject = {
        message: string,
        action: string,
    }
}
