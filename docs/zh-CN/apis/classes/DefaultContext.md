# 类 DefaultContext

该类是默认的上下文对象类，仅作为其它自定义上下文对象的基类使用。

## 声明

```ts
class DefaultContext implements RequestContext {

    public data: IDictionary<any>;

    public request: ServerRequest;

    public response: ServerResponse;

    public constructor(req: ServerRequest, resp: ServerResponse);
}
```
