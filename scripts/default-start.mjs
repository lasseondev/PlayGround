// OMGithub runtime starter script
// This script is used to start the development server

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const args = process.argv.slice(2);
const script = args[0] || 'dev';
const runtimeDir = process.env.RUNTIME_DIR || path.join(process.cwd(), '..', '..');
const projectDir = process.cwd();

function runCommand(command, args = [], options = {}) {
  console.log(`Running: ${command} ${args.join(' ')}`);
  
  const child = spawn(command, args, {
    cwd: options.cwd || projectDir,
    stdio: 'inherit',
    shell: true,
    ...options
  });

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });

async function main() {
  try {
    if (script === 'dev') {
      // Development mode - start Vite
      await runCommand('npm', ['run', 'dev'], {
        env: { ...process.env, NODE_ENV: 'development' }
      });
    } else if (script === 'build') {
      // Build mode - run Vite build
      await runCommand('npm', ['run', 'build'], {
        env: { ...process.env, NODE_ENV: 'production' }
      });
    } else if (script === 'verify') {
      // Verification mode - run verification script
      await runCommand('node', ['scripts/verify.js']);
    } else {
      console.error(`Unknown script: ${script}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

main();