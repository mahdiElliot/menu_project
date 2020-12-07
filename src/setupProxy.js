const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/v400",
    createProxyMiddleware({
      target: "https://apiv4.ordering.co",
      changeOrigin: true,
    })
  );
};
