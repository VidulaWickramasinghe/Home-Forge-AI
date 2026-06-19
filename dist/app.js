const state = {
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
  smartHome: false,
  bedrooms: 4,
  bathrooms: 3,
  furnishing: "modern"
};
const controls = {
  landArea: document.getElementById("landArea"),
  landShape: document.getElementById("landShape"),
  stories: document.getElementById("stories"),
  basement: document.getElementById("basement"),
  houseShape: document.getElementById("houseShape"),
  garage: document.getElementById("garage"),
  roofStyle: document.getElementById("roofStyle"),
  houseColor: document.getElementById("houseColor"),
  roofColor: document.getElementById("roofColor"),
  windowStyle: document.getElementById("windowStyle"),
  doorStyle: document.getElementById("doorStyle"),
  includeGarden: document.getElementById("includeGarden"),
  includePool: document.getElementById("includePool"),
  solarPanels: document.getElementById("solarPanels"),
  balcony: document.getElementById("balcony"),
  outdoorArea: document.getElementById("outdoorArea"),
  smartHome: document.getElementById("smartHome"),
  bedrooms: document.getElementById("bedrooms"),
  bathrooms: document.getElementById("bathrooms"),
  furnishing: document.getElementById("furnishing")
};
const output = {
  storiesValue: document.getElementById("storiesValue"),
  basementValue: document.getElementById("basementValue"),
  bedroomsValue: document.getElementById("bedroomsValue"),
  bathroomsValue: document.getElementById("bathroomsValue"),
  prototypeLabel: document.getElementById("prototypeLabel"),
  totalAreaOut: document.getElementById("totalAreaOut"),
  roomsOut: document.getElementById("roomsOut"),
  garageOut: document.getElementById("garageOut"),
  costOut: document.getElementById("costOut"),
  summaryCost: document.getElementById("summaryCost"),
  summaryList: document.getElementById("summaryList"),
  briefOutput: document.getElementById("briefOutput"),
  statLand: document.getElementById("statLand"),
  statStories: document.getElementById("statStories"),
  statCost: document.getElementById("statCost")
};
const model = {
  landModel: document.getElementById("landModel"),
  houseModel: document.getElementById("houseModel"),
  roofModel: document.getElementById("roofModel"),
  upperFloor: document.getElementById("upperFloor"),
  basementModel: document.getElementById("basementModel"),
  garageModel: document.getElementById("garageModel"),
  gardenModel: document.getElementById("gardenModel"),
  poolModel: document.getElementById("poolModel"),
  solarOne: document.getElementById("solarOne"),
  solarTwo: document.getElementById("solarTwo"),
  balconyModel: document.getElementById("balconyModel"),
  outdoorModel: document.getElementById("outdoorModel"),
  doorModel: document.getElementById("doorModel"),
  prototypeScene: document.getElementById("prototypeScene")
};
const formatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0
});
function titleCase(value) {
  return String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function garageLabel(value) {
  const labels = {
    none: "No garage",
    single: "Single",
    double: "Double",
    triple: "Triple"
  };
  return labels[value] || "Double";
}
function calculateArea() {
  const baseArea = 82 + state.bedrooms * 24 + state.bathrooms * 11;
  const storyMultiplier = state.stories;
  const basementArea = state.basement * 55;
  const garageArea = {
    none: 0,
    single: 22,
    double: 40,
    triple: 60
  }[state.garage];
  const shapeAdjustment = {
    "modern-box": 1,
    "l-shape": 1.08,
    "wide-villa": 1.15,
    compact: 0.88,
    "luxury-wing": 1.28
  }[state.houseShape];
  return Math.round((baseArea * storyMultiplier + basementArea + garageArea) * shapeAdjustment);
}
function calculateCost() {
  const area = calculateArea();
  const baseRate = {
    minimal: 1450,
    modern: 1700,
    warm: 1620,
    premium: 2300
  }[state.furnishing];
  const roofExtra = {
    flat: 8000,
    gable: 12000,
    hip: 16500,
    skillion: 18500,
    mixed: 28000
  }[state.roofStyle];
  const garageExtra = {
    none: 0,
    single: 26000,
    double: 44000,
    triple: 62000
  }[state.garage];
  const featureExtras =
    (state.includePool ? 42000 : 0) +
    (state.solarPanels ? 14000 : 0) +
    (state.balcony ? 18000 : 0) +
    (state.outdoorArea ? 22000 : 0) +
    (state.smartHome ? 12000 : 0) +
    state.basement * 65000;
  const landPrep = Math.round(state.landArea * 32);
  return Math.round(area * baseRate + roofExtra + garageExtra + featureExtras + landPrep);
}
function applyHouseShape() {
  model.houseModel.className = "house-model";
  model.houseModel.classList.add(`shape-${state.houseShape}`);
}
function applyRoofStyle() {
  model.roofModel.className = "roof-model";
  model.roofModel.classList.add(`roof-${state.roofStyle}`);
}
function applyLandShape() {
  model.landModel.className = "land-model";
  model.landModel.classList.add(`land-${state.landShape}`);
}
function applyWindowStyle() {
  model.houseModel.dataset.windowStyle = state.windowStyle;
}
function applyDoorStyle() {
  model.doorModel.className = "door-model";
  model.doorModel.classList.add(`door-${state.doorStyle}`);
}
function applyStories() {
  model.houseModel.dataset.stories = String(state.stories);
  if (state.stories <= 1) {
    model.upperFloor.style.display = "none";
  } else {
    model.upperFloor.style.display = "block";
  }
  const extraHeight = Math.max(0, state.stories - 2) * 34;
  model.houseModel.style.setProperty("--extra-height", `${extraHeight}px`);
}
function applyBasement() {
  if (state.basement === 0) {
    model.basementModel.style.display = "none";
  } else {
    model.basementModel.style.display = "grid";
    model.basementModel.textContent =
      state.basement === 1 ? "1 Underground Level" : "2 Underground Levels";
  }
}
function applyGarage() {
  if (state.garage === "none") {
    model.garageModel.style.display = "none";
  } else {
    model.garageModel.style.display = "grid";
    model.garageModel.textContent = garageLabel(state.garage);
    model.garageModel.dataset.size = state.garage;
  }
}
function applyFeatures() {
  model.gardenModel.style.display = state.includeGarden ? "block" : "none";
  model.poolModel.style.display = state.includePool ? "block" : "none";
  model.solarOne.style.display = state.solarPanels ? "block" : "none";
  model.solarTwo.style.display = state.solarPanels ? "block" : "none";
  model.balconyModel.style.display = state.balcony ? "block" : "none";
  model.outdoorModel.style.display = state.outdoorArea ? "grid" : "none";
}
function updateSummary() {
  const area = calculateArea();
  const cost = calculateCost();
  const summaryRows = [
    ["Land area", `${state.landArea} m²`],
    ["Land shape", titleCase(state.landShape)],
    ["House stories", `${state.stories}`],
    ["Underground floors", `${state.basement}`],
    ["House shape", titleCase(state.houseShape)],
    ["Roof style", titleCase(state.roofStyle)],
    ["Garage", garageLabel(state.garage)],
    ["Rooms", `${state.bedrooms} bedrooms / ${state.bathrooms} bathrooms`],
    ["Interior", titleCase(state.furnishing)],
    ["Modern features", getFeatureText()]
  ];
  output.summaryList.innerHTML = summaryRows
    .map(
      ([label, value]) => `
        <div class="summary-row">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `
    )
    .join("");
  output.totalAreaOut.textContent = `${area} m²`;
  output.roomsOut.textContent = `${state.bedrooms} Bed / ${state.bathrooms} Bath`;
  output.garageOut.textContent = garageLabel(state.garage);
  output.costOut.textContent = formatter.format(cost);
  output.summaryCost.textContent = formatter.format(cost);
  output.statLand.textContent = `${state.landArea} m²`;
  output.statStories.textContent = String(state.stories);
  output.statCost.textContent = compactCurrency(cost);
  output.prototypeLabel.textContent = `${titleCase(state.houseShape)} ${state.stories}-storey ${state.bedrooms} bedroom house`;
  output.storiesValue.textContent = `${state.stories} ${state.stories === 1 ? "story" : "stories"}`;
  output.basementValue.textContent = `${state.basement} underground`;
  output.bedroomsValue.textContent = `${state.bedrooms} bedrooms`;
  output.bathroomsValue.textContent = `${state.bathrooms} bathrooms`;
  updateBrief();
}
function compactCurrency(value) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}m`;
  }
  return `$${Math.round(value / 1000)}k`;
}
function getFeatureText() {
  const features = [];
  if (state.includeGarden) features.push("garden");
  if (state.includePool) features.push("pool");
  if (state.solarPanels) features.push("solar");
  if (state.balcony) features.push("balcony");
  if (state.outdoorArea) features.push("outdoor area");
  if (state.smartHome) features.push("smart home");
  return features.length ? features.join(", ") : "basic";
}
function updateBrief() {
  const cost = calculateCost();
  const area = calculateArea();
  output.briefOutput.textContent = `HOMEFORGE AI — DREAM HOUSE PROTOTYPE BRIEF
Project Purpose:
Create a practical 3D concept prototype of a future dream house before preparing professional construction plans.
Prototype Summary:
- Land Area: ${state.landArea} m²
- Land Shape: ${titleCase(state.landShape)}
- House Shape: ${titleCase(state.houseShape)}
- Stories: ${state.stories}
- Underground Floors: ${state.basement}
- Bedrooms: ${state.bedrooms}
- Bathrooms: ${state.bathrooms}
- Garage: ${garageLabel(state.garage)}
- Roof Style: ${titleCase(state.roofStyle)}
- Window Style: ${titleCase(state.windowStyle)}
- Door Style: ${titleCase(state.doorStyle)}
- Furnishing Style: ${titleCase(state.furnishing)}
- Modern Features: ${getFeatureText()}
- Estimated Prototype Area: ${area} m²
- Estimated Cost Direction: ${formatter.format(cost)}
Contractor Instruction:
This prototype is intended to communicate the homeowner's preferred design direction.
Please convert this concept into a professional house plan, structural review, detailed material specification, compliance check and accurate construction quote.
Important:
This is a concept prototype only. Final construction must be reviewed and approved by qualified builders, architects, engineers and local authorities.`;
}
function render() {
  document.documentElement.style.setProperty("--house-color", state.houseColor);
  document.documentElement.style.setProperty("--roof-color", state.roofColor);
  applyLandShape();
  applyHouseShape();
  applyRoofStyle();
  applyWindowStyle();
  applyDoorStyle();
  applyStories();
  applyBasement();
  applyGarage();
  applyFeatures();
  updateSummary();
}
function syncStateFromControls() {
  state.landArea = Number(controls.landArea.value);
  state.landShape = controls.landShape.value;
  state.stories = Number(controls.stories.value);
  state.basement = Number(controls.basement.value);
  state.houseShape = controls.houseShape.value;
  state.garage = controls.garage.value;
  state.roofStyle = controls.roofStyle.value;
  state.houseColor = controls.houseColor.value;
  state.roofColor = controls.roofColor.value;
  state.windowStyle = controls.windowStyle.value;
  state.doorStyle = controls.doorStyle.value;
  state.includeGarden = controls.includeGarden.checked;
  state.includePool = controls.includePool.checked;
  state.solarPanels = controls.solarPanels.checked;
  state.balcony = controls.balcony.checked;
  state.outdoorArea = controls.outdoorArea.checked;
  state.smartHome = controls.smartHome.checked;
  state.bedrooms = Number(controls.bedrooms.value);
  state.bathrooms = Number(controls.bathrooms.value);
  state.furnishing = controls.furnishing.value;
  render();
}
function syncControlsFromState() {
  controls.landArea.value = String(state.landArea);
  controls.landShape.value = state.landShape;
  controls.stories.value = String(state.stories);
  controls.basement.value = String(state.basement);
  controls.houseShape.value = state.houseShape;
  controls.garage.value = state.garage;
  controls.roofStyle.value = state.roofStyle;
  controls.houseColor.value = state.houseColor;
  controls.roofColor.value = state.roofColor;
  controls.windowStyle.value = state.windowStyle;
  controls.doorStyle.value = state.doorStyle;
  controls.includeGarden.checked = state.includeGarden;
  controls.includePool.checked = state.includePool;
  controls.solarPanels.checked = state.solarPanels;
  controls.balcony.checked = state.balcony;
  controls.outdoorArea.checked = state.outdoorArea;
  controls.smartHome.checked = state.smartHome;
  controls.bedrooms.value = String(state.bedrooms);
  controls.bathrooms.value = String(state.bathrooms);
  controls.furnishing.value = state.furnishing;
  render();
}
function saveDesign() {
  localStorage.setItem("homeforge-design", JSON.stringify(state));
  showTemporaryMessage("Design saved in browser.");
}
function loadSavedDesign() {
  const saved = localStorage.getItem("homeforge-design");
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
    syncControlsFromState();
  } catch {
    localStorage.removeItem("homeforge-design");
  }
}
function resetDesign() {
  Object.assign(state, {
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
    smartHome: false,
    bedrooms: 4,
    bathrooms: 3,
    furnishing: "modern"
  });
  syncControlsFromState();
}
function exportDesign() {
  const payload = {
    projectName: "HomeForge AI Dream House Prototype",
    createdAt: new Date().toISOString(),
    design: state,
    measurements: {
      estimatedAreaM2: calculateArea(),
      estimatedCostAUD: calculateCost()
    },
    contractorBrief: output.briefOutput.textContent
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "homeforge-ai-dream-house-prototype.json";
  anchor.click();
  URL.revokeObjectURL(url);
}
function copyBrief() {
  navigator.clipboard
    .writeText(output.briefOutput.textContent)
    .then(() => showTemporaryMessage("Contractor brief copied."))
    .catch(() => showTemporaryMessage("Copy failed. Please copy manually."));
}
function showTemporaryMessage(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => {
    toast.remove();
  }, 2400);
}
function handleViewTabs() {
  const buttons = document.querySelectorAll("[data-view]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const view = button.getAttribute("data-view");
      model.prototypeScene.dataset.view = view || "exterior";
    });
  });
}
function setupPhotoUpload() {
  const input = document.getElementById("photoUpload");
  const preview = document.getElementById("photoPreview");
  input.addEventListener("change", () => {
    preview.innerHTML = "";
    Array.from(input.files || [])
      .slice(0, 6)
      .forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = file.name;
        img.onload = () => URL.revokeObjectURL(imageUrl);
        preview.appendChild(img);
      });
  });
}
function generateAiPrototype() {
  const promptInput = document.getElementById("ideaPrompt");
  const aiOutput = document.getElementById("aiOutput");
  const prompt = promptInput.value.toLowerCase();
  if (!prompt.trim()) {
    aiOutput.innerHTML = `
      <p>Please describe the dream house idea first.</p>
    `;
    return;
  }
  if (prompt.includes("300")) state.landArea = 300;
  if (prompt.includes("450")) state.landArea = 450;
  if (prompt.includes("600")) state.landArea = 600;
  if (prompt.includes("800")) state.landArea = 800;
  if (prompt.includes("1000")) state.landArea = 1000;
  if (prompt.includes("one storey") || prompt.includes("single storey")) state.stories = 1;
  if (prompt.includes("two storey") || prompt.includes("2 storey")) state.stories = 2;
  if (prompt.includes("three storey") || prompt.includes("3 storey")) state.stories = 3;
  if (prompt.includes("basement") || prompt.includes("underground")) state.basement = 1;
  if (prompt.includes("double garage")) state.garage = "double";
  if (prompt.includes("single garage")) state.garage = "single";
  if (prompt.includes("triple garage")) state.garage = "triple";
  if (prompt.includes("pool")) state.includePool = true;
  if (prompt.includes("garden")) state.includeGarden = true;
  if (prompt.includes("solar")) state.solarPanels = true;
  if (prompt.includes("balcony")) state.balcony = true;
  if (prompt.includes("smart")) state.smartHome = true;
  if (prompt.includes("outdoor")) state.outdoorArea = true;
  if (prompt.includes("minimal")) state.furnishing = "minimal";
  if (prompt.includes("modern")) {
    state.furnishing = "modern";
    state.houseShape = "modern-box";
    state.roofStyle = "flat";
  }
  if (prompt.includes("luxury") || prompt.includes("premium")) {
    state.furnishing = "premium";
    state.houseShape = "luxury-wing";
    state.roofStyle = "mixed";
  }
  if (prompt.includes("villa")) state.houseShape = "wide-villa";
  if (prompt.includes("l shape") || prompt.includes("l-shape")) state.houseShape = "l-shape";
  const bedroomMatch = prompt.match(/(\d+)\s*(bed|bedroom|bedrooms)/);
  if (bedroomMatch) {
    state.bedrooms = Math.min(7, Math.max(1, Number(bedroomMatch[1])));
  }
  const bathroomMatch = prompt.match(/(\d+)\s*(bath|bathroom|bathrooms)/);
  if (bathroomMatch) {
    state.bathrooms = Math.min(5, Math.max(1, Number(bathroomMatch[1])));
  }
  syncControlsFromState();
  aiOutput.innerHTML = `
    <ul class="ai-list">
      <li><strong>Generated concept:</strong> ${titleCase(state.houseShape)} with ${state.stories} storey/stories.</li>
      <li><strong>Land:</strong> ${state.landArea} m² ${titleCase(state.landShape)} block.</li>
      <li><strong>Rooms:</strong> ${state.bedrooms} bedrooms and ${state.bathrooms} bathrooms.</li>
      <li><strong>Garage:</strong> ${garageLabel(state.garage)} garage.</li>
      <li><strong>Modern features:</strong> ${getFeatureText()}.</li>
      <li><strong>Estimated direction:</strong> ${formatter.format(calculateCost())}.</li>
      <li><strong>Next step:</strong> Show this prototype to a contractor or house plan designer for a professional plan.</li>
    </ul>
  `;
  showTemporaryMessage("AI prototype direction generated.");
}
function setupEventListeners() {
  Object.values(controls).forEach((control) => {
    control.addEventListener("input", syncStateFromControls);
    control.addEventListener("change", syncStateFromControls);
  });
  document.getElementById("saveDesignBtn").addEventListener("click", saveDesign);
  document.getElementById("resetDesignBtn").addEventListener("click", resetDesign);
  document.getElementById("exportDesignBtn").addEventListener("click", exportDesign);
  document.getElementById("copyBriefBtn").addEventListener("click", copyBrief);
  document.getElementById("generateAiBtn").addEventListener("click", generateAiPrototype);
  handleViewTabs();
  setupPhotoUpload();
}
loadSavedDesign();
setupEventListeners();
syncControlsFromState();
