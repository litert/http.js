# Changes Logs

## v0.4.4

- Fixed: Read all packets.

## v0.4.3

- Upgraded `@litert/core` to v0.6.0.

## v0.4.2

- Fixed: The JSON parsing exception is uncaught.

## v0.4.1

- Upgraded `@litert/core` to v0.5.0.
- Added argument `assert` for method `ServerRequest.getContent`.
- Added urlencode for `cookies` encoding.
- Fixed some bug due to "=" insides the cookies value.
- Now the decorator supports multi-path rules for once registration.

## v0.4.0

- Upgraded `@litert/core` to v0.4.0.
- Added following methods for class `ServerRequest`:
  - `getAcceptableLanguages`
  - `getAcceptableEncodings`
  - `getAcceptableTypes`
  - `getContent` get and parse the http content, supporting types **raw**,
    **json**, **string**, **urlencode**, and etc.
- Added built-in plugins for **raw**, **json**, **string**, **urlencode**, 
  **base64** parser.
- Deprecated creating-server options `plugins.cookies`, use the option
  `plugins["parser:cookies"]` instead.
- Deprecated following properties or methods in class `ServerRequest`:
  - `acceptableLanguages` (use `getAcceptableLanguages` instead)
  - `acceptableEncodings` (use `getAcceptableEncodings` instead)
  - `acceptableTypes` (use `getAcceptableTypes` instead)
  - `getBody` (use `getContent` instead)
  - `getBodyAsJSON` (use `getContent` instead)
- Deprecated methods `createStandardCookiesEncoder`, use
  `plugins.createCookiesEncoder` instead.

> **All the above DEPRECATED items will be removed in v0.5.0.**

## v0.3.1

- Fixed the dependency to `@litert/core`.

## v0.3.0

- Fixed the minimal SSL/TLS protocol version restriction in virtual hosts.
- Added the router for controllers' methods mapping.
- Added wildcard supports in router.

## v0.3.0-4

- Added minimal SSL/TLS protocol version restriction.
- Added virtual hosts supports.
- Fixed the cookies encoder about domain.
- Added new utility properties for ServerRequest objects.

## v0.3.0-3

- Rebuilt the servers' mount-points.
- Added experimental HTTP/2 protocol supports.

## v0.3.0-2

- Improved the cookies encode/decode performances.
- Improved the signature of self-returning methods.
- Fixed: The error event leads a promise leak. (Merged from v0.2.3)

## v0.3.0-1

- Added events `closed` and `started`.

## v0.3.0-0

- Enable using a customized request context object.

## v0.2.3

- Fixed: The error event leads a promise leak.

## v0.2.2

- Added multi-entry for router register methods. (Issue #1)

## v0.2.1

- Added mount-points supports for server.

## v0.2.0

- A full new async/await based HTTP server.
- Temporarily disabled HTTP CONNECT method. (Return 405)
- Added middleware supports.
- Added supports for all WebDav methods.
- Added method redirect for ServerResponse object.
- Added method sendJSON for ServerResponse object.
- Added method send for ServerResponse object.
- Added method getBodyAsJSON for ServerRequest object.
- Added method getBody for ServerRequest object.
- Allowed binding data with a router rule.
- Added HTTPS/1.1 supports.
- Implemented method shutdown for class Server.
- Added shorcut methods for HTTP/1.1 standard methods in router, e.g. get, 
post, put, etc.
- Added detection for NOT CALLING NEXT CALLBACK.
- Improved the smart router and RegExp router.
- Added detection for client closing connection.
- Added detection for timeout when reading data from client.
- Added property `host`, `path`, `query`, `queryString`, `https`, `ip`,
`aborted`, `closed`, `params`, etc for ServerRequest object.
- Added HTTP Cookies encoder.

## v0.1.0-b1

- Fixed bug: Attack by unsupported HTTP method could leads to the crash of
server.
- Added middleware supports.
- Improved embedded error pages.
- Added SHUTDOWN status handler.
- Improved error handlers.
- Rebuilt with async/await syntax.
