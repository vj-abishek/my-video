const http = require('http');
const httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
const proxy = httpProxy.createProxyServer({});

// To modify the proxy connection before data is sent, you can listen
// for the 'proxyReq' event. When the event is fired, you will receive
// the following arguments:
// (http.ClientRequest proxyReq, http.IncomingMessage req,
//  http.ServerResponse res, Object options). This mechanism is useful when
// you need to modify the proxy request before the proxy connection
// is made to the target.
//
proxy.on('proxyReq', (proxyReq, req, res, options) => {
  proxyReq.setHeader('host', 'api.brandbird.app');
  proxyReq.setHeader('Origin', null);
  proxyReq.setHeader('Referer', null);
});

const server = http.createServer((req, res) => {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  console.log(req)
  res.setHeader('Origin', 'http://localhost:3001');
  res.setHeader('Referer', 'http://localhost:3001');
  proxy.web(req, res, {
    target: 'https://api.brandbird.app',
    followRedirects: true,
    secure: false
  });
});

console.log("listening on port 7645")
server.listen(7645)