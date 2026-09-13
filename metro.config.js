const http = require('http');
const { getDefaultConfig } = require('expo/metro-config');

const API_ORIGIN = 'http://127.0.0.1:3000';
const API_PREFIXES = ['/health', '/auth', '/animais', '/usuarios', '/ongs'];

function shouldProxy(urlPath) {
  const path = String(urlPath || '').split('?')[0];
  return API_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function proxyToApi(req, res) {
  const target = new URL(req.url, API_ORIGIN);
  const headers = { ...req.headers, host: '127.0.0.1:3000' };
  delete headers['accept-encoding'];

  const proxyReq = http.request(
    {
      hostname: '127.0.0.1',
      port: 3000,
      path: `${target.pathname}${target.search}`,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on('error', () => {
    if (res.headersSent) {
      res.end();
      return;
    }
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: {
          message: 'Não foi possível conectar à API. Verifique se o backend está no ar.',
        },
      }),
    );
  });

  req.pipe(proxyReq);
}

const config = getDefaultConfig(__dirname);
const previousEnhance = config.server?.enhanceMiddleware;

config.server = {
  ...config.server,
  enhanceMiddleware(metroMiddleware, server) {
    const inner = previousEnhance ? previousEnhance(metroMiddleware, server) : metroMiddleware;
    return (req, res, next) => {
      if (shouldProxy(req.url)) {
        proxyToApi(req, res);
        return;
      }
      return inner(req, res, next);
    };
  },
};

module.exports = config;
