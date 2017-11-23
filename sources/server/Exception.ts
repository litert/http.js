import { Exception as AbstractException } from "@litert/core";
import { EXCEPTION_TYPE } from "./Core";

class HttpException extends AbstractException {

    public constructor(error: number, message: string) {

        super(error, message);

        this._type = EXCEPTION_TYPE;
    }
}

export default HttpException;
