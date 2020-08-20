const HttpServer = require('../transport/httpServer');
const Server = require('../jsonrpc/server/server');

const server = new Server();

function abc() {
  return 'abc';
}

const httpServer = new HttpServer();
httpServer.registerMethod(async (requestBody, req, resp) => {
  resp.setHeader('content-type', 'application/json');
  server.registerLoader((methodName) => abc);
  const op = await server.respond(requestBody);
  return op;
});
httpServer.init();
httpServer.listen(3000);
