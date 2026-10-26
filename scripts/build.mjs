import { cpSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const started = performance.now();
const project = resolve(new URL('..', import.meta.url).pathname);
const source = join(project, 'web');
const output = join(project, 'dist');

if (!existsSync(join(source, 'index.html'))) {
  console.error('Build failed: web/index.html is missing.');
  process.exit(1);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(source, output, { recursive: true });

const files = ['index.html', 'styles.css', join('src', 'main.js'), join('vendor', 'three.module.min.js')];
for (const file of files) {
  const path = join(output, file);
  if (!existsSync(path) || statSync(path).size === 0) {
    console.error(`Build failed: ${file} was not copied.`);
    process.exit(1);
  }
}

cpSync(join(project, 'PLAN.md'), join(output, 'PLAN.md'), { force: true });
const milliseconds = Math.round(performance.now() - started);
console.log(`Built ${output} in ${milliseconds} ms`);
