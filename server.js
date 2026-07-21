/**
 * server.js — lightweight HTTP server menggunakan Node.js built-in module saja.
 * Tidak perlu npm install, langsung jalan dengan: node server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;
const COUNTER_FILE = path.join(ROOT, 'counter.json');

// Inisialisasi file counter jika belum ada
if (!fs.existsSync(COUNTER_FILE)) {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: 0, ips: [] }));
}

// ── MIME types ──────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

// ── Helper ──────────────────────────────────────────────────────
function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendJSON(res, 404, { error: 'Not found' });
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

// ── Counter API ─────────────────────────────────────────────────
function getCounter() {
  try {
    return JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf-8'));
  } catch { return { count: 0, ips: [] }; }
}

function handleCounter(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket.remoteAddress?.replace(/^::ffff:/, '')
    || 'unknown';

  if (req.method === 'GET') {
    const data = getCounter();
    sendJSON(res, 200, { count: data.count });
    return;
  }

  if (req.method === 'POST') {
    const data = getCounter();
    if (!data.ips.includes(ip)) {
      data.ips.push(ip);
      data.count = data.ips.length;
      fs.writeFileSync(COUNTER_FILE, JSON.stringify(data, null, 2));
    }
    sendJSON(res, 200, { count: data.count });
    return;
  }

  sendJSON(res, 405, { error: 'Method not allowed' });
}

// ── Server ──────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;

  // Route: API counter
  if (pathname === '/api/counter') {
    return handleCounter(req, res);
  }

  // Route: serve static files
  let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
  sendFile(res, filePath);
});

server.listen(PORT, () => {
  console.log('🚀 EduSampah server aktif di http://localhost:' + PORT);
  console.log('👥 Counter: http://localhost:' + PORT + '/api/counter');
  console.log('📄 Buka website: http://localhost:' + PORT);
});
