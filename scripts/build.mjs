import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('src', 'dist', { recursive: true });
if (existsSync('public')) await cp('public', 'dist', { recursive: true });
console.log('Built HomeForge AI static site to dist/');
