import "reflect-metadata";
import * as Core from "@litert/core";
import * as Abstract from "./Abstract";
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
    path: string,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return function(theClass: Object, methodName: string | symbol): void {

        let rules: RouterRule[] = Reflect.getMetadata(
            META_KEY_RULE,
            theClass,
            methodName
        ) || [];

        rules.push({
            method,
            path,
            data
        });

        Reflect.defineMetadata(
            META_KEY_RULE,
            rules,
            theClass,
            methodName
        );
    };
}

export function Get(
    path: string,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("GET", path, data);
}

export function Post(
    path: string,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("POST", path, data);
}

export function Put(
    path: string,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("PUT", path, data);
}

export function Patch(
    path: string,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("PATCH", path, data);
}

export function Delete(
    path: string,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("DELETE", path, data);
}

export function Head(
    path: string,
    data?: Core.IDictionary<any>
): Core.MethodDecorator {

    return Route("HEAD", path, data);
}

export function Options(
    path: string,
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
     */
    (
        method: Abstract.HTTPMethod | Abstract.HTTPMethod[],
        path: string | RegExp | Array<string | RegExp>
    ): Core.MethodDecorator;

    /**
     * Use a middleware, with a METHOD filter.
     *
     * @param method The method to be handled by middleware.
     */
    (
        method: Abstract.HTTPMethod | Abstract.HTTPMethod[]
    ): Core.MethodDecorator;

    /**
     * Use a middleware, with a PATH filter.
     *
     * @param path The path to be handled by middleware.
     */
    (
        path: string | RegExp | Array<string | RegExp>
    ): Core.MethodDecorator;

    /**
     * Use a middleware, without any filter.
     */
    (): Core.MethodDecorator;

}

export let Middleare: MiddlewareRegister = function(...args: any[]): Core.MethodDecorator {

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

class ControllerRouter<
    CT extends Abstract.RequestContext = Abstract.RequestContext
>
extends Router<CT>
implements Abstract.ControllerRouter<CT>
{
    public loadControllers(root: string): this {

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

    public loadMiddlewares(root: string): this {

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

                for (let method of Object.getOwnPropertyNames(cls)) {

                    let data = Reflect.getMetadata(
                        META_KEY_MIDDLEWARES, cls, method
                    ) as any[][];

                    if (data === undefined) {

                        continue;
                    }

                    for (let rule of data) {

                        this.use(
                            ...rule,
                            // @ts-ignore
                            cls[method].bind(cls)
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
}

export function createControllerRouter<
    CT extends Abstract.RequestContext = Abstract.RequestContext
>(): Abstract.ControllerRouter<CT> {

    return new ControllerRouter<CT>();
}
