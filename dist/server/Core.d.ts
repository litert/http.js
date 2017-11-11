/// <reference types="node" />
import http = require("http");
import { IDictionary } from "@litert/core";
import { EventEmitter } from "events";
export interface ServerRequest extends http.IncomingMessage {
    "path": string;
    "query": IDictionary<any>;
    "queryString": string;
    getBody(maxLength?: number): Promise<Buffer>;
}
export interface ServerResponse extends http.ServerResponse {
    sendRedirection(target: string, statusCode?: number): void;
}
export declare type RequestHandler = (context: RequestContext) => Promise<void>;
export declare type RequestMiddleware = (context: RequestContext, next: (end?: boolean) => Promise<void>) => void;
export interface RequestContext {
    "request": ServerRequest;
    "response": ServerResponse;
    "data": IDictionary<any>;
    "params": IDictionary<any>;
}
export interface RouteResult {
    "middlewares": RequestMiddleware[];
    "handler": RequestHandler;
}
export interface HTTPMethodDictionary<T> {
    "GET": T;
    "POST": T;
    "PUT": T;
    "TRACE": T;
    "DELETE": T;
    "OPTIONS": T;
    "HEAD": T;
    "PATCH": T;
    "COPY": T;
    "LOCK": T;
    "UNLOCK": T;
    "MOVE": T;
    "MKCOL": T;
    "PROPFIND": T;
    "PROPPATCH": T;
    "REPORT": T;
    "MKACTIVITY": T;
    "CHECKOUT": T;
    "MERGE": T;
    "M-SEARCH": T;
    "NOTIFY": T;
    "SUBSCRIBE": T;
    "UNSUBSCRIBE": T;
}
export declare type HTTPMethod = keyof HTTPMethodDictionary<any>;
export declare const HTTP_METHODS: HTTPMethod[];
/**
 * The options for creating HTTP server object.
 */
export interface CreateServerOptions {
    /**
     * The host to listen.
     *
     * Default: 0.0.0.0
     */
    "host"?: string;
    /**
     * The port to listen.
     *
     * Default: 80
     */
    "port"?: number;
    /**
     * The backlog to listen.
     *
     * Default: 512
     */
    "backlog"?: number;
    /**
     * The router object.
     */
    "router": RequestRouter;
}
export declare enum HTTPMethods {
    GET = 0,
    POST = 1,
    PUT = 2,
    TRACE = 3,
    DELETE = 4,
    OPTIONS = 5,
    HEAD = 6,
    PATCH = 7,
    COPY = 8,
    LOCK = 9,
    UNLOCK = 10,
    MOVE = 11,
    MKCOL = 12,
    PROPFIND = 13,
    PROPPATCH = 14,
    REPORT = 15,
    MKACTIVITY = 16,
    CHECKOUT = 17,
    MERGE = 18,
    MSEARCH = 19,
    NOTIFY = 20,
    SUBSCRIBE = 21,
    UNSUBSCRIBE = 22,
}
export declare enum ServerStatus {
    /**
     * Server is created but not started yet.
     */
    READY = 0,
    /**
     * Server is starting.
     */
    STARTING = 1,
    /**
     * Server is started and working now.
     */
    WORKING = 2,
    /**
     * Server is closing.
     */
    CLOSING = 3,
    /**
     * Server is closed.
     */
    CLOSED = 4,
}
export interface Server extends EventEmitter {
    /**
     * The port of server listening.
     */
    readonly port: number;
    /**
     * The host of server listening.
     */
    readonly host: string;
    /**
     * The backlog of server.
     */
    readonly backlog: number;
    /**
     * The status of server.
     */
    readonly status: ServerStatus;
    /**
     * Start listening.
     */
    start(): Promise<void>;
    /**
     * Stop listening.
     */
    shutdown(): Promise<void>;
}
export interface RequestRouter {
    use(method: HTTPMethod, path: string | RegExp, middleware: RequestMiddleware): RequestRouter;
    use(method: HTTPMethod, middleware: RequestMiddleware): RequestRouter;
    use(path: string | RegExp, middleware: RequestMiddleware): RequestRouter;
    use(middleware: RequestMiddleware): RequestRouter;
    register(method: HTTPMethod, path: string | RegExp, handler: RequestHandler, data?: IDictionary<any>): RequestRouter;
    route(method: HTTPMethod, path: string, context: RequestContext): RouteResult;
    notFound(handler: RequestHandler): RequestRouter;
    badMethod(handler: RequestHandler): RequestRouter;
}
export interface RouteRule<T> {
    readonly handler: T;
    readonly data: IDictionary<any>;
    route(path: string, context: RequestContext): boolean;
}
export declare const DEFAULT_PORT: number;
export declare const DEFAULT_HOST: string;
export declare const DEFAULT_BACKLOG: number;
export declare const EXCEPTION_TYPE: string;
export declare enum HTTPStatus {
    CONTINUE = 100,
    SWITCHING_PROTOCOL = 101,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    PARTIAL = 206,
    MULTI_CHOICES = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    USE_PROXY = 305,
    TEMPORARY_REDIRECT = 307,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_UNAUTHORIZED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    ENTITY_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVER_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    VERSION_UNSUPPORTED = 505,
}
