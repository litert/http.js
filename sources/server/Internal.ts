
import * as http from "http";
import * as Abstracts from "./Abstract";

export const kStatus = Symbol("status");
export const kServer = Symbol("server");
export const cServer = Symbol("cserver");

declare module "http2" {

    export class Http2ServerRequest {
    }
}

declare module "net" {

    export interface Socket {

        server: http.Server;
    }
}

declare module "http" {

    export interface Server {

        [cServer]: Abstracts.Server;
    }
}

export interface InternalServer extends http.Server {

    [cServer]: Abstracts.Server;
}

export interface InternalRequest extends Abstracts.ServerRequest {

    __rawData?: Buffer;
}
