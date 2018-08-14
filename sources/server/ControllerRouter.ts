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

import "reflect-metadata";
import * as Core from "@litert/core";
import * as Abstract from "./Abstract";
import Exception from "./Exception";
import ServerError from "./Errors";
import { Router } from "./StandardRouter";
import * as fs from "fs";
import * as pathUtils from "path";

const META_KEY_RULE: string = "litert:http:router:rules";
const META_KEY_MIDDLEWARES: string = "litert:http:router:middlewares";

interface RouterRule {

    "method": Abstract.HTTPMethod | "NOT_FOUND";

    "path": string | RegExp;

    "data"?: Core.IDictionary<any>;
}

export function Route(
    method: Abstract.HTTPMethod,
    path: string | RegExp | Array<string | RegExp>,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return function(theClass: Object, methodName: string | symbol): void {

        let rules: RouterRule[] = Reflect.getMetadata(
            META_KEY_RULE,
            theClass,
            methodName
        ) || [];

        if (Array.isArray(path)) {

            for (let item of path) {

                rules.push({
                    method,
                    path: item,
                    data
                });
            }
        }
        else {

            rules.push({
                method,
                path,
                data
            });
        }

        Reflect.defineMetadata(
            META_KEY_RULE,
            rules,
            theClass,
            methodName
        );
    };
}

export function Get(
    path: string | RegExp | Array<string | RegExp>,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("GET", path, data);
}

export function Post(
    path: string | RegExp | Array<string | RegExp>,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("POST", path, data);
}

export function Put(
    path: string | RegExp | Array<string | RegExp>,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("PUT", path, data);
}

export function Patch(
    path: string | RegExp | Array<string | RegExp>,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("PATCH", path, data);
}

export function Delete(
    path: string | RegExp | Array<string | RegExp>,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("DELETE", path, data);
}

export function Head(
    path: string | RegExp | Array<string | RegExp>,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("HEAD", path, data);
}

export function Options(
    path: string | RegExp | Array<string | RegExp>,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("OPTIONS", path, data);
}

export function NotFound(): Core.MethodDecorator {

    // @ts-ignore
    return Route("NOT_FOUND", "");
}

export interface MiddlewareRegister {

    /**
     * Use a middleware, without PATH and METHOD filter.
     *
     * @param method The method to be handled by middleware.
     * @param path The path to be handled by middleware.
     * @param priority The order priority of middleware, default to be 10.
     */
    (
        method: Abstract.HTTPMethod | Abstract.HTTPMethod[],
        path: string | RegExp | Array<string | RegExp>,
        priority?: number
    ): Core.MethodDecorator;

    /**
     * Use a middleware, with a METHOD filter.
     *
     * @param method The method to be handled by middleware.
     * @param priority The order priority of middleware, default to be 10.
     */
    (
        method: Abstract.HTTPMethod | Abstract.HTTPMethod[],
        priority?: number
    ): Core.MethodDecorator;

    /**
     * Use a middleware, with a PATH filter.
     *
     * @param path The path to be handled by middleware.
     * @param priority The order priority of middleware, default to be 10.
     */
    (
        path: string | RegExp | Array<string | RegExp>,
        priority?: number
    ): Core.MethodDecorator;

    /**
     * Use a middleware, without any filter.
     *
     * @param priority The order priority of middleware, default to be 10.
     */
    (priority?: number): Core.MethodDecorator;
}

/**
 * Set and configure a static method as a middleware.
 */
export let Middleare: MiddlewareRegister = function(
    ...args: any[]
): Core.MethodDecorator {

    return function(theClass: Object, methodName: string | symbol): void {

        let rules: any[] = Reflect.getMetadata(
            META_KEY_MIDDLEWARES,
            theClass,
            methodName
        ) || [];

        rules.push(args);

        Reflect.defineMetadata(
            META_KEY_MIDDLEWARES,
            rules,
            theClass,
            methodName
        );
    };
};

interface MiddlewareConfig {

    "args": any[];

    "method": Abstract.RequestMiddleware;

    "priority": number;
}

class ControllerRouter<
    CT extends Abstract.RequestContext = Abstract.RequestContext
>
extends Router<CT>
implements Abstract.ControllerRouter<CT>
{
    public loadControllers(root: string): this {

        if (!fs.existsSync(root)) {

            throw new Exception(
                ServerError.PATH_NOT_EXIST,
                "The path of controllers/middlewares doesn't exist."
            );
        }

        let items = fs.readdirSync(root);

        for (let item of items) {

            if (item[0] === ".") {

                continue;
            }

            if (item.endsWith(".js")) {

                let path = pathUtils.resolve(root, item);
                let cls = require(
                    `${path.slice(0, -3)}`
                ).default as ObjectConstructor;

                for (let method of Object.getOwnPropertyNames(cls.prototype)) {

                    let data = Reflect.getMetadata(
                        META_KEY_RULE, cls.prototype, method
                    ) as RouterRule[];

                    if (data === undefined) {

                        continue;
                    }

                    for (let rule of data) {

                        if (rule.method === "NOT_FOUND") {

                            this.notFound(
                                function(
                                    ctx: Abstract.RequestContext
                                ): Promise<void> {

                                    let controller = new cls() as
                                        Core.IDictionary<Abstract.RequestHandler>;

                                    return controller[method](ctx);
                                }
                            );
                            continue;
                        }

                        this.register(
                            rule.method,
                            rule.path,
                            function(
                                ctx: Abstract.RequestContext
                            ): Promise<void> {

                                let controller = new cls() as
                                    Core.IDictionary<Abstract.RequestHandler>;

                                return controller[method](ctx);
                            },
                            rule.data
                        );
                    }
                }
            }
            else if (fs.statSync(`${root}/${item}`).isDirectory()) {

                this.loadControllers(`${root}/${item}`);
            }
        }

        return this;
    }

    private _loadMiddlewares(root: string | string[]): MiddlewareConfig[] {

        let ret: MiddlewareConfig[] = [];

        if (Array.isArray(root)) {

            for (let path of root) {

                ret = ret.concat(this._loadMiddlewares(path));
            }

            return ret;
        }

        if (!fs.existsSync(root)) {

            throw new Exception(
                ServerError.PATH_NOT_EXIST,
                "The path of controllers/middlewares doesn't exist."
            );
        }

        let items = fs.readdirSync(root);

        for (let item of items) {

            if (item[0] === ".") {

                continue;
            }

            if (!item.endsWith(".js")) {

                if (fs.statSync(`${root}/${item}`).isDirectory()) {

                    this.loadControllers(`${root}/${item}`);
                }

                continue;
            }

            let path = pathUtils.resolve(root, item);
            let cls = require(
                `${path.slice(0, -3)}`
            ).default as ObjectConstructor;

            for (let method of Object.getOwnPropertyNames(cls)) {

                let data = Reflect.getMetadata(
                    META_KEY_MIDDLEWARES, cls, method
                ) as any[][];

                if (data === undefined) {

                    continue;
                }

                for (let rule of data) {

                    if (typeof rule[rule.length - 1] === "number") {

                        let priority: number = rule.pop();

                        ret.push({
                            "args": rule,
                            // @ts-ignore
                            "method": cls[method].bind(cls),
                            priority
                        });
                    }
                    else {

                        ret.push({
                            "args": rule,
                            // @ts-ignore
                            "method": cls[method].bind(cls),
                            "priority": 10
                        });
                    }
                }
            }
        }

        return ret;
    }

    public loadMiddlewares(root: string | string[]): this {

        let items = this._loadMiddlewares(root);

        items = items.sort((a, b) => a.priority - b.priority);

        for (let item of items) {

            this.use(
                ...item.args,
                item.method
            );
        }

        return this;
    }
}

export function createControllerRouter<
    CT extends Abstract.RequestContext = Abstract.RequestContext
>(): Abstract.ControllerRouter<CT> {

    return new ControllerRouter<CT>();
}
