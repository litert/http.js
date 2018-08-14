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

class StringParser implements ContentParser {

    public async parse(
        request: ServerRequest,
        opts: GetContentOptions<string>
    ): Promise<any> {

        const data = await request.getContent({
            type: "raw",
            maxBytes: opts.maxBytes
        });

        return data.toString();
    }
}

export function createStringParser(): ContentParser {

    return new StringParser();
}
