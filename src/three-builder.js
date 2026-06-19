import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

let heroContext = null;
let prototypeContext = null;
let activeViewMode = "exterior";

const HERO_DESIGN = {
  land: { area: 600, shape: "rectangular", hasGarden: true, hasPool: true, hasDriveway: true },
  building: { stories: 2, basementLevels: 1, shape: "modern-box", garage: "double", roofStyle: "gable", wallColor: "#e5e7eb", roofColor: "#111827" },
  exterior: { windowStyle: "wide", doorStyle: "timber", hasSolar: true, hasBalcony: true, hasOutdoorArea: true },
  interior: { bedrooms: 4, bathrooms: 3, furnishingStyle: "modern" },
  estimate: { areaM2: 462, costAUD: 956600 }
};

function createThreeContext(mount, options = {}) {
  const scene = new THREE.Scene();
  const width = mount.clientWidth || 1;
  const height = mount.clientHeight || 1;
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(...(options.cameraPosition || [6.5, 4.8, 7.2]));
  const cameraTarget = new THREE.Vector3(...(options.cameraTarget || [0, 0.8, 0]));
  camera.lookAt(cameraTarget);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.innerHTML = "";
  mount.appendChild(renderer.domElement);

  const controls = options.controls ? new OrbitControls(camera, renderer.domElement) : null;
  if (controls) {
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 4;
    controls.maxDistance = 16;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.copy(cameraTarget);
    controls.update();
  }

  scene.add(new THREE.HemisphereLight(0xffffff, 0x0f172a, 1.15));
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(5.5, 8, 4.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 32;
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  scene.add(sun);
  const cyan = new THREE.PointLight(0x67e8f9, 1.8, 18);
  cyan.position.set(-4.5, 2.8, 3.5);
  scene.add(cyan);
  const gold = new THREE.PointLight(0xfde68a, 1.45, 18);
  gold.position.set(4.2, 3.2, -3.8);
  scene.add(gold);

  const resizeObserver = new ResizeObserver(() => {
    const nextWidth = mount.clientWidth || 1;
    const nextHeight = mount.clientHeight || 1;
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight);
    if (!controls) camera.lookAt(cameraTarget);
  });
  resizeObserver.observe(mount);
  return { mount, scene, camera, renderer, controls, resizeObserver, model: null, animationId: null, cameraTarget };
}

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: options.roughness ?? 0.45, metalness: options.metalness ?? 0.06, transparent: options.transparent ?? false, opacity: options.opacity ?? 1, emissive: options.emissive ?? 0x000000, emissiveIntensity: options.emissiveIntensity ?? 0 });
}
function physical(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: options.roughness ?? 0.18, metalness: options.metalness ?? 0.02, transmission: options.transmission ?? 0, thickness: options.thickness ?? 0.2, transparent: options.transparent ?? false, opacity: options.opacity ?? 1, emissive: options.emissive ?? 0x000000, emissiveIntensity: options.emissiveIntensity ?? 0 });
}
function box(name, w, h, d, mat, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.name = name;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function dims(design) {
  const areaScale = Math.sqrt((Number(design.land?.area) || 600) / 600);
  let landWidth = 8.2 * areaScale;
  let landDepth = 5.8 * areaScale;
  if (design.land?.shape === "wide") { landWidth *= 1.2; landDepth *= 0.9; }
  if (design.land?.shape === "narrow") { landWidth *= 0.78; landDepth *= 1.2; }
  const map = { "modern-box": [3.4, 2.35], "l-shape": [4.2, 2.6], "wide-villa": [5, 2.45], compact: [2.6, 2.15], "luxury-wing": [5.4, 2.8] };
  const [houseWidth, houseDepth] = map[design.building?.shape] || map["modern-box"];
  return { landWidth, landDepth, houseWidth, houseDepth };
}
function createMaterials(design) {
  return {
    land: material(0x123331, { roughness: 0.72 }), lawn: material(0x22c55e, { roughness: 0.82 }), driveway: material(0x94a3b8, { roughness: 0.6 }),
    wall: material(design.building?.wallColor || "#e5e7eb", { roughness: 0.36 }), roof: material(design.building?.roofColor || "#111827", { roughness: 0.3, metalness: 0.16 }),
    glass: physical(0x67e8f9, { roughness: 0.04, transmission: 0.25, transparent: true, opacity: 0.72, emissive: 0x0284c7, emissiveIntensity: 0.22 }),
    pool: physical(0x22d3ee, { roughness: 0.02, transmission: 0.35, transparent: true, opacity: 0.78, emissive: 0x0891b2, emissiveIntensity: 0.28 }),
    timber: material(0x92400e, { roughness: 0.48 }), garage: material(0xf1f5f9, { roughness: 0.4 }), trim: material(0xffffff, { roughness: 0.28 }), solar: material(0x075985, { roughness: 0.18, metalness: 0.48, emissive: 0x0ea5e9, emissiveIntensity: 0.14 }),
    basement: material(0x312e81, { roughness: 0.55, emissive: 0x1e1b4b, emissiveIntensity: 0.15 }),
    basementGlass: physical(0x38bdf8, { roughness: 0.08, transmission: 0.18, transparent: true, opacity: 0.5, emissive: 0x0284c7, emissiveIntensity: 0.25 }),
    excavation: material(0x020617, { roughness: 0.85, emissive: 0x0f172a, emissiveIntensity: 0.2 }),
    partition: material(0xcbd5e1, { roughness: 0.52 }),
    zoneLiving: material(0xdbeafe, { roughness: 0.55 }), zoneKitchen: material(0xecfeff, { roughness: 0.55 }), zoneBedroom: material(0xfef3c7, { roughness: 0.55 }), zoneBath: material(0xe0f2fe, { roughness: 0.55 })
  };
}
function createRoofMesh(design, width, depth, y, mats) {
  const style = design.building?.roofStyle || "gable";
  if (style === "flat") return box("Flat Roof", width + 0.28, 0.22, depth + 0.28, mats.roof, 0, y + 0.1, 0);
  if (style === "hip") { const r = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.76, 0.9, 4), mats.roof); r.name = "Hip Roof"; r.position.set(0, y + 0.45, 0); r.rotation.y = Math.PI / 4; r.scale.z = depth / width; r.castShadow = r.receiveShadow = true; return r; }
  const group = new THREE.Group(); group.name = `${style} Roof`;
  const roof = style === "skillion" ? box("Skillion Roof", width + 0.35, 0.24, depth + 0.35, mats.roof, 0, y + 0.18, 0) : createGable(width + 0.35, depth + 0.35, 0.85, mats.roof);
  if (style === "skillion") roof.rotation.z = -0.14;
  roof.position.y = style === "gable" || style === "mixed" ? y : roof.position.y;
  group.add(roof);
  if (style === "mixed") { const side = box("Mixed Skillion Wing", width * 0.44, 0.2, depth * 0.78, mats.roof, width * 0.22, y + 0.22, 0); side.rotation.z = -0.12; group.add(side); }
  return group;
}
function createGable(width, depth, height, mat) {
  const w = width / 2, d = depth / 2;
  const vertices = new Float32Array([-w,0,d, w,0,d, 0,height,d, -w,0,-d, w,0,-d, 0,height,-d]);
  const indices = [0,1,2,5,4,3,0,3,4,0,4,1,0,2,5,0,5,3,2,1,4,2,4,5];
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3)); geo.setIndex(indices); geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = mesh.receiveShadow = true; return mesh;
}
function createLandElements(design, mats) {
  const { landWidth, landDepth } = dims(design); const g = new THREE.Group();
  g.add(box("Land Slab", landWidth, 0.28, landDepth, mats.land, 0, -0.14, 0));
  if (design.land?.hasDriveway) g.add(box("Driveway", 1.35, 0.045, landDepth * 0.58, mats.driveway, landWidth * 0.3, 0.045, landDepth * 0.13));
  if (design.land?.hasGarden) g.add(box("Garden Zone", landWidth * 0.28, 0.06, landDepth * 0.25, mats.lawn, -landWidth * 0.3, 0.06, -landDepth * 0.27));
  if (design.land?.hasPool) g.add(box("Swimming Pool", 1.65, 0.08, 0.82, mats.pool, landWidth * 0.26, 0.08, -landDepth * 0.31));
  if (design.exterior?.hasOutdoorArea) g.add(box("Outdoor Timber Deck", 1.75, 0.06, 0.95, mats.timber, -landWidth * 0.2, 0.08, landDepth * 0.23));
  if (design.land?.shape === "corner") g.add(box("Corner Site Marker", 1.0, 0.07, 1.0, mats.driveway, -landWidth * 0.42, 0.07, landDepth * 0.38));
  return g;
}
function addWindows(group, design, width, depth, floor, floorHeight, mats) {
  const style = design.exterior?.windowStyle || "wide";
  const size = { standard: [0.48,0.34], wide: [0.78,0.38], "full-glass": [0.86,0.72], arched: [0.55,0.52] }[style] || [0.78,0.38];
  const y = floor * floorHeight + floorHeight * 0.55;
  [-0.25, 0.25].forEach((p, i) => group.add(box(`Window ${floor + 1}-${i + 1}`, size[0], size[1], 0.04, mats.glass, width * p, y, depth / 2 + 0.025)));
  group.add(box(`Side Window ${floor + 1}`, 0.04, size[1], size[0], mats.glass, width / 2 + 0.025, y, -depth * 0.12));
}

function createUndergroundReveal(design, width, depth, mats, options = {}) {
  const levels = Math.max(0, Math.min(Number(design.building?.basementLevels) || 0, 2));
  const group = new THREE.Group();
  group.name = "Visible Underground Floor Reveal";
  if (!levels) return group;

  const levelHeight = options.compact ? 0.34 : 0.46;
  const revealDepth = options.compact ? 0.16 : 0.22;
  const { landDepth } = dims(design);
  const frontZ = landDepth / 2 + revealDepth / 2 + 0.05;
  const pitWidth = width * 0.92;

  group.add(box(
    "Excavated Basement Opening",
    pitWidth + 0.26,
    0.035,
    revealDepth + 0.18,
    mats.excavation,
    0,
    -0.025,
    frontZ
  ));

  for (let index = 0; index < levels; index += 1) {
    const y = -levelHeight * (index + 0.5) - 0.04;
    const level = box(
      `Underground Floor ${index + 1}`,
      pitWidth,
      levelHeight * 0.86,
      revealDepth,
      mats.basement,
      0,
      y,
      frontZ
    );
    const glazing = box(
      `Underground Floor ${index + 1} Lightwell Glass`,
      pitWidth * 0.22,
      levelHeight * 0.34,
      0.025,
      mats.basementGlass,
      -pitWidth * 0.25,
      y + levelHeight * 0.08,
      frontZ + revealDepth / 2 + 0.018
    );
    const secondGlazing = glazing.clone();
    secondGlazing.name = `Underground Floor ${index + 1} Second Lightwell Glass`;
    secondGlazing.position.x = pitWidth * 0.25;

    const slabLine = box(
      `Underground Floor ${index + 1} Slab Edge`,
      pitWidth + 0.1,
      0.028,
      revealDepth + 0.035,
      mats.trim,
      0,
      y + levelHeight * 0.45,
      frontZ
    );
    group.add(level, glazing, secondGlazing, slabLine);
  }

  group.add(box(
    "Basement Retaining Wall Left",
    0.06,
    levelHeight * levels + 0.12,
    revealDepth + 0.12,
    mats.garage,
    -pitWidth / 2 - 0.06,
    -(levelHeight * levels) / 2 - 0.04,
    frontZ
  ));
  group.add(box(
    "Basement Retaining Wall Right",
    0.06,
    levelHeight * levels + 0.12,
    revealDepth + 0.12,
    mats.garage,
    pitWidth / 2 + 0.06,
    -(levelHeight * levels) / 2 - 0.04,
    frontZ
  ));

  return group;
}

function createExteriorModel(design, mats, options = {}) {
  const { houseWidth: w, houseDepth: d } = dims(design); const g = new THREE.Group(); const floorHeight = options.compact ? 0.74 : 1.05; const stories = Math.max(1, Math.min(Number(design.building?.stories) || 1, 4));
  for (let i = 0; i < stories; i++) { g.add(box(`Floor ${i + 1}`, w, floorHeight, d, mats.wall, 0, floorHeight / 2 + i * floorHeight, 0)); addWindows(g, design, w, d, i, floorHeight, mats); }
  if (design.building?.shape === "l-shape") g.add(box("L Shape Wing", w * 0.34, floorHeight, d * 0.82, mats.wall, -w * 0.55, floorHeight / 2, -d * 0.18));
  g.add(createUndergroundReveal(design, w, d, mats, options));
  const doorMat = design.exterior?.doorStyle === "black" ? material(0x020617) : design.exterior?.doorStyle === "glass" ? mats.glass : mats.timber;
  g.add(box("Entry Door", design.exterior?.doorStyle === "wide" ? 0.68 : 0.44, 0.78, 0.05, doorMat, -w * 0.34, 0.39, d / 2 + 0.035));
  if (design.building?.garage !== "none") { const gw = { single: 0.9, double: 1.3, triple: 1.7 }[design.building?.garage] || 1.3; g.add(box("Garage", gw, 0.72, 0.9, mats.garage, w / 2 + gw / 2 - 0.05, 0.36, d * 0.08)); }
  if (design.exterior?.hasBalcony && stories > 1) g.add(box("Glass Balcony", 1.45, 0.11, 0.34, mats.glass, -w * 0.18, floorHeight + 0.02, d / 2 + 0.25));
  g.add(createRoofMesh(design, w, d, stories * floorHeight + 0.04, mats));
  if (design.exterior?.hasSolar) { g.add(box("Solar Panel 1", 0.55, 0.035, 0.28, mats.solar, -0.38, stories * floorHeight + 0.58, 0.18)); g.add(box("Solar Panel 2", 0.55, 0.035, 0.28, mats.solar, 0.26, stories * floorHeight + 0.58, 0.18)); }
  g.position.set(-0.25, 0.04, 0.08); return g;
}
function createInteriorModel(design, mats) {
  const { houseWidth: w, houseDepth: d } = dims(design); const g = new THREE.Group();
  g.add(createLandElements({ ...design, land: { ...design.land, hasPool: false, hasGarden: false } }, mats));
  const house = new THREE.Group(); house.position.set(-0.25, 0.08, 0.08);
  [["Living Room",mats.zoneLiving,-w/4,d/4],["Kitchen",mats.zoneKitchen,w/4,d/4],["Bedroom",mats.zoneBedroom,-w/4,-d/4],["Bathroom",mats.zoneBath,w/4,-d/4]].forEach(([n,m,x,z]) => house.add(box(n, w/2-0.04, 0.06, d/2-0.04, m, x, 0.03, z)));
  house.add(box("Rear Wall", w, 0.72, 0.08, mats.wall, 0, 0.39, -d/2)); house.add(box("Left Wall", 0.08, 0.72, d, mats.wall, -w/2, 0.39, 0)); house.add(box("Right Wall", 0.08, 0.72, d, mats.wall, w/2, 0.39, 0));
  house.add(box("Centre Partition", w, 0.42, 0.04, mats.partition, 0, 0.24, 0)); house.add(box("Cross Partition", 0.04, 0.42, d, mats.partition, 0, 0.24, 0));
  house.add(box("Sofa", 0.75, 0.22, 0.32, mats.timber, -w*0.28, 0.17, d*0.28)); house.add(box("Kitchen Island", 0.72, 0.28, 0.3, mats.garage, w*0.25, 0.2, d*0.25)); house.add(box("Bed", 0.78, 0.2, 0.55, mats.timber, -w*0.25, 0.16, -d*0.25)); house.add(box("Bathroom Fixtures", 0.48, 0.25, 0.42, mats.glass, w*0.25, 0.18, -d*0.25));
  g.add(house); return g;
}
function createHouseModel(design, options = {}) {
  return createHousePrototypeModel(design, options);
}
function createHousePrototypeModel(design, options = {}) {
  const mats = createMaterials(design); const model = new THREE.Group(); model.name = "HomeForge AI 3D Prototype";
  if (options.viewMode === "interior") model.add(createInteriorModel(design, mats)); else { model.add(createLandElements(design, mats)); const house = createExteriorModel(design, mats, options); if (options.viewMode === "land") house.scale.setScalar(0.92); model.add(house); }
  model.position.y = options.hero ? 0.08 : -0.25; model.rotation.y = options.hero ? -0.45 : 0; if (options.hero) model.scale.setScalar(1); return model;
}
function disposeObject(object) { object.traverse((child) => { if (child.geometry) child.geometry.dispose(); if (child.material) Array.isArray(child.material) ? child.material.forEach((m) => m.dispose()) : child.material.dispose(); }); }
function setContextModel(context, model) { if (!context) return; if (context.model) { context.scene.remove(context.model); disposeObject(context.model); } context.model = model; context.scene.add(model); }
function applyCameraPreset(context, viewMode) { if (!context) return; const presets = { exterior: [[6.5,4.8,7.2],[0,0.8,0]], interior: [[4.4,3.2,4.8],[0,0.7,0]], land: [[5.8,6.8,7.8],[0,0,0]] }; const [pos, target] = presets[viewMode] || presets.exterior; context.camera.position.set(...pos); if (context.controls) { context.controls.target.set(...target); context.controls.update(); } }
function animateContext(context, options = {}) { function loop() { context.animationId = requestAnimationFrame(loop); if (options.autoRotate && context.model) context.model.rotation.y += 0.0035; context.controls?.update(); context.renderer.render(context.scene, context.camera); } loop(); }

export function initHeroWebGL() { const mount = document.getElementById("heroWebGL"); if (!mount || heroContext) return; try { heroContext = createThreeContext(mount, { controls: false, cameraPosition: [4.8, 3.25, 5.35], cameraTarget: [0, 0.85, 0] }); setContextModel(heroContext, createHousePrototypeModel(HERO_DESIGN, { hero: true, compact: true, viewMode: "exterior" })); animateContext(heroContext, { autoRotate: true }); } catch (error) { console.error("Hero WebGL failed to initialize:", error); } }
export function initWebGLPrototypeBuilder(houseDesign) { const mount = document.getElementById("prototypeWebGL"); if (!mount || prototypeContext) return; try { prototypeContext = createThreeContext(mount, { controls: true, cameraPosition: [6.5, 4.8, 7.2], cameraTarget: [0, 0.8, 0] }); document.getElementById("prototypeScene")?.classList.add("webgl-active"); updateWebGLPrototype(houseDesign, activeViewMode); animateContext(prototypeContext); } catch (error) { console.error("WebGL prototype failed to initialize:", error); } }
export function updateWebGLPrototype(houseDesign, viewMode = "exterior") { if (!prototypeContext) return; activeViewMode = viewMode; setContextModel(prototypeContext, createHousePrototypeModel(houseDesign, { viewMode })); applyCameraPreset(prototypeContext, viewMode); }
export function setPrototypeView(viewMode = "exterior") { activeViewMode = viewMode; applyCameraPreset(prototypeContext, viewMode); }
export async function exportPrototypeGLB() { if (!prototypeContext?.model) { alert("3D prototype is not ready yet."); return; } const exporter = new GLTFExporter(); const exported = await exporter.parseAsync(prototypeContext.model, { binary: true, trs: false, onlyVisible: true }); const blob = new Blob([exported], { type: "model/gltf-binary" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "homeforge-ai-3d-prototype.glb"; anchor.click(); URL.revokeObjectURL(url); }

export function focusWebGLPrototypeView(viewMode = "exterior") {
  setPrototypeView(viewMode);
}
