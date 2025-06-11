const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Proxy API requests to the actual backend
app.use('/api', createProxyMiddleware({
  target: 'http://motab3aa.runasp.net',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // No rewrite needed in this case
  },
}));

// Start the proxy server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});