import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

let heroContext = null;
let prototypeContext = null;

function createThreeContext(mount, options = {}) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    options.fov || 42,
    1,
    0.1,
    100
  );
  camera.position.set(
    options.cameraX ?? 6,
    options.cameraY ?? 4,
    options.cameraZ ?? 7
  );
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.innerHTML = "";
  mount.appendChild(renderer.domElement);
  const controls = options.controls
    ? new OrbitControls(camera, renderer.domElement)
    : null;
  if (controls) {
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.6, 0);
    controls.minDistance = 4;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.update();
  }
  const ambient = new THREE.HemisphereLight(0xffffff, 0x0f172a, 1.1);
  scene.add(ambient);
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.camera.left = -10;
  keyLight.shadow.camera.right = 10;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -10;
  scene.add(keyLight);
  const cyanLight = new THREE.PointLight(0x67e8f9, 2.2, 18);
  cyanLight.position.set(-4, 3, 4);
  scene.add(cyanLight);
  const goldLight = new THREE.PointLight(0xfde68a, 1.8, 18);
  goldLight.position.set(4, 3, -3);
  scene.add(goldLight);
  const resizeObserver = new ResizeObserver(() => {
    const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(mount);
  return {
    mount,
    scene,
    camera,
    renderer,
    controls,
    resizeObserver,
    model: null,
    animationId: null
  };
}
function createMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.45,
    metalness: options.metalness ?? 0.08,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1
  });
}
function createPhysicalMaterial(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: options.roughness ?? 0.35,
    metalness: options.metalness ?? 0.05,
    transmission: options.transmission ?? 0,
    thickness: options.thickness ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1
  });
}
function createBox(name, width, height, depth, material, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material
  );
  mesh.name = name;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function createCylinder(name, radiusTop, radiusBottom, height, material, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 48),
    material
  );
  mesh.name = name;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function createGableRoof(width, depth, height, material) {
  const w = width / 2;
  const d = depth / 2;
  const vertices = new Float32Array([
    -w, 0, d,
     w, 0, d,
     0, height, d,
    -w, 0, -d,
     w, 0, -d,
     0, height, -d
  ]);
  const indices = [
    0, 1, 2,
    5, 4, 3,
    0, 3, 4,
    0, 4, 1,
    0, 2, 5,
    0, 5, 3,
    2, 1, 4,
    2, 4, 5
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "Gable Roof";
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function createSkillionRoof(width, depth, height, material) {
  const w = width / 2;
  const d = depth / 2;
  const low = 0;
  const high = height;
  const vertices = new Float32Array([
    -w, low, d,
     w, high, d,
     w, high, -d,
    -w, low, -d,
    -w, -0.18, d,
     w, -0.18, d,
     w, -0.18, -d,
    -w, -0.18, -d
  ]);
  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 7, 6, 4, 6, 5,
    0, 4, 5, 0, 5, 1,
    1, 5, 6, 1, 6, 2,
    2, 6, 7, 2, 7, 3,
    3, 7, 4, 3, 4, 0
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "Skillion Roof";
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function createRoof(state, width, depth, roofY, material) {
  let roof;
  if (state.roofStyle === "flat") {
    roof = createBox("Flat Roof", width + 0.25, 0.22, depth + 0.25, material, 0, roofY + 0.1, 0);
  } else if (state.roofStyle === "hip") {
    roof = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(width, depth) * 0.75, 0.9, 4),
      material
    );
    roof.name = "Hip Roof";
    roof.position.set(0, roofY + 0.45, 0);
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = depth / width;
    roof.castShadow = true;
    roof.receiveShadow = true;
  } else if (state.roofStyle === "skillion") {
    roof = createSkillionRoof(width + 0.35, depth + 0.35, 0.75, material);
    roof.position.set(0, roofY + 0.05, 0);
  } else if (state.roofStyle === "mixed") {
    roof = new THREE.Group();
    roof.name = "Mixed Architectural Roof";
    const main = createGableRoof(width * 0.72, depth + 0.35, 0.85, material);
    main.position.set(-width * 0.15, roofY, 0);
    const side = createSkillionRoof(width * 0.45, depth * 0.72, 0.65, material);
    side.position.set(width * 0.25, roofY + 0.05, 0.05);
    roof.add(main, side);
  } else {
    roof = createGableRoof(width + 0.35, depth + 0.35, 0.9, material);
    roof.position.set(0, roofY, 0);
  }
  return roof;
}
function getHouseDimensions(state) {
  const shape = state.houseShape;
  const dimensions = {
    "modern-box": { width: 3.4, depth: 2.35 },
    "l-shape": { width: 4.2, depth: 2.6 },
    "wide-villa": { width: 5.0, depth: 2.45 },
    compact: { width: 2.6, depth: 2.15 },
    "luxury-wing": { width: 5.4, depth: 2.8 }
  };
  return dimensions[shape] || dimensions["modern-box"];
}
function getLandDimensions(state) {
  const areaScale = Math.sqrt((Number(state.landArea) || 600) / 600);
  let width = 8.2 * areaScale;
  let depth = 5.8 * areaScale;
  if (state.landShape === "wide") {
    width *= 1.22;
    depth *= 0.88;
  }
  if (state.landShape === "narrow") {
    width *= 0.78;
    depth *= 1.18;
  }
  if (state.landShape === "corner") {
    width *= 1.05;
    depth *= 1.02;
  }
  return { width, depth };
}
function addWindowsToFloor(group, state, width, depth, floorIndex, floorHeight, baseY) {
  const glassMaterial = createPhysicalMaterial(0x67e8f9, {
    roughness: 0.08,
    metalness: 0.05,
    transmission: 0.25,
    transparent: true,
    opacity: 0.82,
    emissive: 0x0284c7,
    emissiveIntensity: 0.35
  });
  const windowStyle = state.windowStyle;
  const size = {
    standard: { w: 0.48, h: 0.34 },
    wide: { w: 0.78, h: 0.38 },
    "full-glass": { w: 0.86, h: 0.72 },
    arched: { w: 0.55, h: 0.52 }
  }[windowStyle] || { w: 0.72, h: 0.38 };
  const y = baseY + floorHeight * 0.55;
  const zFront = depth / 2 + 0.025;
  const windowPositions = [
    [-width * 0.22, y, zFront],
    [width * 0.22, y, zFront]
  ];
  if (width > 3.6) {
    windowPositions.push([width * 0.42, y, zFront]);
  }
  windowPositions.forEach((position, index) => {
    const windowMesh = createBox(
      `Window ${floorIndex + 1}-${index + 1}`,
      size.w,
      size.h,
      0.04,
      glassMaterial,
      position[0],
      position[1],
      position[2]
    );
    group.add(windowMesh);
  });
  const sideWindow = createBox(
    `Side Window ${floorIndex + 1}`,
    0.04,
    size.h,
    size.w,
    glassMaterial,
    width / 2 + 0.025,
    y,
    -depth * 0.12
  );
  group.add(sideWindow);
}
function createHouseModel(state, options = {}) {
  const model = new THREE.Group();
  model.name = "HomeForge AI WebGL Prototype";
  const land = getLandDimensions(state);
  const house = getHouseDimensions(state);
  const landMaterial = createMaterial(0x0f2f2e, {
    roughness: 0.62,
    metalness: 0.05
  });
  const landMesh = createBox(
    "Land Block",
    land.width,
    0.28,
    land.depth,
    landMaterial,
    0,
    -0.14,
    0
  );
  landMesh.receiveShadow = true;
  model.add(landMesh);
  const gridHelper = new THREE.GridHelper(
    Math.max(land.width, land.depth),
    18,
    0x67e8f9,
    0x164e63
  );
  gridHelper.name = "Land Planning Grid";
  gridHelper.position.y = 0.015;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.22;
  model.add(gridHelper);
  const drivewayMaterial = createMaterial(0x94a3b8, {
    roughness: 0.58,
    metalness: 0.05
  });
  const driveway = createBox(
    "Driveway",
    1.35,
    0.045,
    land.depth * 0.58,
    drivewayMaterial,
    land.width * 0.3,
    0.05,
    land.depth * 0.13
  );
  model.add(driveway);
  if (state.includeGarden) {
    const gardenMaterial = createMaterial(0x22c55e, {
      roughness: 0.8,
      metalness: 0
    });
    const garden = createCylinder(
      "Garden Landscape",
      0.95,
      0.95,
      0.07,
      gardenMaterial,
      -land.width * 0.32,
      0.08,
      -land.depth * 0.25
    );
    garden.scale.z = 0.55;
    model.add(garden);
  }
  if (state.includePool) {
    const poolMaterial = createPhysicalMaterial(0x22d3ee, {
      roughness: 0.03,
      metalness: 0,
      transmission: 0.35,
      transparent: true,
      opacity: 0.82,
      emissive: 0x0891b2,
      emissiveIntensity: 0.25
    });
    const pool = createBox(
      "Swimming Pool",
      1.65,
      0.08,
      0.82,
      poolMaterial,
      land.width * 0.26,
      0.09,
      -land.depth * 0.31
    );
    model.add(pool);
  }
  const houseGroup = new THREE.Group();
  houseGroup.name = "Generated House";
  const houseMaterial = createMaterial(state.houseColor || "#e5e7eb", {
    roughness: 0.38,
    metalness: 0.08
  });
  const roofMaterial = createMaterial(state.roofColor || "#111827", {
    roughness: 0.28,
    metalness: 0.18
  });
  const trimMaterial = createMaterial(0xf8fafc, {
    roughness: 0.25,
    metalness: 0.05
  });
  const doorMaterial = createMaterial(
    state.doorStyle === "black"
      ? 0x020617
      : state.doorStyle === "glass"
        ? 0x38bdf8
        : 0x92400e,
    {
      roughness: 0.32,
      metalness: state.doorStyle === "black" ? 0.22 : 0.04,
      emissive: state.doorStyle === "glass" ? 0x0284c7 : 0x000000,
      emissiveIntensity: state.doorStyle === "glass" ? 0.18 : 0
    }
  );
  const floorHeight = options.compact ? 0.74 : 1.05;
  const stories = Math.max(1, Math.min(Number(state.stories) || 1, 4));
  const totalHeight = floorHeight * stories;
  for (let i = 0; i < stories; i += 1) {
    const floor = createBox(
      `Floor ${i + 1}`,
      house.width,
      floorHeight,
      house.depth,
      houseMaterial,
      0,
      floorHeight / 2 + i * floorHeight,
      0
    );
    houseGroup.add(floor);
    addWindowsToFloor(houseGroup, state, house.width, house.depth, i, floorHeight, i * floorHeight);
  }
  const doorWidth = state.doorStyle === "wide" ? 0.68 : 0.44;
  const door = createBox(
    "Entry Door",
    doorWidth,
    0.78,
    0.05,
    doorMaterial,
    -house.width * 0.34,
    0.39,
    house.depth / 2 + 0.035
  );
  houseGroup.add(door);
  if (state.garage !== "none") {
    const garageWidth = {
      single: 0.9,
      double: 1.25,
      triple: 1.65
    }[state.garage] || 1.25;
    const garage = createBox(
      `${state.garage} Garage`,
      garageWidth,
      0.72,
      0.9,
      trimMaterial,
      house.width / 2 + garageWidth / 2 - 0.05,
      0.36,
      house.depth * 0.08
    );
    houseGroup.add(garage);
  }
  if (state.basement > 0) {
    const basementMaterial = createMaterial(0x312e81, {
      roughness: 0.55,
      metalness: 0.08,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.18
    });
    const basementHeight = 0.42 * Number(state.basement);
    const basement = createBox(
      "Underground Floor",
      house.width * 0.86,
      basementHeight,
      house.depth * 0.82,
      basementMaterial,
      0,
      -basementHeight / 2,
      0
    );
    houseGroup.add(basement);
  }
  if (state.balcony && stories > 1) {
    const balconyMaterial = createPhysicalMaterial(0xffffff, {
      roughness: 0.08,
      metalness: 0,
      transmission: 0.35,
      transparent: true,
      opacity: 0.55
    });
    const balcony = createBox(
      "Glass Balcony",
      1.45,
      0.11,
      0.34,
      balconyMaterial,
      -house.width * 0.18,
      floorHeight + 0.02,
      house.depth / 2 + 0.25
    );
    houseGroup.add(balcony);
  }
  const roof = createRoof(state, house.width, house.depth, totalHeight + 0.04, roofMaterial);
  houseGroup.add(roof);
  if (state.solarPanels) {
    const solarMaterial = createMaterial(0x075985, {
      roughness: 0.18,
      metalness: 0.48,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.15
    });
    const solarOne = createBox(
      "Solar Panel 1",
      0.55,
      0.035,
      0.28,
      solarMaterial,
      -0.42,
      totalHeight + 0.58,
      0.18
    );
    const solarTwo = createBox(
      "Solar Panel 2",
      0.55,
      0.035,
      0.28,
      solarMaterial,
      0.22,
      totalHeight + 0.58,
      0.18
    );
    solarOne.rotation.x = -0.22;
    solarTwo.rotation.x = -0.22;
    houseGroup.add(solarOne, solarTwo);
  }
  if (state.houseShape === "l-shape") {
    const wing = createBox(
      "L Shape Wing",
      house.width * 0.34,
      floorHeight,
      house.depth * 0.82,
      houseMaterial,
      -house.width * 0.55,
      floorHeight / 2,
      -house.depth * 0.18
    );
    houseGroup.add(wing);
  }
  if (state.outdoorArea) {
    const deckMaterial = createMaterial(0x78350f, {
      roughness: 0.5,
      metalness: 0.05
    });
    const deck = createBox(
      "Outdoor Entertainment Deck",
      1.75,
      0.06,
      0.95,
      deckMaterial,
      -land.width * 0.2,
      0.08,
      land.depth * 0.23
    );
    model.add(deck);
  }
  houseGroup.position.set(-0.25, 0.04, 0.08);
  model.add(houseGroup);
  if (state.smartHome) {
    const smartMaterial = createMaterial(0x67e8f9, {
      roughness: 0.15,
      metalness: 0.3,
      emissive: 0x0891b2,
      emissiveIntensity: 0.7
    });
    const beacon = createCylinder(
      "Smart Home Hub",
      0.08,
      0.08,
      0.16,
      smartMaterial,
      -land.width * 0.42,
      0.22,
      land.depth * 0.34
    );
    model.add(beacon);
  }
  model.rotation.y = options.hero ? -0.45 : 0;
  model.position.y = options.hero ? -0.1 : -0.25;
  return model;
}
function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}
function setContextModel(context, model) {
  if (!context) return;
  if (context.model) {
    context.scene.remove(context.model);
    disposeObject(context.model);
  }
  context.model = model;
  context.scene.add(model);
}
function animateContext(context, options = {}) {
  function loop() {
    context.animationId = requestAnimationFrame(loop);
    if (options.autoRotate && context.model) {
      context.model.rotation.y += 0.004;
    }
    if (context.controls) {
      context.controls.update();
    }
    context.renderer.render(context.scene, context.camera);
  }
  loop();
}
export function initHeroWebGL() {
  const mount = document.getElementById("heroWebGL");
  if (!mount || heroContext) return;
  heroContext = createThreeContext(mount, {
    controls: false,
    fov: 38,
    cameraX: 5.8,
    cameraY: 4.4,
    cameraZ: 6.8
  });
  const heroState = {
    landArea: 600,
    landShape: "rectangular",
    stories: 2,
    basement: 0,
    houseShape: "modern-box",
    garage: "double",
    roofStyle: "gable",
    houseColor: "#e5e7eb",
    roofColor: "#111827",
    windowStyle: "wide",
    doorStyle: "timber",
    includeGarden: true,
    includePool: true,
    solarPanels: true,
    balcony: true,
    outdoorArea: true,
    smartHome: false
  };
  setContextModel(heroContext, createHouseModel(heroState, { hero: true, compact: true }));
  animateContext(heroContext, { autoRotate: true });
}
export function initWebGLPrototypeBuilder(state) {
  const mount = document.getElementById("prototypeWebGL");
  if (!mount || prototypeContext) return;
  const sceneElement = document.getElementById("prototypeScene");
  prototypeContext = createThreeContext(mount, {
    controls: true,
    fov: 42,
    cameraX: 6.8,
    cameraY: 5.2,
    cameraZ: 7.4
  });
  sceneElement?.classList.add("webgl-active");
  focusWebGLPrototypeView("exterior");
  updateWebGLPrototype(state);
  animateContext(prototypeContext);
}
export function updateWebGLPrototype(state) {
  if (!prototypeContext) return;
  const nextModel = createHouseModel(state);
  setContextModel(prototypeContext, nextModel);
}
export function focusWebGLPrototypeView(view = "exterior") {
  if (!prototypeContext) return;
  const presets = {
    exterior: { position: [6.8, 5.2, 7.4], target: [0, 0.75, 0] },
    interior: { position: [3.2, 2.4, 4.2], target: [0, 1.0, 0] },
    land: { position: [0, 8.8, 8.4], target: [0, 0, 0] }
  };
  const preset = presets[view] || presets.exterior;
  prototypeContext.camera.position.set(...preset.position);
  if (prototypeContext.controls) {
    prototypeContext.controls.target.set(...preset.target);
    prototypeContext.controls.update();
  }
}
export async function exportPrototypeGLB() {
  if (!prototypeContext?.model) {
    alert("3D prototype is not ready yet.");
    return;
  }
  const exporter = new GLTFExporter();
  const exported = await exporter.parseAsync(prototypeContext.model, {
    binary: true,
    trs: false,
    onlyVisible: true
  });
  const blob = new Blob([exported], {
    type: "model/gltf-binary"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "homeforge-ai-3d-prototype.glb";
  anchor.click();
  URL.revokeObjectURL(url);
}
