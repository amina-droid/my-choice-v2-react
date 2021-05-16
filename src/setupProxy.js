const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/time',
    createProxyMiddleware({
      target: 'https://xn--72-9kcd8arods1i.xn--p1ai/api/time',
      changeOrigin: true,
    })
  );
};
