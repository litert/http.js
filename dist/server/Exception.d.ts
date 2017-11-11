import { Exception as AbstractException } from "@litert/core";
declare class HttpException extends AbstractException {
    constructor(error: number, message: string);
}
export = HttpException;
