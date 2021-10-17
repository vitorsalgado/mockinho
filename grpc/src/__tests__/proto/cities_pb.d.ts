// package: cities
// file: cities.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Point extends jspb.Message { 
    getLatitude(): number;
    setLatitude(value: number): Point;
    getLongitude(): number;
    setLongitude(value: number): Point;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Point.AsObject;
    static toObject(includeInstance: boolean, msg: Point): Point.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Point, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Point;
    static deserializeBinaryFromReader(message: Point, reader: jspb.BinaryReader): Point;
}

export namespace Point {
    export type AsObject = {
        latitude: number,
        longitude: number,
    }
}

export class CityRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): CityRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CityRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CityRequest): CityRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CityRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CityRequest;
    static deserializeBinaryFromReader(message: CityRequest, reader: jspb.BinaryReader): CityRequest;
}

export namespace CityRequest {
    export type AsObject = {
        name: string,
    }
}

export class City extends jspb.Message { 
    getName(): string;
    setName(value: string): City;
    getCountry(): string;
    setCountry(value: string): City;

    hasLocation(): boolean;
    clearLocation(): void;
    getLocation(): Point | undefined;
    setLocation(value?: Point): City;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): City.AsObject;
    static toObject(includeInstance: boolean, msg: City): City.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: City, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): City;
    static deserializeBinaryFromReader(message: City, reader: jspb.BinaryReader): City;
}

export namespace City {
    export type AsObject = {
        name: string,
        country: string,
        location?: Point.AsObject,
    }
}

export class CitySummary extends jspb.Message { 
    getTotal(): number;
    setTotal(value: number): CitySummary;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CitySummary.AsObject;
    static toObject(includeInstance: boolean, msg: CitySummary): CitySummary.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CitySummary, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CitySummary;
    static deserializeBinaryFromReader(message: CitySummary, reader: jspb.BinaryReader): CitySummary;
}

export namespace CitySummary {
    export type AsObject = {
        total: number,
    }
}
