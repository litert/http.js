# Changes Logs

## v0.2.0

- A full new async/await based HTTP server.
- Temporarily disabled HTTP CONNECT method. (Return 405)
- Added middleware supports.
- Added supports for all WebDav methods.
- Added method redirect for ServerResponse object.
- Added method sendJSON for ServerResponse object.
- Added method getBodyAsJSON for ServerRequest object.
- Added method getBody for ServerRequest object.
- Allowed binding data with a router rule.
- Added HTTPS/1.1 supports.
- Implemented method shutdown for class Server.
- Added shorcut methods for HTTP/1.1 standard methods in router, e.g. get, 
post, put, etc.

## v0.1.0-b1

- Fixed bug: Attack by unsupported HTTP method could leads to the crash of
server.
- Added middleware supports.
- Improved embedded error pages.
- Added SHUTDOWN status handler.
- Improved error handlers.
- Rebuilt with async/await syntax.
