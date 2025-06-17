const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://motab3aa.runasp.net",
      changeOrigin: true,
    })
  );
};
