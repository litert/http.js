
import libEvents = require("events");

import libHTTP = require("http");

import { IDictionary } from "@litert/core";

/**
 * The handler for each request.
 */
export type RequestHandler = (
    req: ServerRequest,
    resp: libHTTP.ServerResponse
) => Promise<void>;

/**
 * The middleware for each request.
 */
export type MiddlewareHandler = (
    req: ServerRequest,
    resp: libHTTP.ServerResponse
) => Promise<boolean>;

export enum ServerStatus {

    IDLE,
    STARTING,
    WORKING,
    CLOSING
}

export enum Errors {

    INVALID_ROUTE_RULE_TYPE
}

export interface HTTPServer extends libEvents.EventEmitter {

    /**
     * Added a handler for specific URI and HTTP Method.
     * @param method The HTTP method to be handled
     * @param uri The URI to be handled
     * @param handler The handler function
     */
    register(
        method: HTTPMethod | "ERROR",
        uri: string | RegExp,
        handler: RequestHandler
    ): HTTPServer;

    /**
     * Added a handler for specific URI and HTTP Method.
     * @param method The HTTP method to be handled
     * @param uri The URI to be handled
     * @param options The options for the new handler
     * @param handler The handler function
     */
    register(
        method: HTTPMethod | "ERROR",
        uri: string | RegExp,
        options: IDictionary<any>,
        handler: RequestHandler
    ): HTTPServer;

    /**
     * Added a middleware for specific URI and HTTP Method.
     * @param type The position to hook.
     * @param uri The URI to be handled
     * @param handler The handler function
     */
    hook(
        type: HookType | "before-all",
        uri: string | RegExp | null,
        handler: MiddlewareHandler
    ): HTTPServer;

    /**
     * Added a middleware for specific URI and HTTP Method.
     * @param type The position to hook.
     * @param handler The handler function
     */
    hook(
        type: HookType | "before-all",
        handler: MiddlewareHandler
    ): HTTPServer;

    /**
     * Start the server.
     */
    start(): HTTPServer;

    close(): HTTPServer;

    /**
     * Get the status of server.
     */
    status: ServerStatus;
}

export interface HTTPMethodIDictionary<T, H> {

    "GET": T[];

    "POST": T[];

    "PUT": T[];

    "PATCH": T[];

    "DELETE": T[];

    "OPTIONS": T[];

    "HEAD": T[];

    "ERROR": IDictionary<H>;
}

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";

export type HookType = "after-router" | "before-router" | "end";

export interface MiddlewareIDictionary<T> {

    "after-router": T[];

    "before-router": T[];

    "end": T[];
}

export const HTTPMethods: string[] = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
    "HEAD"
];

export enum ServerError {

    CLIENT_ERROR,
    APP_BUG
}

export interface ServerOptions {

    /**
     * The hostname for server to listen.
     */
    "host"?: string;

    /**
     * The port for server to listen.
     */
    "port"?: number;

    /**
     * How many requests can be wait in the queue.
     */
    "backlog"?: number;
}

/**
 * The default value of the hostname for a server.
 */
export const DEFAULT_HOST: string = "0.0.0.0";

/**
 * The default value of the port for a server.
 */
export const DEFAULT_PORT: number = 80;

/**
 * The default value of the max length of a waiting queue for a server.
 */
export const DEFAULT_BACKLOG: number = 511;

/**
 * The default value of the max time that a request can be waited.
 */
export const DEFAULT_MAX_TIME: number = 60;

/**
 * The request controlling object
 */
export interface ServerRequest extends libHTTP.IncomingMessage {

    /**
     * The parameters of request.
     */
    params: IDictionary<any>;

    /**
     * The path in URI.
     */
    path: string;

    /**
     * The query parameters in URI.
     */
    queries: IDictionary<string>;

    /**
     * The querystring in URI.
     */
    queryString: string;

    /**
     * The method of request.
     */
    method: HTTPMethod;

    /**
     * The options for this handler.
     * Default to be undefined.
     */
    handlerOptions?: IDictionary<any>;

    /**
     * The options for this handler.
     */
    server: HTTPServer;
}

export type ServerResponse = libHTTP.ServerResponse;
