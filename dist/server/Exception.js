"use strict";
const core_1 = require("@litert/core");
const Core_1 = require("./Core");
class HttpException extends core_1.Exception {
    constructor(error, message) {
        super(error, message);
        this._type = Core_1.EXCEPTION_TYPE;
    }
}
module.exports = HttpException;
//# sourceMappingURL=Exception.js.map