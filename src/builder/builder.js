const GRID_SIZE = 20;
const PIXELS_PER_METER = 20;
const COST_PER_SQM = 1500;
const COST_PER_WALL_METER = 800;
const STORAGE_KEY = 'homeforge-advanced-builder-v1';

const INITIAL_WALLS = [
  { id: 'w1', x1: 200, y1: 200, x2: 600, y2: 200 },
  { id: 'w2', x1: 600, y1: 200, x2: 600, y2: 500 },
  { id: 'w3', x1: 600, y1: 500, x2: 200, y2: 500 },
  { id: 'w4', x1: 200, y1: 500, x2: 200, y2: 200 },
  { id: 'w5', x1: 400, y1: 200, x2: 400, y2: 500 },
  { id: 'w6', x1: 200, y1: 350, x2: 400, y2: 350 },
  { id: 'w7', x1: 400, y1: 300, x2: 600, y2: 300 },
  { id: 'w8', x1: 400, y1: 400, x2: 600, y2: 400 },
];

const INITIAL_ROOMS = [
  { id: 'r1', x: 200, y: 200, w: 200, h: 150, type: 'Living' },
  { id: 'r2', x: 200, y: 350, w: 200, h: 150, type: 'Kitchen' },
  { id: 'r3', x: 400, y: 200, w: 200, h: 100, type: 'Bedroom' },
  { id: 'r4', x: 400, y: 300, w: 200, h: 100, type: 'Bath' },
  { id: 'r5', x: 400, y: 400, w: 200, h: 100, type: 'Bedroom' },
];

const INITIAL_DOORS = [
  { id: 'd1', x: 300, y: 350, angle: 0 },
  { id: 'd2', x: 400, y: 250, angle: 90 },
  { id: 'd3', x: 400, y: 350, angle: 90 },
  { id: 'd4', x: 400, y: 450, angle: 90 },
  { id: 'd5', x: 200, y: 275, angle: 90 },
];

const INITIAL_WINDOWS = [
  { id: 'win1', x: 300, y: 200, angle: 0 },
  { id: 'win2', x: 500, y: 200, angle: 0 },
  { id: 'win3', x: 600, y: 250, angle: 90 },
  { id: 'win4', x: 600, y: 450, angle: 90 },
];

const materialColors = {
  render: '#f8fafc',
  brick: '#b45309',
  timber: '#a16207',
  concrete: '#94a3b8',
};

const roomColors = {
  Living: 'rgba(212, 212, 216, 0.24)',
  Kitchen: 'rgba(226, 232, 240, 0.26)',
  Bedroom: 'rgba(199, 210, 254, 0.28)',
  Bath: 'rgba(165, 243, 252, 0.28)',
  Office: 'rgba(253, 230, 138, 0.24)',
};

const state = {
  activeTool: 'Select',
  subTool: 'Living',
  material: 'render',
  isNight: false,
  showFeatures: true,
  isDrawing: false,
  currentWall: null,
  currentRoom: null,
  walls: structuredClone(INITIAL_WALLS),
  rooms: structuredClone(INITIAL_ROOMS),
  doors: structuredClone(INITIAL_DOORS),
  windows: structuredClone(INITIAL_WINDOWS),
  history: [],
};

const svg = document.querySelector('#planCanvas');
const roomsLayer = document.querySelector('#roomsLayer');
const wallsLayer = document.querySelector('#wallsLayer');
const featuresLayer = document.querySelector('#featuresLayer');
const draftLayer = document.querySelector('#draftLayer');
const model3d = document.querySelector('#model3d');
const viewport = document.querySelector('#threeLiteViewport');

function snap(value) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 999)}`;
}

function captureHistory() {
  state.history.push(JSON.stringify({
    walls: state.walls,
    rooms: state.rooms,
    doors: state.doors,
    windows: state.windows,
  }));
  if (state.history.length > 30) state.history.shift();
}

function getPoint(event) {
  const rect = svg.getBoundingClientRect();
  const x = snap(((event.clientX - rect.left) / rect.width) * 820);
  const y = snap(((event.clientY - rect.top) / rect.height) * 620);
  return { x, y };
}

function metersFromPixels(value) {
  return value / PIXELS_PER_METER;
}

function lineLength(wall) {
  return metersFromPixels(Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1));
}

function roomArea(room) {
  return metersFromPixels(room.w) * metersFromPixels(room.h);
}

function setStatus(text) {
  document.querySelector('#saveStatus').textContent = text;
}

function svgElement(type, attributes = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', type);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function renderRooms() {
  roomsLayer.innerHTML = '';
  state.rooms.forEach((room) => {
    roomsLayer.append(svgElement('rect', {
      x: room.x,
      y: room.y,
      width: room.w,
      height: room.h,
      class: 'room-fill',
      fill: roomColors[room.type] || roomColors.Living,
    }));
    const label = svgElement('text', {
      x: room.x + 12,
      y: room.y + 24,
      class: 'room-label',
    });
    label.textContent = `${room.type} · ${Math.round(roomArea(room))}m²`;
    roomsLayer.append(label);
  });
}

function renderWalls() {
  wallsLayer.innerHTML = '';
  state.walls.forEach((wall) => {
    wallsLayer.append(svgElement('line', {
      x1: wall.x1,
      y1: wall.y1,
      x2: wall.x2,
      y2: wall.y2,
      class: 'wall-line',
    }));
  });
}

function renderFeatures() {
  featuresLayer.innerHTML = '';
  state.doors.forEach((door) => {
    featuresLayer.append(svgElement('path', {
      d: `M ${door.x - 16} ${door.y} L ${door.x + 16} ${door.y} Q ${door.x + 16} ${door.y - 26} ${door.x - 8} ${door.y - 26}`,
      class: 'door-symbol',
      transform: `rotate(${door.angle} ${door.x} ${door.y})`,
    }));
  });
  state.windows.forEach((windowItem) => {
    featuresLayer.append(svgElement('line', {
      x1: windowItem.x - 18,
      y1: windowItem.y,
      x2: windowItem.x + 18,
      y2: windowItem.y,
      class: 'window-symbol',
      transform: `rotate(${windowItem.angle} ${windowItem.x} ${windowItem.y})`,
    }));
  });
}

function renderDraft() {
  draftLayer.innerHTML = '';
  if (state.currentWall) {
    draftLayer.append(svgElement('line', {
      x1: state.currentWall.x1,
      y1: state.currentWall.y1,
      x2: state.currentWall.x2,
      y2: state.currentWall.y2,
      class: 'draft-line',
    }));
  }
  if (state.currentRoom) {
    const room = normalizeRoom(state.currentRoom);
    draftLayer.append(svgElement('rect', {
      x: room.x,
      y: room.y,
      width: room.w,
      height: room.h,
      class: 'draft-room',
    }));
  }
}

function normalizeRoom(room) {
  return {
    ...room,
    x: room.w < 0 ? room.x + room.w : room.x,
    y: room.h < 0 ? room.y + room.h : room.y,
    w: Math.abs(room.w),
    h: Math.abs(room.h),
  };
}

function renderModel() {
  model3d.innerHTML = '';
  const scale = 0.46;
  const offsetX = 165;
  const offsetY = 140;
  state.rooms.forEach((room) => {
    const floor = document.createElement('span');
    floor.className = 'generated-floor';
    floor.style.left = `${room.x * scale - offsetX}px`;
    floor.style.top = `${room.y * scale - offsetY}px`;
    floor.style.width = `${room.w * scale}px`;
    floor.style.height = `${room.h * scale}px`;
    floor.style.setProperty('--floor-color', roomColors[room.type] || roomColors.Living);
    model3d.append(floor);
  });
  state.walls.forEach((wall) => {
    const length = Math.max(12, Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) * scale);
    const angle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1) * 180 / Math.PI;
    const element = document.createElement('span');
    element.className = 'generated-wall';
    element.style.width = `${length}px`;
    element.style.left = `${wall.x1 * scale - offsetX}px`;
    element.style.top = `${wall.y1 * scale - offsetY}px`;
    element.style.transform = `rotate(${angle}deg)`;
    element.style.setProperty('--wall-color', materialColors[state.material]);
    model3d.append(element);
  });
  state.doors.forEach((door) => appendFeature3d(door, 'generated-door', scale, offsetX, offsetY));
  state.windows.forEach((windowItem) => appendFeature3d(windowItem, 'generated-window', scale, offsetX, offsetY));
}

function appendFeature3d(feature, className, scale, offsetX, offsetY) {
  const element = document.createElement('span');
  element.className = className;
  element.style.left = `${feature.x * scale - offsetX}px`;
  element.style.top = `${feature.y * scale - offsetY}px`;
  element.style.transform = `rotate(${feature.angle}deg)`;
  model3d.append(element);
}

function renderMetrics() {
  const totalArea = state.rooms.reduce((sum, room) => sum + roomArea(room), 0);
  const totalWallLength = state.walls.reduce((sum, wall) => sum + lineLength(wall), 0);
  const estimate = totalArea * COST_PER_SQM + totalWallLength * COST_PER_WALL_METER;
  document.querySelector('#floorArea').textContent = `${Math.round(totalArea)} m²`;
  document.querySelector('#wallLength').textContent = `${totalWallLength.toFixed(1)} m`;
  document.querySelector('#estimatedCost').textContent = `$${Math.round(estimate).toLocaleString()}`;
  document.querySelector('#assetCount').textContent = `${state.rooms.length} rooms · ${state.walls.length} walls`;
}

function renderUi() {
  document.querySelector('#activeToolLabel').textContent = `Tool: ${state.activeTool}${state.activeTool === 'Room' ? ` / ${state.subTool}` : ''}`;
  document.querySelector('#toggleLighting').textContent = state.isNight ? '☾ Night' : '☀ Day';
  document.querySelector('#lightingLabel').textContent = state.isNight ? 'Night preview' : 'Day preview';
  document.querySelector('#featureStatus').textContent = state.showFeatures ? 'Features on' : 'Features hidden';
  document.querySelector('#featureList').classList.toggle('hidden', !state.showFeatures);
  viewport.classList.toggle('night', state.isNight);
}

function renderAll() {
  renderRooms();
  renderWalls();
  renderFeatures();
  renderDraft();
  renderModel();
  renderMetrics();
  renderUi();
}

svg.addEventListener('pointerdown', (event) => {
  const point = getPoint(event);
  if (state.activeTool === 'Wall') {
    if (!state.isDrawing) {
      state.isDrawing = true;
      state.currentWall = { x1: point.x, y1: point.y, x2: point.x, y2: point.y };
    } else if (state.currentWall && (state.currentWall.x1 !== point.x || state.currentWall.y1 !== point.y)) {
      captureHistory();
      state.walls.push({ ...state.currentWall, x2: point.x, y2: point.y, id: id('w') });
      state.currentWall = { x1: point.x, y1: point.y, x2: point.x, y2: point.y };
      setStatus('Unsaved changes');
    }
  }

  if (state.activeTool === 'Room') {
    state.isDrawing = true;
    state.currentRoom = { x: point.x, y: point.y, w: 0, h: 0, type: state.subTool };
  }

  if (state.activeTool === 'Door' || state.activeTool === 'Window') {
    captureHistory();
    const angle = event.shiftKey ? 90 : 0;
    if (state.activeTool === 'Door') state.doors.push({ id: id('d'), ...point, angle });
    if (state.activeTool === 'Window') state.windows.push({ id: id('win'), ...point, angle });
    setStatus('Unsaved changes');
  }

  renderAll();
});

svg.addEventListener('pointermove', (event) => {
  if (!state.isDrawing) return;
  const point = getPoint(event);
  if (state.activeTool === 'Wall' && state.currentWall) {
    state.currentWall.x2 = point.x;
    state.currentWall.y2 = point.y;
  }
  if (state.activeTool === 'Room' && state.currentRoom) {
    state.currentRoom.w = point.x - state.currentRoom.x;
    state.currentRoom.h = point.y - state.currentRoom.y;
  }
  renderDraft();
});

svg.addEventListener('pointerup', () => {
  if (state.activeTool !== 'Room' || !state.currentRoom) return;
  const room = normalizeRoom(state.currentRoom);
  state.isDrawing = false;
  state.currentRoom = null;
  if (room.w >= GRID_SIZE && room.h >= GRID_SIZE) {
    captureHistory();
    state.rooms.push({ ...room, id: id('r') });
    setStatus('Unsaved changes');
  }
  renderAll();
});

svg.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  state.isDrawing = false;
  state.currentWall = null;
  state.currentRoom = null;
  renderAll();
});

document.querySelectorAll('[data-tool]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-tool]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.activeTool = button.dataset.tool;
    state.isDrawing = false;
    state.currentWall = null;
    state.currentRoom = null;
    renderAll();
  });
});

document.querySelectorAll('[data-room]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-room]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.subTool = button.dataset.room;
    state.activeTool = 'Room';
    document.querySelectorAll('[data-tool]').forEach((item) => item.classList.toggle('active', item.dataset.tool === 'Room'));
    renderAll();
  });
});

document.querySelectorAll('[data-material]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-material]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.material = button.dataset.material;
    state.activeTool = 'Material';
    document.querySelectorAll('[data-tool]').forEach((item) => item.classList.toggle('active', item.dataset.tool === 'Material'));
    setStatus('Unsaved changes');
    renderAll();
  });
});

document.querySelector('#toggleLighting').addEventListener('click', () => {
  state.isNight = !state.isNight;
  renderAll();
});

document.querySelector('#toggleFeatures').addEventListener('click', () => {
  state.showFeatures = !state.showFeatures;
  renderAll();
});

document.querySelector('#undoAction').addEventListener('click', () => {
  const previous = state.history.pop();
  if (!previous) {
    setStatus('Nothing to undo');
    return;
  }
  Object.assign(state, JSON.parse(previous));
  setStatus('Undo applied');
  renderAll();
});

document.querySelector('#clearPlan').addEventListener('click', () => {
  captureHistory();
  state.walls = [];
  state.rooms = [];
  state.doors = [];
  state.windows = [];
  state.isDrawing = false;
  state.currentWall = null;
  state.currentRoom = null;
  setStatus('Plan cleared');
  renderAll();
});

document.querySelector('#saveProject').addEventListener('click', () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    walls: state.walls,
    rooms: state.rooms,
    doors: state.doors,
    windows: state.windows,
    material: state.material,
    isNight: state.isNight,
  }));
  setStatus('Saved locally');
});

document.querySelector('#loadProject').addEventListener('click', () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    setStatus('No saved project');
    return;
  }
  Object.assign(state, JSON.parse(saved), {
    isDrawing: false,
    currentWall: null,
    currentRoom: null,
  });
  document.querySelectorAll('[data-material]').forEach((item) => item.classList.toggle('active', item.dataset.material === state.material));
  setStatus('Loaded saved project');
  renderAll();
});

document.querySelector('#exportProject').addEventListener('click', () => {
  const payload = {
    app: 'HomeForge AI Advanced Builder',
    unitScale: '20px = 1m',
    exportedAt: new Date().toISOString(),
    walls: state.walls,
    rooms: state.rooms,
    doors: state.doors,
    windows: state.windows,
    material: state.material,
    metrics: {
      floorAreaSqm: Math.round(state.rooms.reduce((sum, room) => sum + roomArea(room), 0)),
      wallLengthM: Number(state.walls.reduce((sum, wall) => sum + lineLength(wall), 0).toFixed(1)),
    },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'homeforge-advanced-builder.json';
  link.click();
  URL.revokeObjectURL(url);
  setStatus('Exported JSON');
});

renderAll();
