/*
   +----------------------------------------------------------------------+
   | LiteRT HTTP.js Library                                               |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/http.js/blob/master/LICENSE                |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

import http = require("http");
import { IDictionary } from "@litert/core";

export interface GetContentOptions<T> {

    /**
     * The maximum bytes allowed for content data.
     */
    "maxBytes"?: number;

    /**
     * The type allowed for content data.
     */
    "type": T;

    /**
     * Ensure that content-type is parsable for determined type.
     */
    "assert"?: boolean;

    /**
     * Other configurations for specific parser.
     */
    [key: string]: any;
}

export interface ServerRequest extends http.IncomingMessage {

    /**
     * The request path.
     */
    "path": string;

    /**
     * The real path used in router.
     */
    "realPath": string;

    /**
     * The flag determining whether requested over SSL.
     */
    "https": boolean;

    /**
     * The remote address.
     */
    "ip": string;

    /**
     * The requested URL.
     */
    "url": string;

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
     * The parameters from request path (currently from Smart router only)
     */
    "params": IDictionary<any>;

    /**
     * The plugins.
     */
    "plugins": IDictionary<any>;

    /**
     * The host of request visited.
     */
    "host": string;

    /**
     * The hostname of request visited.
     */
    "hostDomain": string;

    /**
     * The port of request visited.
     */
    "hostPort": number;

    /**
     * The server object.
     */
    "server": Server;

    /**
     * The timestamp of requested time.
     */
    "time": number;

    /**
     * The HTTP Cookies.
     *
     * This field would be undefiend by default. To enable this field, just use
     * the method loadCookies;
     */
    "cookies": IDictionary<string>;

    /**
     * Get basic information of HTTP request body.
     *
     * @deprecated Use method getContentInfo instead, this method will
     *             be removed in v0.5.0.
     */
    "contentInfo": ContentInfo;

    /**
     * Check if the cookies are already loaded into field cookies.
     */
    isCookiesLoaded(): boolean;

    /**
     * Load the HTTP cookies into field cookies.
     *
     * > NOTES: This must be called with setting up cookies for server.
     */
    loadCookies(): boolean;

    /**
     * Get basic information of HTTP request body.
     */
    getContentInfo(): ContentInfo;

    /**
     * Get the acceptable languages list of client.
     */
    getAcceptableLanguages(): IDictionary<number>;

    /**
     * Get the acceptable content types list of client.
     */
    getAcceptableTypes(): IDictionary<number>;

    /**
     * Get the acceptable content types list of client.
     */
    getAcceptableEncodings(): IDictionary<number>;

    /**
     * Get HTTP request body as raw stream.
     *
     * @param opts The options for getting contents. If omitted, a type based
     *             on the content-type will be selected instead.
     */
    getContent(opts: GetContentOptions<"raw">): Promise<Buffer>;

    /**
     * Get HTTP request body as string.
     *
     * @param opts The options for getting contents. If omitted, a type based
     *             on the content-type will be selected instead.
     */
    getContent(opts: GetContentOptions<"string">): Promise<string>;

    /**
     * Get HTTP request body and parse it into determined form.
     *
     * @param opts The options for getting contents. If omitted, a type based
     *             on the content-type will be selected instead.
     */
    getContent<T = any>(opts?: GetContentOptions<string>): Promise<T>;

    /**
     * Get the acceptable languages list of client.
     *
     * @deprecated Use method getAcceptableLanguages instead, this method will
     *             be removed in v0.5.0.
     */
    "acceptableLanguages": IDictionary<number>;

    /**
     * Get the acceptable content types list of client.
     *
     * @deprecated Use method getAcceptableTypes instead, this method will
     *             be removed in v0.5.0.
     */
    "acceptableTypes": IDictionary<number>;

    /**
     * Get the acceptable content types list of client.
     *
     * @deprecated Use method getAcceptableEncodings instead, this method will
     *             be removed in v0.5.0.
     */
    "acceptableEncodings": IDictionary<number>;

    /**
     * Get HTTP request body as raw stream.
     *
     * @param maxLength (uint) Limit the max length of body.
     *
     * @deprecated Use method getContent instead, this method will be removed
     *             in v0.5.0.
     */
    getBody(maxLength?: number): Promise<Buffer>;

    /**
     * Get HTTP request body as JSON encoded data.
     *
     * @param maxLength (uint) Limit the max length of body.
     *
     * @deprecated Use method getContent instead, this method will be removed
     *             in v0.5.0.
     */
    getBodyAsJSON(maxLength?: number): Promise<any>;

    /**
     * Check if the request is sent with DNT header.
     */
    isDoNotTrack(): boolean;

    /**
     * Get header value by key.
     */
    "headers": IDictionary<string>;
}

export interface ContentInfo {

    /**
     * The real value of content-type.
     *
     * This value should be an empty string if not specified.
     */
    "type": string;

    /**
     * The extra value of content-type, such as charset or boundary.
     */
    "extras": IDictionary<string>;

    /**
     * The value of content-length.
     *
     * This value should be -1 if not specified.
     */
    "length": number;
}

export interface CookieConfiguration {

    /**
     * The TTL of expires.
     *
     * Default: Session bound.
     */
    "ttl"?: number;

    /**
     * Set cookie sent by SSL only (from client).
     *
     * Default: false
     */
    "secureOnly"?: boolean;

    /**
     * Disable reading this cookie item by JavaScript (in browser).
     *
     * Default: false
     */
    "httpOnly"?: boolean;

    /**
     * The available path of this cookie item.
     *
     * Default: /
     */
    "path"?: string;

    /**
     * The available domain of this cookie item.
     *
     * Default: none
     */
    "domain"?: string;
}

export interface SetCookieConfiguration extends CookieConfiguration {

    /**
     * The name of cookies item.
     */
    "name": string;

    /**
     * The value of cookies item.
     */
    "value": string;
}

export interface ServerResponse extends http.ServerResponse {

    /**
     * Send a redirection to client.
     */
    redirect(target: string, statusCode?: number): this;

    /**
     * Encode the data as JSON and send it to client.
     *
     * > The response will be closed.
     */
    sendJSON(data: any): this;

    /**
     * Send data to client.
     *
     * > The response will be closed.
     */
    send(data: string | Buffer): this;

    /**
     * The server object.
     */
    "server": Server;

    /**
     * Set the cookies of response.
     *
     * > NOTES: This must be called with setting up cookies for server.
     */
    setCookie(
        name: string,
        value: string,
        ttl?: number,
        httpOnly?: boolean,
        secureOnly?: boolean,
        path?: string,
        domain?: string
    ): this;

    /**
     * Set the cookies of response.
     *
     * > NOTES: This must be called with setting up cookies for server.
     */
    setCookie(
        cookie: SetCookieConfiguration
    ): this;
}

export type RequestHandler<CT extends RequestContext = RequestContext> = (
    context: CT
) => Promise<void>;

export type MiddlewareNextCallback = (end?: boolean) => Promise<void>;

export type RequestMiddleware<CT extends RequestContext = RequestContext> = (
    context: CT,
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

export interface SSLConfig {

    /**
     * The content of private key for SSL/TLS.
     */
    "key": string | Buffer;

    /**
     * The content of certificate for SSL/TLS.
     */
    "certificate": string | Buffer;

    /**
     * The password of SSL/TLS private key content.
     *
     * If there are more than one key, then the field `key` of SSLKey should be
     * used instead.
     */
    "passphrase"?: string;

    /**
     * The minimal TLS/SSL protocol version to be used.
     */
    "minProtocolVersion"?: "SSLv2" | "SSLv3" | "TLSv1.0" |
                           "TLSv1.1" | "TLSv1.2";
}

/**
 * The factory function for context object.
 */
export type ContextCreator<T extends RequestContext> = (
    request: ServerRequest,
    response: ServerResponse
) => T;

export type HTTPVersion = 1.1 | 2;

/**
 * The options for creating HTTP server object.
 */
export interface CreateServerOptionsBase {

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
     * Specify the version of HTTP protocol to be used.
     */
    "version"?: HTTPVersion;

    /**
     * The backlog to listen.
     *
     * Default: 512
     */
    "backlog"?: number;

    /**
     * The factory function for context object.
     */
    "contextCreator"?: ContextCreator<RequestContext>;

    /**
     * The connection timeout.
     *
     * Default: 60000 (ms)
     */
    "timeout"?: number;

    /**
     * The plugins for server.
     */
    "plugins"?: IDictionary<any>;
}

export interface CreateServerOptions extends CreateServerOptionsBase {

    /**
     * The router object.
     */
    "router": Router;

    /**
     * Setup the plugins for parsing cookies.
     *
     * @deprecated Use `plugins["parser:cookies"]` instead. This field will be
     *             removed in v0.5.0.
     */
    "cookies"?: CookiesEncoder;

    /**
     * Configure this field to enabled HTTPS.
     *
     * Default: none
     */
    "ssl"?: SSLConfig;
}

export interface ServerOptions extends CreateServerOptions {

    /**
     * Configure this field to enabled HTTPS.
     *
     * Default: none
     */
    "ssl": SSLConfig;

    /**
     * The plugins for server.
     */
    "plugins": IDictionary<any>;
}

export interface CreateMountableServerOptions extends CreateServerOptions {

    /**
     * Mount-points of hosts.
     */
    "mounts": IDictionary<Server>;
}

export interface CreateHostDispatcherOptions extends CreateServerOptionsBase {

    /**
     * Virtual hosts.
     */
    "hosts": IDictionary<Server>;
}

export enum CookiesEncoding {
    PLAIN,
    BASE64,
    HEX,
    URLENCODE,
    OTHER
}

export interface CookiesEncoder {

    parse(cookies: string): IDictionary<string>;

    stringify(cookie: SetCookieConfiguration): string;
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

export interface ContentParser {

    parse(
        request: ServerRequest,
        opts: GetContentOptions<string>
    ): Promise<any>;
}

export interface Server {

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

    on(event: "started", listener: () => void): this;

    on(event: "closed", listener: () => void): this;

    on(event: "error", listener: (e: any) => void): this;

    removeListener(event: string, listener: Function): this;

    removeAllListeners(event: string): this;
}

export interface Router {

    route(
        method: HTTPMethod,
        path: string,
        context: RequestContext
    ): RouteResult;
}

export interface StandardRouter<
    CT extends RequestContext = RequestContext
> extends Router {

    /**
     * Use a middleware, without PATH and METHOD filter.
     *
     * @param method The method to be handled by middleware.
     * @param path The path to be handled by middleware.
     * @param middleware The middleware handler.
     */
    use(
        method: HTTPMethod | HTTPMethod[],
        path: string | RegExp | Array<string | RegExp>,
        middleware: RequestMiddleware<CT>
    ): this;

    /**
     * Use a middleware, with a METHOD filter.
     *
     * @param method The method to be handled by middleware.
     * @param middleware The middleware handler.
     */
    use(
        method: HTTPMethod | HTTPMethod[],
        middleware: RequestMiddleware<CT>
    ): this;

    /**
     * Use a middleware, with a PATH filter.
     *
     * @param path The path to be handled by middleware.
     * @param middleware The middleware handler.
     */
    use(
        path: string | RegExp | Array<string | RegExp>,
        middleware: RequestMiddleware<CT>
    ): this;

    /**
     * Use a middleware, without any filter.
     *
     * @param middleware the middleware handler.
     */
    use(
        middleware: RequestMiddleware<CT>
    ): this;

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
        method: HTTPMethod | HTTPMethod[],
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

    /**
     * Register the handler for NOT FOUND request.
     */
    notFound(handler: RequestHandler<CT>): this;

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
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

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
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

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
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

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
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

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
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

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
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

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
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;

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
        path: string | RegExp | Array<string | RegExp>,
        handler: RequestHandler<CT>,
        data?: IDictionary<any>
    ): this;
}

export interface ControllerRouter<
    CT extends RequestContext = RequestContext
> extends StandardRouter<CT> {

    /**
     * Load request handlers from controller files.
     *
     * @param root The root path of controller classes.
     */
    loadControllers(root: string): this;

    /**
     * Load request middlewares from middleware files.
     *
     * @param root The root path of middleware classes.
     */
    loadMiddlewares(root: string | string[]): this;
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

export const DEFAULT_VERSION: HTTPVersion = 1.1;

export const EXCEPTION_TYPE: string = "litert/http";

export const DEFAULT_MIN_SSL_VERSION = "TLSv1.0";

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
