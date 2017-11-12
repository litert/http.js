/// <reference types="node" />
declare module "http" {
    class IncomingMessage implements IncomingMessage {
        getBody(maxLength?: number): Promise<Buffer>;
        getBodyAsJSON(maxLength?: number): Promise<any>;
    }
}
export {};
