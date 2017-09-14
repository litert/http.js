import { ServerOptions, HTTPServer } from "./common";
export declare const EVENT_SHUTTING_DOWN: string;
export declare const EVENT_NOT_FOUND: string;
export declare const EVENT_HANDLER_FAILURE: string;
export declare const EVENT_METHOD_NOT_ALLOWED: string;
export declare function createServer(opts?: ServerOptions): HTTPServer;
