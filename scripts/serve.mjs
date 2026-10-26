import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

const project = resolve(new URL('..', import.meta.url).pathname);
const root = join(project, 'dist');
const webDirectory = process.env.OPENCODE_WEB_DIR || '/home/runner/work/_temp/omgithub-web';
const port = Number(process.env.PORT || 3000);

if (!existsSync(join(root, 'index.html'))) {
  console.error('Static output is missing dist/index.html.');
  process.exit(1);
}

mkdirSync(webDirectory, { recursive: true });
writeFileSync(join(webDirectory, 'deployment-output.json'), JSON.stringify({
  project,
  directory: root
}));

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.woff2': 'font/woff2'
};

const server = createServer((request, response) => {
  const url = new URL(request.url || '/', 'http://localhost');
  if (url.pathname === '/__health') {
    response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end('{"ok":true}');
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }
  const candidate = resolve(root, '.' + pathname);
  if (candidate !== root && !candidate.startsWith(root + '/')) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }
  let file = candidate;
  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
    const info = statSync(file);
    if (!info.isFile()) throw new Error('not a file');
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, {
    'Content-Type': mime[extname(file)] || 'application/octet-stream',
    'Content-Length': statSync(file).size,
    'Cache-Control': 'no-cache'
  });
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  createReadStream(file).pipe(response);
});

server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
  process.exit(1);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Serving ${root} on http://0.0.0.0:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 2000).unref();
  });
}
