import { readFile } from 'node:fs/promises';

const html = await readFile('src/index.html', 'utf8');
const css = await readFile('src/styles.css', 'utf8');
const js = await readFile('src/app.js', 'utf8');
const builderHtml = await readFile('src/builder/index.html', 'utf8');
const builderJs = await readFile('src/builder/builder.js', 'utf8');
const builderCss = await readFile('src/builder/builder.css', 'utf8');

const requiredHome = ['HomeForge AI', 'Build your dream home', 'modules', '/builder/', 'pricing'];
const missingHome = requiredHome.filter((text) => !html.includes(text));
if (missingHome.length) throw new Error(`Missing required home content: ${missingHome.join(', ')}`);
if (!css.includes('.house') || !css.includes('@media')) throw new Error('Missing responsive 3D house styling');
if (!js.includes('IntersectionObserver')) throw new Error('Missing reveal animation logic');

const requiredBuilder = ['2D Floor Plan', 'Live 3D Massing', 'Save', 'Download JSON'];
const missingBuilder = requiredBuilder.filter((text) => !builderHtml.includes(text));
if (missingBuilder.length) throw new Error(`Missing builder content: ${missingBuilder.join(', ')}`);
if (!builderJs.includes('localStorage') || !builderJs.includes('Blob') || !builderJs.includes('wallLength')) {
  throw new Error('Builder is missing save/load/export or measurement logic');
}
if (!builderCss.includes('.advanced-builder-shell') || !builderCss.includes('@media')) {
  throw new Error('Builder is missing layout or responsive styles');
}
console.log('Static site and builder checks passed');
