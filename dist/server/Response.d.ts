/// <reference types="node" />
declare module "http" {
    class ServerResponse implements ServerResponse {
        sendJSON(data: any): ServerResponse;
        redirect(target: string, statusCode?: number): ServerResponse;
        send(data: string | Buffer): ServerResponse;
    }
}
export {};
