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

import {
    ServerRequest,
    GetContentOptions,
    ContentParser
} from "../Abstract";
import HttpException from "../Exception";
import ServerErrors from "../Errors";

class JSONParser implements ContentParser {

    public async parse(
        request: ServerRequest,
        opts: GetContentOptions<string>
    ): Promise<any> {

        if (opts.assert) {

            if (request.getContentInfo().type !== "application/json") {

                throw new HttpException(
                    ServerErrors.UNACCEPTABLE_CONTENT_TYPE,
                    "The content data is unparsable."
                );
            }
        }

        const data = await request.getContent({
            type: "raw",
            maxBytes: opts.maxBytes
        });

        try {

            return JSON.parse(data.toString());
        }
        catch {

            throw new HttpException(
                ServerErrors.UNACCEPTABLE_CONTENT_TYPE,
                "The content data is unparsable."
            );
        }
    }
}

export function createJSONParser(): ContentParser {

    return new JSONParser();
}
