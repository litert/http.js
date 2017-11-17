import http = require("http");
import { IDictionary } from "@litert/core";
import { EventEmitter } from "events";

export interface ServerRequest extends http.IncomingMessage {

    /**
     * The request path.
     */
    "path": string;

    /**
     * The flag determining whether requested over SSL.
     */
    "https": boolean;

    /**
     * The remote address.
     */
    "ip": string;

    /**
     * The unseriailized data of query-string of request.
     */
    "query": IDictionary<any>;

    /**
     * The flag determining whether connection is aborted.
     */
    "aborted": boolean;

    /**
     * The flag determining whether connection is closed.
     */
    "closed": boolean;

    /**
     * The query-string of request.
     */
    "queryString": string;

    /**
     * The host of request visited.
     */
    "host": string;

    /**
     * The server object.
     */
    "server": Server;

    /**
     * The timestamp of requested time.
     */
    "time": number;

    /**
     * Get HTTP request body as raw stream.
     *
     * @param maxLength (uint) Limit the max length of body.
     */
    getBody(maxLength?: number): Promise<Buffer>;

    /**
     * Get HTTP request body as JSON encoded data.
     *
     * @param maxLength (uint) Limit the max length of body.
     */
    getBodyAsJSON(maxLength?: number): Promise<any>;
}

export interface ServerResponse extends http.ServerResponse {

    /**
     * Send a redirection to client.
     */
    redirect(target: string, statusCode?: number): ServerResponse;

    /**
     * Encode the data as JSON and send it to client.
     *
     * > The response will be closed.
     */
    sendJSON(data: any): ServerResponse;

    /**
     * Send data to client.
     *
     * > The response will be closed.
     */
    send(data: string | Buffer): ServerResponse;
}

export type RequestHandler = (
    context: RequestContext
) => Promise<void>;

export type MiddlewareNextCallback = (end?: boolean) => Promise<void>;

export type RequestMiddleware = (
    context: RequestContext,
    next: MiddlewareNextCallback
) => Promise<void>;

export interface RequestContext {

    /**
     * The object describes the request.
     */
    "request": ServerRequest;

    /**
     * The obejct controlling the response.
     */
    "response": ServerResponse;

    /**
     * The data through out the request.
     */
    "data": IDictionary<any>;

    /**
     * The parameters from request path (currently from Smart router only)
     */
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

export type HTTPMethod = keyof HTTPMethodDictionary<any>;

export const HTTP_METHODS: HTTPMethod[] = [
    "GET", "POST", "PUT", "TRACE",
    "DELETE", "OPTIONS", "HEAD", "PATCH",
    "COPY", "LOCK", "UNLOCK", "MOVE",
    "MKCOL", "PROPFIND", "PROPPATCH", "REPORT",
    "MKACTIVITY", "CHECKOUT", "MERGE", "M-SEARCH",
    "NOTIFY", "SUBSCRIBE", "UNSUBSCRIBE"
];

export interface SSLConfiguration {

    /**
     * The content of private key for SSL
     */
    "key": string | Buffer;

    /**
     * The content of certificate for SSL.
     */
    "certificate": string | Buffer;

    /**
     * Optional passphrase for the private key.
     */
    "passphrase"?: string;
}

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
     * Default: 80 (or 443 if SSL is enabled)
     */
    "port"?: number;

    /**
     * Enable to receive the Expect: xxx-MESSAGE request.
     *
     * Default: false
     */
    "expectRequest"?: boolean;

    /**
     * How long can a connection keep alive.
     *
     * Set to 0 so that keep-alive will be disabled.
     *
     * Default: 5000 (ms)
     */
    "keeyAlive"?: number;

    /**
     * The backlog to listen.
     *
     * Default: 512
     */
    "backlog"?: number;

    /**
     * The router object.
     */
    "router": Router;

    /**
     * The connection timeout.
     *
     * Default: 60000 (ms)
     */
    "timeout"?: number;

    /**
     * Configure this field to enabled HTTPS.
     *
     * Default: none
     */
    "ssl"?: SSLConfiguration;
}

export enum ServerStatus {

    /**
     * Server is created but not started yet.
     */
    READY,

    /**
     * Server is starting.
     */
    STARTING,

    /**
     * Server is started and working now.
     */
    WORKING,

    /**
     * Server is shutting down.
     */
    CLOSING

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

export interface Router {

    route(
        method: HTTPMethod,
        path: string,
        context: RequestContext
    ): RouteResult;
}

export interface StandardRouter extends Router {

    /**
     * Use a middleware, without PATH and METHOD filter.
     *
     * @param method The method to be handled by middleware.
     * @param path The path to be handled by middleware.
     * @param middleware The middleware handler.
     */
    use(
        method: HTTPMethod,
        path: string | RegExp,
        middleware: RequestMiddleware
    ): StandardRouter;

    /**
     * Use a middleware, with a METHOD filter.
     *
     * @param method The method to be handled by middleware.
     * @param middleware The middleware handler.
     */
    use(
        method: HTTPMethod,
        middleware: RequestMiddleware
    ): StandardRouter;

    /**
     * Use a middleware, with a PATH filter.
     *
     * @param path The path to be handled by middleware.
     * @param middleware The middleware handler.
     */
    use(
        path: string | RegExp,
        middleware: RequestMiddleware
    ): StandardRouter;

    /**
     * Use a middleware, without any filter.
     *
     * @param middleware the middleware handler.
     */
    use(
        middleware: RequestMiddleware
    ): StandardRouter;

    /**
     * Bind a handler with a HTTP request.
     *
     * @param method The upper-case name of HTTP method. Allow WebDAV methods.
     * @param path The requested path to be handled.
     * @param handler The handler of request.
     * @param data (Optional) The data bound with handler.
     *
     * @throws Exception
     */
    register(
        method: HTTPMethod,
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter;

    /**
     * Register the handler for NOT FOUND request.
     */
    notFound(handler: RequestHandler): StandardRouter;

    /**
     * Bind a handler with a HTTP GET request.
     *
     * @param path The requested path to be handled.
     * @param handler The handler of request.
     * @param data (Optional) The data bound with handler.
     *
     * @throws Exception
     */
    get(
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter;

    /**
     * Bind a handler with a HTTP POST request.
     *
     * > This is a shortcut of register method.
     *
     * @param path The requested path to be handled.
     * @param handler The handler of request.
     * @param data (Optional) The data bound with handler.
     *
     * @throws Exception
     */
    post(
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter;

    /**
     * Bind a handler with a HTTP PUT request.
     *
     * > This is a shortcut of register method.
     *
     * @param path The requested path to be handled.
     * @param handler The handler of request.
     * @param data (Optional) The data bound with handler.
     *
     * @throws Exception
     */
    put(
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter;

    /**
     * Bind a handler with a HTTP PATCH request.
     *
     * > This is a shortcut of register method.
     *
     * @param path The requested path to be handled.
     * @param handler The handler of request.
     * @param data (Optional) The data bound with handler.
     *
     * @throws Exception
     */
    patch(
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter;

    /**
     * Bind a handler with a HTTP DELETE request.
     *
     * > This is a shortcut of register method.
     *
     * @param path The requested path to be handled.
     * @param handler The handler of request.
     * @param data (Optional) The data bound with handler.
     *
     * @throws Exception
     */
    delete(
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter;

    /**
     * Bind a handler with a HTTP OPTIONS request.
     *
     * > This is a shortcut of register method.
     *
     * @param path The requested path to be handled.
     * @param handler The handler of request.
     * @param data (Optional) The data bound with handler.
     *
     * @throws Exception
     */
    options(
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter;

    /**
     * Bind a handler with a HTTP HEAD request.
     *
     * > This is a shortcut of register method.
     *
     * @param path The requested path to be handled.
     * @param handler The handler of request.
     * @param data (Optional) The data bound with handler.
     *
     * @throws Exception
     */
    head(
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter;

    /**
     * Bind a handler with a HTTP TRACE request.
     *
     * > This is a shortcut of register method.
     *
     * @param path The requested path to be handled.
     * @param handler The handler of request.
     * @param data (Optional) The data bound with handler.
     *
     * @throws Exception
     */
    trace(
        path: string | RegExp,
        handler: RequestHandler,
        data?: IDictionary<any>
    ): StandardRouter;
}

export interface RouteRule<T> {

    readonly handler: T;

    readonly data: IDictionary<any>;

    route(path: string, context: RequestContext): boolean;
}

export const DEFAULT_PORT: number = 80;

export const DEFAULT_SSL_PORT: number = 443;

export const DEFAULT_HOST: string = "0.0.0.0";

export const DEFAULT_BACKLOG: number = 512;

export const DEFAULT_KEEP_ALIVE: number = 5000;

export const DEFAULT_EXPECT_REQUEST: boolean = false;

/**
 * The default connection timeout of server.
 */
export const DEFAULT_TIMEOUT: number = 60000;

export const EXCEPTION_TYPE: string = "litert/http";

export enum HTTPStatus {

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
    VERSION_UNSUPPORTED = 505
}
