const STORAGE_KEY = 'homeforge-builder-v1';
const GRID = 20;
const materialColors = {
  concrete: '#e5e7eb',
  brick: '#b45309',
  timber: '#a16207',
  render: '#f8fafc',
};

const state = {
  activeTool: 'wall',
  walls: [],
  markers: [],
  pendingPoint: null,
  material: 'concrete',
  rate: 155,
  wallHeight: 2.7,
};

const planCanvas = document.querySelector('#planCanvas');
const wallsLayer = document.querySelector('#wallsLayer');
const pointsLayer = document.querySelector('#pointsLayer');
const model3d = document.querySelector('#model3d');
const materialSelect = document.querySelector('#materialSelect');
const wallHeight = document.querySelector('#wallHeight');
const wallHeightLabel = document.querySelector('#wallHeightLabel');
const activeToolLabel = document.querySelector('#activeToolLabel');
const saveStatus = document.querySelector('#saveStatus');

function snap(value) {
  return Math.round(value / GRID) * GRID;
}

function getSvgPoint(event) {
  const rect = planCanvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 720;
  const y = ((event.clientY - rect.top) / rect.height) * 520;
  return { x: snap(x), y: snap(y) };
}

function wallLength(wall) {
  return Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) / 20;
}

function renderPlan() {
  wallsLayer.innerHTML = '';
  pointsLayer.innerHTML = '';

  state.walls.forEach((wall) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', wall.x1);
    line.setAttribute('y1', wall.y1);
    line.setAttribute('x2', wall.x2);
    line.setAttribute('y2', wall.y2);
    line.setAttribute('class', 'wall-line');
    wallsLayer.append(line);
  });

  state.markers.forEach((marker) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', marker.x - 12);
    line.setAttribute('y1', marker.y);
    line.setAttribute('x2', marker.x + 12);
    line.setAttribute('y2', marker.y);
    line.setAttribute('class', `wall-line marker-${marker.type}`);
    wallsLayer.append(line);
  });

  if (state.pendingPoint) {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', state.pendingPoint.x);
    dot.setAttribute('cy', state.pendingPoint.y);
    dot.setAttribute('r', '7');
    dot.setAttribute('class', 'point-dot');
    pointsLayer.append(dot);
  }
}

function renderModel() {
  model3d.innerHTML = '';
  state.walls.forEach((wall) => {
    const length = Math.max(18, Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) * 0.36);
    const angle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1) * 180 / Math.PI;
    const element = document.createElement('span');
    element.className = 'generated-wall';
    element.style.width = `${length}px`;
    element.style.left = `${wall.x1 * 0.36 - 12}px`;
    element.style.top = `${wall.y1 * 0.34 - 28}px`;
    element.style.transform = `rotate(${angle}deg)`;
    element.style.setProperty('--wall-color', materialColors[state.material]);
    model3d.append(element);
  });
}

function renderMetrics() {
  const totalLength = state.walls.reduce((sum, wall) => sum + wallLength(wall), 0);
  const surface = totalLength * state.wallHeight;
  const cost = surface * state.rate;
  document.querySelector('#wallLength').textContent = `${totalLength.toFixed(1)} m`;
  document.querySelector('#wallSurface').textContent = `${surface.toFixed(1)} m²`;
  document.querySelector('#estimatedCost').textContent = `$${Math.round(cost).toLocaleString()}`;
}

function renderMaterial() {
  const option = materialSelect.selectedOptions[0];
  document.querySelector('#materialName').textContent = option.textContent.split(' — ')[0];
  document.querySelector('#materialDetails').textContent = `${option.textContent} applied to generated wall masses.`;
}

function renderAll() {
  renderPlan();
  renderModel();
  renderMetrics();
  renderMaterial();
}

function setStatus(message) {
  saveStatus.textContent = message;
}

planCanvas.addEventListener('click', (event) => {
  const point = getSvgPoint(event);

  if (state.activeTool === 'wall') {
    if (!state.pendingPoint) {
      state.pendingPoint = point;
    } else {
      state.walls.push({ ...state.pendingPoint, x2: point.x, y2: point.y });
      state.pendingPoint = null;
      setStatus('Unsaved changes');
    }
  }

  if (state.activeTool === 'door' || state.activeTool === 'window') {
    state.markers.push({ ...point, type: state.activeTool });
    setStatus('Unsaved changes');
  }

  renderAll();
});

document.querySelectorAll('.tool').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tool').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.activeTool = button.dataset.tool;
    state.pendingPoint = null;
    activeToolLabel.textContent = `Tool: ${button.textContent}`;
    renderAll();
  });
});

materialSelect.addEventListener('change', () => {
  state.material = materialSelect.value;
  state.rate = Number(materialSelect.selectedOptions[0].dataset.rate);
  setStatus('Unsaved changes');
  renderAll();
});

wallHeight.addEventListener('input', () => {
  state.wallHeight = Number(wallHeight.value);
  wallHeightLabel.textContent = `${state.wallHeight.toFixed(1)} m`;
  setStatus('Unsaved changes');
  renderAll();
});

document.querySelector('#clearPlan').addEventListener('click', () => {
  state.walls = [];
  state.markers = [];
  state.pendingPoint = null;
  setStatus('Unsaved changes');
  renderAll();
});

document.querySelector('#saveProject').addEventListener('click', () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  setStatus('Saved locally');
});

document.querySelector('#loadProject').addEventListener('click', () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    setStatus('No saved design');
    return;
  }
  Object.assign(state, JSON.parse(saved), { pendingPoint: null });
  materialSelect.value = state.material;
  wallHeight.value = state.wallHeight;
  wallHeightLabel.textContent = `${state.wallHeight.toFixed(1)} m`;
  setStatus('Loaded');
  renderAll();
});

document.querySelector('#exportProject').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'homeforge-design.json';
  link.click();
  URL.revokeObjectURL(url);
  setStatus('Exported JSON');
});

state.walls = [
  { x: 120, y: 120, x2: 560, y2: 120 },
  { x: 560, y: 120, x2: 560, y2: 400 },
  { x: 560, y: 400, x2: 120, y2: 400 },
  { x: 120, y: 400, x2: 120, y2: 120 },
  { x: 320, y: 120, x2: 320, y2: 400 },
  { x: 120, y: 260, x2: 560, y2: 260 },
];
state.markers = [
  { x: 220, y: 120, type: 'window' },
  { x: 320, y: 400, type: 'door' },
];
renderAll();
