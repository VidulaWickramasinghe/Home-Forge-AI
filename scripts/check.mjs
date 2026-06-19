import { readFile } from 'node:fs/promises';

const html = await readFile('src/index.html', 'utf8');
const css = await readFile('src/styles.css', 'utf8');
const js = await readFile('src/app.js', 'utf8');
const required = ['HomeForge AI', 'Build your dream home', 'modules', 'builder', 'pricing'];
const missing = required.filter((text) => !html.includes(text));
if (missing.length) throw new Error(`Missing required content: ${missing.join(', ')}`);
if (!css.includes('.house') || !css.includes('@media')) throw new Error('Missing responsive 3D house styling');
if (!js.includes('IntersectionObserver')) throw new Error('Missing reveal animation logic');
console.log('Static site checks passed');
