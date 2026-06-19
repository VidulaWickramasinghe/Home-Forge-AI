import { readFile } from 'node:fs/promises';

const html = await readFile('src/index.html', 'utf8');
const css = await readFile('src/styles.css', 'utf8');
const js = await readFile('src/app.js', 'utf8');
const threeBuilderJs = await readFile('src/three-builder.js', 'utf8');
const builderHtml = await readFile('src/builder/index.html', 'utf8');
const builderJs = await readFile('src/builder/builder.js', 'utf8');
const builderCss = await readFile('src/builder/builder.css', 'utf8');

const requiredHome = [
  'Dream House Prototype Builder',
  'Prototype Builder',
  'AI Prototype',
  'Contractor Brief',
  'cinematic-preview',
  'immersive-prototype-scene',
  'importmap',
  'heroWebGL',
  'prototypeWebGL',
  'exportGlbBtn',
];
const missingHome = requiredHome.filter((text) => !html.includes(text));
if (missingHome.length) throw new Error(`Missing required home content: ${missingHome.join(', ')}`);

const requiredCss = ['INSANE 3D RETOUCH', 'REAL WEBGL / THREE.JS UPGRADE', '.webgl-hero-mount', '.webgl-prototype-mount', '.prototype-scene.webgl-active', '@media'];
const missingCss = requiredCss.filter((text) => !css.includes(text));
if (missingCss.length) throw new Error(`Missing required CSS: ${missingCss.join(', ')}`);

const requiredJs = ['setupPrototypeOrbit', 'setCameraPreset', 'applyPrototypeCamera', 'initHeroWebGL', 'initWebGLPrototypeBuilder', 'exportPrototypeGLB', 'localStorage', 'Blob'];
const missingJs = requiredJs.filter((text) => !js.includes(text));
if (missingJs.length) throw new Error(`Missing required app logic: ${missingJs.join(', ')}`);

const requiredThreeBuilder = ['GLTFExporter', 'OrbitControls', 'WebGLRenderer', 'createHouseModel', 'exportPrototypeGLB'];
const missingThreeBuilder = requiredThreeBuilder.filter((text) => !threeBuilderJs.includes(text));
if (missingThreeBuilder.length) throw new Error(`Missing required Three.js builder logic: ${missingThreeBuilder.join(', ')}`);

const requiredBuilder = ['2D Floor Plan', 'Live 3D Massing', 'Save', 'Download JSON'];
const missingBuilder = requiredBuilder.filter((text) => !builderHtml.includes(text));
if (missingBuilder.length) throw new Error(`Missing builder content: ${missingBuilder.join(', ')}`);
if (!builderJs.includes('localStorage') || !builderJs.includes('Blob') || !builderJs.includes('wallLength')) {
  throw new Error('Builder is missing save/load/export or measurement logic');
}
if (!builderCss.includes('.advanced-builder-shell') || !builderCss.includes('@media')) {
  throw new Error('Builder is missing layout or responsive styles');
}
console.log('Static site, 3D prototype studio, and builder checks passed');
