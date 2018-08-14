/**
 *  Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as NodeHTTP from "http";
import * as NodeHTTPS from "https";
import * as URL from "url";
import * as NodeZLib from "zlib";
import { Readable } from "stream";
import Exception from "../server/Exception";
import ClientError from "./Errors";

export interface BasicAuthOptions {

    type: "basic";

    username: string;

    password: string;
}

export interface BearerAuthOptions {

    type: "bearer";

    token: string;
}

export interface URLInfo {

    host: string;

    path: string;

    port?: number;

    https?: boolean;
}

export interface IHttpRequestOptions {

    /**
     * The URL to be requested.
     */
    url: string | {

        /**
         * The host of remote server to be requested.
         */
        host: string;

        /**
         * The path (pathname + querystring) of URL to be requested.
         */
        path: string;

        /**
         * The port of remote server to be requested.
         */
        port?: number;

        /**
         * Use HTTP over SSL/TLS, or not.
         */
        https?: boolean;
    };

    /**
     * The headers to be sent.
     */
    headers?: Record<string, string>;

    /**
     * The authentication to be sent.
     */
    auth?: BasicAuthOptions | BearerAuthOptions;

    /**
     * The data to be sent.
     */
    data?: Buffer | string | Readable;

    /**
     * The content-type of data to be sent.
     */
    dataType?: string;

    /**
     * Return headers of response only.
     */
    headerOnly?: boolean;

    /**
     * Specify the timeout of request.
     */
    timeout?: number | {

        /**
         * Timeout for connecting remote server.
         */
        connection?: number;

        /**
         * Timeout for sending data of request.
         */
        sending?: number;

        /**
         * Timeout for waiting headers of response.
         */
        headers?: number;

        /**
         * Timeout for waiting body of response.
         */
        receiving?: number;
    };
}

export interface IHttpRequestDataOptions extends IHttpRequestOptions {

    data: Buffer | string | Readable;

    dataType: string;
}

export interface IFullHttpRequestOptions extends IHttpRequestOptions {

    /**
     * The method of request.
     */
    method: "GET" | "POST" | "PUT" | "PATCH" | "HEAD" | "DELETE" | "OPTIONS";
}

export interface IHttpResponse {

    /**
     * The status code of response.
     */
    code: number;

    /**
     * The data of response.
     */
    data: Buffer;

    /**
     * The headers of response.
     */
    headers: Record<string, string | string[]>;
}

export interface IHttpClient {

    /**
     * Send a request.
     *
     * @param opt The options of request.
     */
    request(opt: IFullHttpRequestOptions): Promise<IHttpResponse>;

    /**
     * Send a GET request.
     *
     * @param opt The options of request.
     */
    get(opts: IHttpRequestOptions): Promise<IHttpResponse>;

    /**
     * Send a POST request.
     *
     * @param opt The options of request.
     */
    post(opts: IHttpRequestDataOptions): Promise<IHttpResponse>;

    /**
     * Send a PUT request.
     *
     * @param opt The options of request.
     */
    put(opts: IHttpRequestDataOptions): Promise<IHttpResponse>;

    /**
     * Send a DELETE request.
     *
     * @param opt The options of request.
     */
    delete(opts: IHttpRequestOptions): Promise<IHttpResponse>;

    /**
     * Send a PATCH request.
     *
     * @param opt The options of request.
     */
    patch(opts: IHttpRequestDataOptions): Promise<IHttpResponse>;

    /**
     * Send a HEAD request.
     *
     * @param opt The options of request.
     */
    head(opts: IHttpRequestOptions): Promise<Pick<IHttpResponse, "code" | "headers">>;

    /**
     * Send a OPTIONS request.
     *
     * @param opt The options of request.
     */
    options(opts: IHttpRequestOptions): Promise<IHttpResponse>;
}

class HttpClient
implements IHttpClient {

    public get(opts: IHttpRequestOptions): Promise<IHttpResponse> {

        const opt = <IFullHttpRequestOptions> opts;

        opt.method = "GET";

        return this.request(opt);
    }

    public delete(opts: IHttpRequestOptions): Promise<IHttpResponse> {

        const opt = <IFullHttpRequestOptions> opts;

        opt.method = "DELETE";

        return this.request(opt);
    }

    public options(opts: IHttpRequestOptions): Promise<IHttpResponse> {

        const opt = <IFullHttpRequestOptions> opts;

        opt.method = "OPTIONS";

        return this.request(opt);
    }

    public head(opts: IHttpRequestOptions): Promise<IHttpResponse> {

        const opt = <IFullHttpRequestOptions> opts;

        opt.method = "HEAD";
        opt.headerOnly = true;

        return this.request(opt);
    }

    public post(opts: IHttpRequestDataOptions): Promise<IHttpResponse> {

        const opt = <IFullHttpRequestOptions> opts;

        opt.method = "POST";

        return this.request(opt);
    }

    public patch(opts: IHttpRequestDataOptions): Promise<IHttpResponse> {

        const opt = <IFullHttpRequestOptions> opts;

        opt.method = "PATCH";

        return this.request(opt);
    }

    public put(opts: IHttpRequestDataOptions): Promise<IHttpResponse> {

        const opt = <IFullHttpRequestOptions> opts;

        opt.method = "PUT";

        return this.request(opt);
    }

    public request(
        opt: IFullHttpRequestOptions
    ): Promise<IHttpResponse> {

        let urlInfo: URLInfo;

        /**
         * Parsing URL
         */
        if (typeof opt.url === "string") {

            const url = URL.parse(opt.url);
            urlInfo = {
                host: url.hostname as string,
                path: url.path as string,
                port: url.port ? parseInt(url.port) : undefined,
                https: url.protocol === "https:"
            };
        }
        else {

            urlInfo = opt.url;
        }

        const cfg: any = {
            host: urlInfo.host,
            port: urlInfo.port,
            path: urlInfo.path,
            headers: opt.headers,
            secureProtocol: "TLSv1_2_method",
            method: opt.method
        };

        /**
         * The HEAD method doesn't response with the body.
         */
        if (opt.method === "HEAD") {

            opt.headerOnly = true;
        }

        if (opt.dataType) {

            if (!cfg.headers) {

                cfg.headers = {};
            }

            cfg.headers["Content-Type"] = opt.dataType;
        }

        if (opt.auth) {

            if (!cfg.headers) {

                cfg.headers = {};
            }

            switch (opt.auth.type) {

            case "bearer":

                cfg.headers["Authorization"] = `Bearer ${opt.auth.token}`;
                break;

            case "basic":

                cfg.headers["Authorization"] = `Basic ${Buffer.from(
                    `${opt.auth.username}:${opt.auth.password}`
                ).toString("base64")}`;
                break;
            }
        }

        if (opt.data) {

            if (!cfg.headers) {

                cfg.headers = {};
            }

            if (opt.data instanceof Readable) {

                if (!Object.keys(cfg.headers).map(
                    (x) => x.toLowerCase()
                ).includes("content-length")) {

                    return Promise.reject(new Exception(
                        ClientError.LACK_CONTENT_LENGTH,
                        `Lack of Content-Length.`
                    ));
                }
            }
            else {

                cfg.headers["content-length"] = Buffer.byteLength(opt.data);
            }
        }

        return new Promise<IHttpResponse>(function(resolve, reject): void {

            const callback = function(resp: NodeHTTP.IncomingMessage): void {

                if (
                    opt.headerOnly ||
                    resp.statusCode === 204 ||
                    !resp.headers["content-type"]
                ) {

                    resp.destroy();

                    return resolve({
                        code: resp.statusCode as number,
                        data: Buffer.alloc(0),
                        headers: <any> resp.headers
                    });
                }

                const dataBuf: Buffer[] = [];

                let stream: any = resp;

                if (resp.headers["content-encoding"] === "gzip") {

                    stream = NodeZLib.createGunzip();
                    resp.pipe(stream);
                }
                else if (resp.headers["content-encoding"] === "deflate") {

                    stream = NodeZLib.createDeflate();
                    resp.pipe(stream);
                }

                stream.on("data", function(chunk: Buffer): void {

                    dataBuf.push(chunk);

                }).on("end", function(): void {

                    resp.destroy();

                    return resolve({
                        code: resp.statusCode as number,
                        data: Buffer.concat(dataBuf),
                        headers: <any> resp.headers
                    });
                });
            };

            const req = urlInfo.https ?
                NodeHTTPS.request(cfg, callback) :
                NodeHTTP.request(cfg, callback);

            if (opt.timeout) {

                const TIMEOUT = typeof opt.timeout === "number" ?
                                opt.timeout : 0;
                const TIMEOUT_CONN = typeof opt.timeout !== "number" ?
                                     opt.timeout.connection || 0 : 0;
                const TIMEOUT_SEND = typeof opt.timeout !== "number" ?
                                     opt.timeout.sending || 0 : 0;
                const TIMEOUT_HEAD = typeof opt.timeout !== "number" ?
                                     opt.timeout.headers || 0 : 0;
                const TIMEOUT_RECV = typeof opt.timeout !== "number" ?
                                     opt.timeout.receiving || 0 : 0;

                if (TIMEOUT) {

                    req.setTimeout(TIMEOUT, function() {

                        req.destroy(new Error("Request timeout."));
                    });
                }
                else if (TIMEOUT_CONN) {

                    let reason = "Connect";

                    /**
                     * Set the timeout for connecting.
                     */
                    req.setTimeout(TIMEOUT_CONN, function() {

                        req.destroy(new Error(`${reason} timeout.`));
                    });

                    req.on("socket", function(this: typeof req): void {

                        this.socket.on(
                            "connect",
                            function(this: typeof req.socket): void {

                                reason = "Send-Data";
                                this.setTimeout(TIMEOUT_SEND);
                            }
                        );
                    });

                    req.on("finish", function(this: typeof req): void {

                        reason = "Response";
                        this.setTimeout(TIMEOUT_HEAD);
                    });

                    req.on("response", function(this: typeof req): void {

                        reason = "Receive-Data";
                        this.setTimeout(TIMEOUT_RECV);
                    });
                }
            }

            req.once("error", (e) => {

                reject(e);
            });

            if (opt.data) {

                if (
                    typeof opt.data === "string" ||
                    opt.data instanceof Buffer
                ) {

                    req.write(opt.data);
                    req.end();
                }
                else if ("pipe" in opt.data) {
                    opt.data.pipe(req);
                }
                else {

                    req.end();
                }
            }
            else {

                req.end();
            }

        });
    }
}

export function createClient(): IHttpClient {

    return new HttpClient();
}
