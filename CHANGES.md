# Changes Logs

## v0.3.0

- Improved the cookies encode/decode performances.
- Improved the signature of self-returning methods.
- Added events `closed` and `started`.
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
