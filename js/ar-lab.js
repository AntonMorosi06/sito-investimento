/* MicroBot AR Interaction Lab — stable advanced module
   Includes Demo, X-Ray, 3D Labels, Click-to-Select, Field View, Assembly Sequence,
   Presentation Mode, Performance Toggle and local browser hand tracking. */

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs";

const $ = (id) => document.getElementById(id);
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;

const video = $("arVideo");
const canvas = $("arCanvas");
const startBtn = $("arStartBtn");
const stopBtn = $("arStopBtn");
const resetBtn = $("arResetBtn");
const instructions = $("arInstructions");
const viewport = document.querySelector(".arlab-viewport");
const sidebar = document.querySelector(".arlab-sidebar");

if (!video || !canvas) throw new Error("AR Lab elements not found");

const baseUI = {
  mode: $("arModeChip"),
  hands: $("arHandsChip"),
  fps: $("arFpsChip"),
  camera: $("arCameraStatus"),
  tracking: $("arTrackingStatus"),
  gesture: $("arGestureStatus"),
  modeText: $("arModeStatus"),
};

const partInfo = {
  shell: ["Outer Shell", "Protective body", "Digital concept", "Transparent reinforced shell. X-Ray Mode turns it into a ghost layer to expose the internal stack."],
  dome: ["Upper Dome", "Top cap / orientation layer", "Digital concept", "Upper cap with orientation and sensor-window details."],
  bottomCap: ["Bottom Cap", "Base plate", "Digital concept", "Lower mechanical closure and contact interface."],
  coilPrimary: ["Primary Coil", "Main electromagnetic actuator", "Simulation target", "Multi-turn coil used to visualize docking and magnetic actuation concepts. Real force still requires physical validation."],
  coilSecondary: ["Secondary Coil", "Auxiliary winding", "Simulation target", "Secondary winding layer for multi-state field visualization."],
  magnetCore: ["Magnet Core", "Permanent magnetic reference", "Simulation target", "Central polarity reference for alignment and docking logic."],
  poleNorth: ["North Pole", "Polarity marker", "Educational marker", "North-pole visual marker."],
  poleSouth: ["South Pole", "Polarity marker", "Educational marker", "South-pole visual marker."],
  pcb: ["Main PCB", "Embedded electronics carrier", "Planned hardware", "Board layer with traces, pads and routing marks for MCU, drivers, sensors and telemetry."],
  chip: ["ESP32 Control Core", "Embedded processing", "Firmware-ready target", "ESP32-style controller package for commands, telemetry, safety state and node behavior."],
  antenna: ["Wireless Antenna", "Communication interface", "Planned network layer", "Wireless interface for future low-latency node communication."],
  battery: ["LiPo Battery", "Energy source", "Design target", "Local energy block with terminal markers. Real hardware needs protection and thermal safety."],
  ledStatus: ["RGB Status LED", "Visible feedback", "Prototype-friendly", "Emissive node-state indicator."],
  sensorArray: ["Sensor Array", "Perception inputs", "Planned sensing layer", "Multi-lens perception block for future local sensing."],
  gears: ["Micro Gear Mechanism", "Mechanical concept", "Concept visual", "Mechanical detail for possible actuation or internal transmission layers."],
};

const partOrder = Object.keys(partInfo);
const labelNames = {
  shell: "SHELL",
  dome: "DOME",
  bottomCap: "BASE",
  coilPrimary: "PRIMARY COIL",
  coilSecondary: "SECONDARY COIL",
  magnetCore: "MAGNET",
  poleNorth: "N",
  poleSouth: "S",
  pcb: "PCB",
  chip: "ESP32",
  antenna: "ANTENNA",
  battery: "LiPo",
  ledStatus: "RGB LED",
  sensorArray: "SENSORS",
  gears: "GEARS",
};

let renderer;
let scene;
let camera3d;
let clock;
let handLandmarker;
let mediaStream;
let animationId = null;
let running = false;
let demoMode = false;
let xrayMode = false;
let labelsMode = false;
let fieldMode = false;
let assemblyMode = false;
let presentationMode = false;
let performanceMode = false;
let explode = 0;
let targetExplode = 0;
let selectedIndex = -1;
let lastFrame = performance.now();
let assemblyStart = 0;
let presentationStart = 0;
let currentGesture = "IDLE";

const parts = [];
const labelSprites = [];
const hands = { left: null, right: null, count: 0 };
const pinch = { left: false, right: false };
const PINCH_ON = 0.065;
const PINCH_OFF = 0.095;
let particles = null;
let rings = [];
let wire = null;
let fieldGroup = null;
let grid = null;
let raycaster = null;
let pointer = null;
let ui = {};

function text(el, value) {
  if (el) el.textContent = value;
}

function injectStyles() {
  if ($("arLabStableStyles")) return;
  const style = document.createElement("style");
  style.id = "arLabStableStyles";
  style.textContent = `
    .arlab-tool-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem;margin-top:.8rem}
    .arlab-tool-row button{padding:.58rem .68rem;font-size:.54rem}
    .arlab-tool-row .active{background:var(--accent-secondary)!important;color:#050508!important;border-color:var(--accent-secondary)!important;box-shadow:0 0 26px rgba(0,255,136,.22)}
    .arlab-btn-demo,.arlab-btn-xray,.arlab-btn-labels,.arlab-btn-field,.arlab-btn-assembly,.arlab-btn-presentation,.arlab-btn-quality{border-color:rgba(0,255,136,.32)!important;color:var(--accent-secondary)!important}
    .arlab-upgrade-status{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem}
    .arlab-upgrade-stat{border:1px solid var(--border-subtle);background:rgba(0,0,0,.28);padding:.8rem;min-height:68px}
    .arlab-upgrade-stat span{display:block;font-family:"JetBrains Mono",monospace;font-size:.52rem;color:var(--accent-mid);letter-spacing:1px;text-transform:uppercase;margin-bottom:.28rem}
    .arlab-upgrade-stat strong{font-family:"Orbitron",sans-serif;font-size:.8rem;color:var(--accent-white);line-height:1.35;word-break:break-word}
    .arlab-gesture-hud{position:absolute;left:1rem;right:1rem;bottom:1rem;z-index:8;display:grid;grid-template-columns:1fr 1.6fr;gap:.8rem;pointer-events:none}
    .arlab-hud-card{border:1px solid var(--border-subtle);background:rgba(5,5,8,.66);backdrop-filter:blur(16px);padding:.85rem 1rem;box-shadow:0 18px 45px rgba(0,0,0,.35)}
    .arlab-hud-title{font-family:"JetBrains Mono",monospace;font-size:.56rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent-primary);margin-bottom:.28rem}
    .arlab-hud-text{color:var(--text-primary);font-size:.84rem;line-height:1.45}
    .arlab-hud-progress{height:4px;margin-top:.65rem;background:rgba(255,255,255,.08);overflow:hidden}
    .arlab-hud-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent-primary),var(--accent-secondary));transition:width .18s ease}
    .arlab-inspector-title{font-family:"Orbitron",sans-serif;font-size:1rem;letter-spacing:1px;margin-bottom:.5rem}
    .arlab-inspector-role{font-family:"JetBrains Mono",monospace;font-size:.58rem;color:var(--accent-primary);letter-spacing:1px;text-transform:uppercase;margin-bottom:.45rem}
    .arlab-inspector-status{font-family:"JetBrains Mono",monospace;font-size:.58rem;color:var(--warning);letter-spacing:1px;text-transform:uppercase;margin-bottom:.9rem}
    .arlab-inspector-text{color:var(--text-secondary);font-size:.9rem;line-height:1.85}
    .arlab-demo-note,.arlab-privacy-note{margin-top:.8rem;padding:.8rem;border:1px solid var(--border-subtle);background:rgba(0,0,0,.22);color:var(--text-secondary);font-size:.78rem;line-height:1.65}
    .arlab-privacy-note strong{color:var(--accent-secondary);font-family:"JetBrains Mono",monospace;font-size:.62rem;letter-spacing:1px;text-transform:uppercase}
    .arlab-ghost-cursor{position:absolute;width:22px;height:22px;border-radius:50%;border:1px solid rgba(0,212,255,.92);box-shadow:0 0 18px rgba(0,212,255,.35);transform:translate(-50%,-50%) scale(.82);opacity:0;z-index:9;pointer-events:none;transition:opacity .16s ease,transform .16s ease,border-color .16s ease}
    .arlab-ghost-cursor.active{opacity:1}.arlab-ghost-cursor.grab{transform:translate(-50%,-50%) scale(1.25);border-color:rgba(0,255,136,.95);box-shadow:0 0 24px rgba(0,255,136,.45)}
    .arlab-part.active{transform:translateX(4px);border-color:rgba(0,212,255,.5)!important;background:rgba(0,212,255,.08)!important}
    @media(max-width:900px){.arlab-upgrade-status,.arlab-gesture-hud,.arlab-tool-row{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}

function buildUI() {
  injectStyles();
  const controls = document.querySelector(".arlab-controls");
  if (controls && !$("arDemoBtn")) {
    const row = document.createElement("div");
    row.className = "arlab-tool-row";
    const buttons = [
      ["arDemoBtn", "arlab-btn-demo", "DEMO MODE"],
      ["arXrayBtn", "arlab-btn-xray", "X-RAY"],
      ["arLabelsBtn", "arlab-btn-labels", "LABELS"],
      ["arFieldBtn", "arlab-btn-field", "FIELD"],
      ["arAssemblyBtn", "arlab-btn-assembly", "ASSEMBLY"],
      ["arPresentationBtn", "arlab-btn-presentation", "PRESENTATION"],
      ["arQualityBtn", "arlab-btn-quality", "PERFORMANCE"],
    ];
    buttons.forEach(([id, cls, value]) => {
      const btn = document.createElement("button");
      btn.id = id;
      btn.type = "button";
      btn.className = `arlab-btn ${cls}`;
      btn.textContent = value;
      row.appendChild(btn);
    });
    controls.appendChild(row);
  }

  if (viewport && !$("arGestureHud")) {
    const ghost = document.createElement("div");
    ghost.id = "arGhostCursor";
    ghost.className = "arlab-ghost-cursor";
    viewport.appendChild(ghost);

    const hud = document.createElement("div");
    hud.id = "arGestureHud";
    hud.className = "arlab-gesture-hud";
    hud.innerHTML = `<div class="arlab-hud-card"><div class="arlab-hud-title" id="arHudTitle">Interaction Guide</div><div class="arlab-hud-text" id="arHudText">Premi START AR oppure DEMO MODE.</div></div><div class="arlab-hud-card"><div class="arlab-hud-title">Inspection Progress</div><div class="arlab-hud-text">X-Ray, Labels, Field, Assembly e Presentation sono modalità locali del digital twin.</div><div class="arlab-hud-progress"><span id="arHudProgress"></span></div></div>`;
    viewport.appendChild(hud);
  }

  if (sidebar && !$("arUpgradeStatusCard")) {
    const card = document.createElement("div");
    card.className = "arlab-info-card";
    card.id = "arUpgradeStatusCard";
    card.innerHTML = `<div class="arlab-info-title">Interaction Status</div><div class="arlab-upgrade-status"><div class="arlab-upgrade-stat"><span>Camera</span><strong id="arStatusCamera">OFF</strong></div><div class="arlab-upgrade-stat"><span>Tracking</span><strong id="arStatusTracking">OFF</strong></div><div class="arlab-upgrade-stat"><span>Hands</span><strong id="arStatusHands">0</strong></div><div class="arlab-upgrade-stat"><span>Gesture</span><strong id="arStatusGesture">IDLE</strong></div><div class="arlab-upgrade-stat"><span>Model</span><strong id="arStatusModel">ASSEMBLED</strong></div><div class="arlab-upgrade-stat"><span>Selected</span><strong id="arStatusSelected">None</strong></div></div><div class="arlab-demo-note">Local browser digital twin demo. This is not real hardware control yet.</div>`;
    sidebar.insertBefore(card, sidebar.children[1] || null);
  }

  if (sidebar && !$("arPartInspector")) {
    const inspector = document.createElement("div");
    inspector.className = "arlab-info-card";
    inspector.id = "arPartInspector";
    inspector.innerHTML = `<div class="arlab-info-title">Selected Component</div><div class="arlab-inspector-title" id="arInspectorTitle">MicroBot Assembly</div><div class="arlab-inspector-role" id="arInspectorRole">Full digital twin view</div><div class="arlab-inspector-status" id="arInspectorStatus">Local interactive demo</div><p class="arlab-inspector-text" id="arInspectorText">Use X-Ray to expose the internal stack, Labels to show callouts, Field to visualize magnetic lines, Assembly for construction sequence and Presentation for an automatic showcase.</p><div class="arlab-privacy-note"><strong>Privacy</strong><br>Camera frames are processed locally in the browser. No video upload is performed by this static GitHub Pages demo.</div>`;
    const partsCard = document.querySelector(".arlab-parts-list")?.closest(".arlab-info-card");
    if (partsCard) sidebar.insertBefore(inspector, partsCard);
    else sidebar.appendChild(inspector);
  }

  ui = {
    demoBtn: $("arDemoBtn"),
    xrayBtn: $("arXrayBtn"),
    labelsBtn: $("arLabelsBtn"),
    fieldBtn: $("arFieldBtn"),
    assemblyBtn: $("arAssemblyBtn"),
    presentationBtn: $("arPresentationBtn"),
    qualityBtn: $("arQualityBtn"),
    cam: $("arStatusCamera"),
    track: $("arStatusTracking"),
    hands: $("arStatusHands"),
    gest: $("arStatusGesture"),
    model: $("arStatusModel"),
    selected: $("arStatusSelected"),
    hudTitle: $("arHudTitle"),
    hudText: $("arHudText"),
    hudProgress: $("arHudProgress"),
    ghost: $("arGhostCursor"),
    title: $("arInspectorTitle"),
    role: $("arInspectorRole"),
    status: $("arInspectorStatus"),
    description: $("arInspectorText"),
  };

  document.querySelectorAll(".arlab-part").forEach((el) => {
    el.addEventListener("click", () => {
      selectPart(partOrder.indexOf(el.dataset.part), true);
    });
  });
}

function setHud(title, body, progress = explode) {
  text(ui.hudTitle, title);
  text(ui.hudText, body);
  if (ui.hudProgress) ui.hudProgress.style.width = `${Math.round(clamp(progress, 0, 1) * 100)}%`;
}

function updateStatus() {
  const activeModes = [];
  if (xrayMode) activeModes.push("X-RAY");
  if (labelsMode) activeModes.push("LABELS");
  if (fieldMode) activeModes.push("FIELD");
  if (assemblyMode) activeModes.push("ASSEMBLY");

  text(ui.cam, demoMode ? "DEMO" : mediaStream ? "ON" : "OFF");
  text(ui.track, presentationMode ? "PRESENTATION" : demoMode ? "DEMO" : running ? "ACTIVE" : "OFF");
  text(ui.hands, `${hands.count}`);
  text(ui.gest, currentGesture);
  text(ui.model, activeModes.length ? activeModes.join(" / ") : explode > 0.72 ? "EXPLODED" : explode > 0.12 ? "INSPECTION" : "ASSEMBLED");
  text(ui.selected, selectedIndex >= 0 ? partInfo[parts[selectedIndex]?.label]?.[0] || parts[selectedIndex]?.label : "None");
}

function material(color, options = {}) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness: options.metalness ?? 0.35,
    roughness: options.roughness ?? 0.42,
    transparent: options.opacity !== undefined,
    opacity: options.opacity ?? 1,
    side: options.double ? THREE.DoubleSide : THREE.FrontSide,
    emissive: new THREE.Color(options.emissive ?? 0x000000),
    emissiveIntensity: options.emissiveIntensity ?? 0,
  });
  mat.userData.baseOpacity = mat.opacity;
  mat.userData.baseTransparent = mat.transparent;
  mat.userData.baseEmissiveIntensity = mat.emissiveIntensity;
  return mat;
}

function emissiveMaterial(color, emissive, intensity = 0.6) {
  return material(color, { metalness: 0.15, roughness: 0.25, emissive, emissiveIntensity: intensity });
}

function addEdges(mesh, color = 0x9beeff, opacity = 0.14) {
  if (!mesh.geometry) return;
  const edges = new THREE.EdgesGeometry(mesh.geometry, 18);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  mesh.add(line);
}

function box(w, h, d, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material(color, options));
  addEdges(mesh, options.edgeColor ?? 0x9beeff, options.edgeOpacity ?? 0.12);
  return mesh;
}

function cyl(r1, r2, h, segments, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, segments), material(color, options));
  addEdges(mesh, options.edgeColor ?? 0x9beeff, options.edgeOpacity ?? 0.12);
  return mesh;
}

function torus(radius, tube, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 96), material(color, options));
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function makeTextTexture(value, fg = "#ffffff", bg = "rgba(0,0,0,0)") {
  const canvasEl = document.createElement("canvas");
  canvasEl.width = 512;
  canvasEl.height = 160;
  const ctx = canvasEl.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.font = "700 46px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = fg;
  ctx.fillText(value, 256, 80);
  return new THREE.CanvasTexture(canvasEl);
}

function makeTextPlane(value, w = 0.28, h = 0.08, fg = "#ffffff", bg = "rgba(0,0,0,0)") {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: makeTextTexture(value, fg, bg), transparent: true, side: THREE.DoubleSide })
  );
}

function addPart(mesh, home, exploded, label) {
  const homePos = new THREE.Vector3(...home);
  const explodedPos = new THREE.Vector3(...exploded);
  mesh.position.copy(homePos);
  mesh.traverse((obj) => {
    if (obj.isMesh) obj.userData.microbotLabel = label;
  });
  scene.add(mesh);
  parts.push({ mesh, home: homePos, exploded: explodedPos, label });
}

function createShell() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.54, 0.92, 72, 1, true),
    material(0x00d4ff, { metalness: 0.65, roughness: 0.18, opacity: 0.42, double: true, emissive: 0x002b38, emissiveIntensity: 0.18 })
  );
  addEdges(body, 0x9beeff, 0.24);
  group.add(body);

  [-0.46, 0.46].forEach((y) => {
    const ring = torus(0.56, 0.014, 0x9beeff, { metalness: 0.55, roughness: 0.18, emissive: 0x00d4ff, emissiveIntensity: 0.1 });
    ring.position.y = y;
    group.add(ring);
  });

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    const rib = cyl(0.007, 0.007, 0.86, 8, 0x8be9ff, { metalness: 0.55, roughness: 0.22, opacity: 0.72, emissive: 0x00d4ff, emissiveIntensity: 0.08 });
    rib.position.set(Math.cos(a) * 0.565, 0, Math.sin(a) * 0.565);
    group.add(rib);
  }
  return group;
}

function createDome() {
  const group = new THREE.Group();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 72, 32, 0, TAU, 0, Math.PI / 2),
    material(0x00b8d9, { metalness: 0.58, roughness: 0.2, opacity: 0.58, double: true, emissive: 0x00384d, emissiveIntensity: 0.15 })
  );
  addEdges(dome, 0x9beeff, 0.18);
  group.add(dome);
  const rim = torus(0.55, 0.012, 0x00d4ff, { metalness: 0.55, roughness: 0.2, emissive: 0x00d4ff, emissiveIntensity: 0.18 });
  group.add(rim);

  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU + Math.PI / 6;
    const lens = cyl(0.035, 0.035, 0.014, 18, 0x0b1120, { metalness: 0.25, roughness: 0.08, emissive: 0x00e5ff, emissiveIntensity: 0.55 });
    lens.rotation.x = Math.PI / 2;
    lens.position.set(Math.cos(a) * 0.28, 0.31, Math.sin(a) * 0.28);
    group.add(lens);
  }
  return group;
}

function createBottomCap() {
  const group = new THREE.Group();
  group.add(cyl(0.55, 0.52, 0.08, 72, 0x0a2a3a, { metalness: 0.86, roughness: 0.14, edgeColor: 0x00d4ff, edgeOpacity: 0.18 }));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    const pad = cyl(0.055, 0.055, 0.012, 20, 0x1d2d3a, { metalness: 0.72, roughness: 0.18, edgeColor: 0x00ff88, edgeOpacity: 0.16 });
    pad.position.set(Math.cos(a) * 0.34, 0.055, Math.sin(a) * 0.34);
    group.add(pad);
  }
  return group;
}

function createCoil(radius, turns, color, coreColor) {
  const group = new THREE.Group();
  for (let i = 0; i < turns; i++) {
    const ring = torus(radius + Math.sin(i * 0.7) * 0.006, 0.01, color, { metalness: 0.75, roughness: 0.24, emissive: color, emissiveIntensity: 0.06 });
    ring.position.y = (i - (turns - 1) / 2) * 0.028;
    ring.rotation.z = i * 0.17;
    group.add(ring);
  }
  const core = cyl(radius * 0.34, radius * 0.34, 0.18, 32, coreColor, { metalness: 0.7, roughness: 0.22, edgeColor: 0xffffff, edgeOpacity: 0.16 });
  core.rotation.x = Math.PI / 2;
  group.add(core);
  return group;
}

function createMagnetCore() {
  const group = new THREE.Group();
  group.add(cyl(0.15, 0.15, 0.56, 36, 0x323b52, { metalness: 0.86, roughness: 0.14, edgeColor: 0xffffff, edgeOpacity: 0.18 }));
  const north = cyl(0.153, 0.153, 0.18, 36, 0xff4d6a, { metalness: 0.72, roughness: 0.18, emissive: 0xff3333, emissiveIntensity: 0.2 });
  north.position.y = 0.19;
  group.add(north);
  const south = cyl(0.153, 0.153, 0.18, 36, 0x4d72ff, { metalness: 0.72, roughness: 0.18, emissive: 0x3366ff, emissiveIntensity: 0.2 });
  south.position.y = -0.19;
  group.add(south);
  return group;
}

function createPCB() {
  const group = new THREE.Group();
  group.add(box(0.68, 0.055, 0.46, 0x00a65a, { metalness: 0.18, roughness: 0.62, edgeColor: 0x00ff88, edgeOpacity: 0.22 }));
  const traceOptions = { metalness: 0.55, roughness: 0.28, emissive: 0xffbe2e, emissiveIntensity: 0.08, edgeColor: 0xffbe2e, edgeOpacity: 0.05 };
  [
    [-0.18, 0.035, -0.12, 0.28, 0.01, 0.014],
    [0.12, 0.035, -0.08, 0.22, 0.01, 0.014],
    [0, 0.035, 0.08, 0.42, 0.01, 0.014],
    [0.25, 0.035, 0.12, 0.01, 0.01, 0.18],
    [-0.3, 0.035, 0, 0.01, 0.01, 0.28],
  ].forEach(([x, y, z, w, h, d]) => {
    const trace = box(w, h, d, 0xffc857, traceOptions);
    trace.position.set(x, y, z);
    group.add(trace);
  });
  for (const x of [-0.28, -0.14, 0, 0.14, 0.28]) {
    for (const z of [-0.18, 0.18]) {
      const pad = cyl(0.018, 0.018, 0.009, 16, 0xd9fff0, { metalness: 0.6, roughness: 0.18, edgeOpacity: 0.04 });
      pad.position.set(x, 0.043, z);
      group.add(pad);
    }
  }
  const label = makeTextPlane("PCB", 0.18, 0.055, "#001b10", "rgba(0,255,136,.65)");
  label.rotation.x = -Math.PI / 2;
  label.position.set(0.2, 0.046, -0.02);
  group.add(label);
  return group;
}

function createChip() {
  const group = new THREE.Group();
  group.add(box(0.24, 0.05, 0.18, 0x0b1020, { metalness: 0.35, roughness: 0.42, edgeColor: 0x9beeff, edgeOpacity: 0.18 }));
  for (let i = 0; i < 7; i++) {
    const z = -0.09 + i * 0.03;
    const p1 = box(0.035, 0.012, 0.006, 0xb0bec5, { metalness: 0.8, roughness: 0.2, edgeOpacity: 0.02 });
    p1.position.set(-0.14, 0.003, z);
    group.add(p1);
    const p2 = p1.clone();
    p2.position.x = 0.14;
    group.add(p2);
  }
  const label = makeTextPlane("ESP32", 0.17, 0.055, "#9beeff");
  label.rotation.x = -Math.PI / 2;
  label.position.set(0, 0.033, 0);
  group.add(label);
  return group;
}

function createAntenna() {
  const group = new THREE.Group();
  group.add(cyl(0.018, 0.018, 0.34, 12, 0xd7dee8, { metalness: 0.9, roughness: 0.08, edgeOpacity: 0.05 }));
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 18, 18), emissiveMaterial(0x00ff88, 0x00ff88, 0.8));
  tip.position.y = 0.18;
  group.add(tip);
  for (const r of [0.11, 0.18, 0.25]) {
    const wave = torus(r, 0.003, 0x00ff88, { opacity: 0.35, emissive: 0x00ff88, emissiveIntensity: 0.2 });
    wave.position.y = 0.18;
    wave.scale.y = 0.35;
    group.add(wave);
  }
  return group;
}

function createBattery() {
  const group = new THREE.Group();
  group.add(box(0.34, 0.13, 0.22, 0xffbe2e, { metalness: 0.35, roughness: 0.38, edgeColor: 0xffffff, edgeOpacity: 0.12 }));
  const plus = cyl(0.025, 0.025, 0.018, 16, 0xff3333, { metalness: 0.55, roughness: 0.18, emissive: 0xff0000, emissiveIntensity: 0.18 });
  plus.rotation.z = Math.PI / 2;
  plus.position.set(0.18, 0.02, 0.055);
  group.add(plus);
  const minus = cyl(0.025, 0.025, 0.018, 16, 0x20242d, { metalness: 0.55, roughness: 0.18 });
  minus.rotation.z = Math.PI / 2;
  minus.position.set(0.18, 0.02, -0.055);
  group.add(minus);
  return group;
}

function createLED() {
  const group = new THREE.Group();
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), new THREE.MeshBasicMaterial({ color: 0xe040fb, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
  group.add(glow);
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 24), emissiveMaterial(0xe040fb, 0xe040fb, 1.15)));
  const light = new THREE.PointLight(0xe040fb, 0.55, 1.7);
  light.position.set(0, 0, 0.08);
  group.add(light);
  return group;
}

function createSensors() {
  const group = new THREE.Group();
  group.add(cyl(0.13, 0.13, 0.018, 32, 0x263246, { metalness: 0.45, roughness: 0.38, edgeColor: 0x00e5ff, edgeOpacity: 0.16 }));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU;
    const lens = cyl(0.033, 0.033, 0.03, 18, 0x071827, { metalness: 0.28, roughness: 0.12, emissive: 0x00e5ff, emissiveIntensity: 0.45 });
    lens.position.set(Math.cos(a) * 0.078, 0.025, Math.sin(a) * 0.078);
    group.add(lens);
  }
  return group;
}

function createGearMesh(radius, teeth, thickness, color) {
  const shape = new THREE.Shape();
  const inner = radius * 0.7;
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * TAU;
    const a2 = ((i + 0.3) / teeth) * TAU;
    const a3 = ((i + 0.5) / teeth) * TAU;
    const a4 = ((i + 0.8) / teeth) * TAU;
    shape[i === 0 ? "moveTo" : "lineTo"](Math.cos(a1) * inner, Math.sin(a1) * inner);
    shape.lineTo(Math.cos(a2) * radius, Math.sin(a2) * radius);
    shape.lineTo(Math.cos(a3) * radius, Math.sin(a3) * radius);
    shape.lineTo(Math.cos(a4) * inner, Math.sin(a4) * inner);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  geometry.center();
  const mesh = new THREE.Mesh(geometry, material(color, { metalness: 0.8, roughness: 0.2 }));
  addEdges(mesh, 0xffffff, 0.18);
  return mesh;
}

function createGears() {
  const group = new THREE.Group();
  group.add(createGearMesh(0.14, 12, 0.04, 0xb0bec5));
  const second = createGearMesh(0.09, 8, 0.04, 0x90a4ae);
  second.position.x = 0.2;
  group.add(second);
  group.rotation.x = Math.PI / 2;
  return group;
}

function buildModel() {
  parts.length = 0;
  addPart(createShell(), [0, 0, 0], [0, 2.2, 0], "shell");
  addPart(createDome(), [0, 0.45, 0], [0, 3.2, 0.5], "dome");
  addPart(createBottomCap(), [0, -0.45, 0], [0, -2.8, 0], "bottomCap");
  addPart(createCoil(0.32, 11, 0xff8a3d, 0x4a2a16), [0, 0.1, 0], [-2, 0.8, 0], "coilPrimary");
  addPart(createCoil(0.25, 9, 0xffc04d, 0x3e2b12), [0, -0.1, 0], [-2, -0.5, 0.5], "coilSecondary");
  addPart(createMagnetCore(), [0, -0.05, 0], [2, 0.6, 0], "magnetCore");
  addPart(new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 12, 0, TAU, 0, Math.PI / 2), emissiveMaterial(0xff6b6b, 0xff3333, 0.55)), [0, 0.22, 0], [2, 1.5, 0.4], "poleNorth");
  addPart(new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 12, 0, TAU, Math.PI / 2, Math.PI / 2), emissiveMaterial(0x6b8fff, 0x3366ff, 0.55)), [0, -0.32, 0], [2, -0.5, 0.4], "poleSouth");
  addPart(createPCB(), [0, 0.22, 0], [0, -2, 1], "pcb");
  addPart(createChip(), [0.1, 0.27, 0.05], [0.4, -1.5, 1.4], "chip");
  addPart(createAntenna(), [0.25, 0.62, 0.15], [1.5, 2.8, 0.8], "antenna");
  addPart(createBattery(), [0.15, -0.28, 0], [1.5, -2, -0.5], "battery");
  addPart(createLED(), [0, 0.52, 0.38], [-1.5, -1.8, -0.5], "ledStatus");
  addPart(createSensors(), [-0.2, 0.48, 0.2], [-1.5, 2.5, 0.8], "sensorArray");
  addPart(createGears(), [0, -0.15, 0.3], [-0.5, -2.5, -1], "gears");
}

function buildEffects() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(540);
  for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 4.4;
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particles = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.033, transparent: true, opacity: 0.5, color: 0x00d4ff, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(particles);

  rings = [];
  [0x00d4ff, 0x00ff88, 0xe040fb].forEach((color, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72 + i * 0.18, 0.005, 8, 96), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending }));
    ring.userData.speed = 0.3 + i * 0.12;
    scene.add(ring);
    rings.push(ring);
  });

  wire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.82, 1), new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.075, blending: THREE.AdditiveBlending }));
  scene.add(wire);

  grid = new THREE.GridHelper(4.2, 28, 0x00d4ff, 0x223040);
  grid.position.y = -1.25;
  grid.material.transparent = true;
  grid.material.opacity = 0.12;
  scene.add(grid);
}

function makeLabelSprite(value) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeTextTexture(value, "#9beeff", "rgba(0,18,26,.62)"), transparent: true, opacity: 0.92, depthWrite: false }));
  sprite.scale.set(0.52, 0.16, 1);
  sprite.visible = false;
  return sprite;
}

function buildLabels() {
  labelSprites.length = 0;
  parts.forEach((part) => {
    const sprite = makeLabelSprite(labelNames[part.label] || part.label);
    scene.add(sprite);
    labelSprites.push(sprite);
  });
}

function updateLabels() {
  labelSprites.forEach((sprite, index) => {
    const part = parts[index];
    if (!part) return;
    sprite.visible = labelsMode && (!performanceMode || index === selectedIndex || explode > 0.45);
    sprite.position.copy(part.mesh.position);
    sprite.position.y += 0.36;
    sprite.position.z += 0.16;
    sprite.material.opacity = index === selectedIndex ? 1 : 0.78;
  });
}

function buildField() {
  fieldGroup = new THREE.Group();
  fieldGroup.visible = false;
  const colors = [0x00d4ff, 0x00ff88, 0xe040fb];
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 10; i++) {
      const points = [];
      const phase = (i / 10) * TAU;
      for (let k = 0; k < 90; k++) {
        const t = (k / 89) * TAU;
        const r = 0.42 + j * 0.18 + Math.sin(t * 2 + phase) * 0.035;
        points.push(new THREE.Vector3(Math.cos(t + phase) * r, Math.sin(t) * (0.34 + j * 0.12), Math.sin(t + phase) * r * 0.62));
      }
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: colors[j], transparent: true, opacity: 0.18 + j * 0.04, blending: THREE.AdditiveBlending }));
      line.rotation.y = phase;
      fieldGroup.add(line);
    }
  }
  scene.add(fieldGroup);
}

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
  if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.035);
  clock = new THREE.Clock();
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  camera3d = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera3d.position.set(0, 0, 5.2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.32));
  [[0xffffff, 1.05, 3, 5, 4], [0x00d4ff, 0.7, -3, -2, 2], [0xff6b9d, 0.32, -4, 3, -3], [0x00ff88, 0.28, 0, -3, 2]].forEach(([color, intensity, x, y, z]) => {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
  });
  const coreLight = new THREE.PointLight(0x00d4ff, 0.55, 5.5);
  coreLight.position.set(0, 0.25, 1.6);
  scene.add(coreLight);

  buildModel();
  buildEffects();
  buildLabels();
  buildField();
  resizeRenderer();
  selectPart(-1);
  canvas.addEventListener("pointerdown", onCanvasPick);
}

function resizeRenderer() {
  if (!renderer) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  renderer.setSize(width, height);
  camera3d.aspect = width / height;
  camera3d.updateProjectionMatrix();
}

function selectPart(index, forceExplode = false) {
  selectedIndex = index;
  document.querySelectorAll(".arlab-part").forEach((el, i) => el.classList.toggle("active", i === index));
  if (index >= 0 && parts[index]) {
    const info = partInfo[parts[index].label];
    text(ui.title, info[0]);
    text(ui.role, info[1]);
    text(ui.status, info[2]);
    text(ui.description, info[3]);
    if (forceExplode) targetExplode = Math.max(targetExplode, 0.85);
  } else {
    text(ui.title, "MicroBot Assembly");
    text(ui.role, "Full digital twin view");
    text(ui.status, "Local interactive demo");
    text(ui.description, "Use X-Ray to expose the internal stack, Labels to show callouts, Field to visualize magnetic lines, Assembly for construction sequence and Presentation for an automatic showcase.");
  }
  updateStatus();
}

function onCanvasPick(event) {
  if (!renderer || !raycaster || !pointer) return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera3d);
  const objects = [];
  parts.forEach((part) => part.mesh.traverse((obj) => { if (obj.isMesh) objects.push(obj); }));
  const hit = raycaster.intersectObjects(objects, true)[0];
  if (!hit) return;
  let obj = hit.object;
  while (obj && !obj.userData.microbotLabel) obj = obj.parent;
  const label = obj?.userData?.microbotLabel || hit.object.userData.microbotLabel;
  const index = parts.findIndex((part) => part.label === label);
  if (index >= 0) {
    selectPart(index, true);
    labelsMode = true;
    updateButtonStates();
    setHud("Click-to-Select", `Selected component: ${partInfo[label]?.[0] || label}.`, explode);
    ensureRenderLoop();
  }
}

async function initHands() {
  if (handLandmarker) return;
  text(baseUI.tracking, "Loading...");
  const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task" },
    runningMode: "VIDEO",
    numHands: 2,
    minHandDetectionConfidence: 0.6,
    minHandPresenceConfidence: 0.6,
    minTrackingConfidence: 0.5,
  });
}

async function initCamera() {
  mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }, audio: false });
  video.srcObject = mediaStream;
  await video.play();
}

function pinchDistance(landmarks) {
  const thumb = landmarks[4];
  const index = landmarks[8];
  return Math.hypot(thumb.x - index.x, thumb.y - index.y, (thumb.z || 0) - (index.z || 0));
}

function nextPinchState(previous, distance) {
  return previous ? distance < PINCH_OFF : distance < PINCH_ON;
}

function palmCenter(landmarks) {
  const points = [landmarks[0], landmarks[5], landmarks[17]];
  return { x: points.reduce((sum, p) => sum + p.x, 0) / 3, y: points.reduce((sum, p) => sum + p.y, 0) / 3 };
}

function handSpan(left, right) {
  const a = palmCenter(left);
  const b = palmCenter(right);
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function processHands(result) {
  hands.count = result.landmarks?.length || 0;
  hands.left = null;
  hands.right = null;
  let leftPinch = false;
  let rightPinch = false;
  (result.landmarks || []).forEach((landmarks, i) => {
    const side = result.handedness?.[i]?.[0]?.categoryName?.toUpperCase();
    const distance = pinchDistance(landmarks);
    if (side === "LEFT") {
      hands.right = landmarks;
      rightPinch = nextPinchState(pinch.right, distance);
    } else {
      hands.left = landmarks;
      leftPinch = nextPinchState(pinch.left, distance);
    }
  });
  pinch.left = leftPinch;
  pinch.right = rightPinch;
  text(baseUI.hands, `${hands.count} HAND${hands.count !== 1 ? "S" : ""}`);
}

function showGhost(landmarks, grab = false) {
  if (!ui.ghost || !viewport || !landmarks) {
    ui.ghost?.classList.remove("active", "grab");
    return;
  }
  const rect = viewport.getBoundingClientRect();
  const tip = landmarks[8];
  ui.ghost.style.left = `${(1 - tip.x) * rect.width}px`;
  ui.ghost.style.top = `${tip.y * rect.height}px`;
  ui.ghost.classList.add("active");
  ui.ghost.classList.toggle("grab", grab);
}

function nearestPart(x, y) {
  let index = -1;
  let minDistance = Infinity;
  parts.forEach((part, i) => {
    const distance = Math.hypot(part.mesh.position.x - x, part.mesh.position.y - y);
    if (distance < minDistance) {
      minDistance = distance;
      index = i;
    }
  });
  return { index, minDistance };
}

function interactWithHands() {
  if (demoMode || presentationMode || assemblyMode) return;
  const bothPinch = pinch.left && pinch.right && hands.left && hands.right;
  const onePinch = (pinch.left && hands.left) || (pinch.right && hands.right);

  if (bothPinch) {
    targetExplode = clamp(handSpan(hands.left, hands.right) / 0.45, 0, 1);
    currentGesture = "EXPLODE";
    text(baseUI.gesture, "EXPLODE");
    text(baseUI.modeText, "Scomposto");
    text(baseUI.mode, "EXPLODE");
    setHud("Two-Hand Explode", "Allontana o avvicina le mani per controllare la scomposizione del MicroBot.", targetExplode);
    showGhost(hands.left, true);
    return;
  }

  if (onePinch) {
    const activeHand = pinch.left ? hands.left : hands.right;
    const tip = activeHand[8];
    const x = ((1 - tip.x) * 2 - 1) * 3;
    const y = -(tip.y * 2 - 1) * 2.2;
    if (explode > 0.3) {
      const candidate = nearestPart(x, y);
      if (candidate.index >= 0 && candidate.minDistance < 2) {
        const part = parts[candidate.index];
        part.mesh.position.x = lerp(part.mesh.position.x, x, 0.15);
        part.mesh.position.y = lerp(part.mesh.position.y, y, 0.15);
        selectPart(candidate.index);
      }
    } else {
      parts.forEach((part) => {
        part.mesh.position.x = lerp(part.mesh.position.x, part.home.x + x, 0.12);
        part.mesh.position.y = lerp(part.mesh.position.y, part.home.y + y, 0.12);
      });
    }
    currentGesture = "GRAB";
    text(baseUI.gesture, "GRAB");
    text(baseUI.mode, "GRAB");
    setHud("One-Hand Grab", "Stai controllando il modello con indice e pollice. In modalità esplosa puoi selezionare un componente.", explode);
    showGhost(activeHand, true);
    return;
  }

  targetExplode = Math.max(0, targetExplode - 0.008);
  currentGesture = hands.count ? "OPEN" : "IDLE";
  text(baseUI.gesture, hands.count ? "OPEN" : "—");
  text(baseUI.modeText, explode > 0.1 ? "Scomposto" : "Assemblato");
  text(baseUI.mode, hands.count ? "TRACKING" : "IDLE");
  showGhost(hands.left || hands.right, false);
  setHud(hands.count ? "Tracking Active" : "Waiting for Hands", hands.count ? "Pizzica indice e pollice per afferrare. Usa due mani per scomporre il MicroBot." : "Mostra una mano alla camera oppure usa DEMO MODE.", explode);
}

function demoStep(elapsed) {
  if (!demoMode) return;
  targetExplode = 0.32 + (Math.sin(elapsed * 0.55) + 1) * 0.34;
  currentGesture = "DEMO TOUR";
  const index = Math.floor((elapsed * 0.48) % parts.length);
  if (index !== selectedIndex) selectPart(index);
  text(baseUI.mode, "DEMO");
  text(baseUI.gesture, "DEMO TOUR");
  text(baseUI.modeText, targetExplode > 0.6 ? "Scomposto" : "Ispezione");
  setHud("Rendering Demo Mode", "Tour automatico del modello dettagliato: shell, bobine, PCB, ESP32, batteria, sensori e luci emissive.", targetExplode);
  showGhost(null);
}

function assemblyStep() {
  if (!assemblyMode) return;
  const elapsed = (performance.now() - assemblyStart) / 1000;
  const progress = clamp(elapsed / 9, 0, 1);
  targetExplode = 1 - progress;
  const index = clamp(Math.floor(progress * parts.length), 0, parts.length - 1);
  if (index !== selectedIndex) selectPart(index);
  currentGesture = "ASSEMBLY";
  text(baseUI.mode, "ASSEMBLY");
  text(baseUI.gesture, "ASSEMBLY");
  text(baseUI.modeText, "Costruzione");
  setHud("Assembly Sequence", "I componenti partono separati e rientrano progressivamente nella struttura assemblata.", progress);
  if (progress >= 1) {
    assemblyMode = false;
    targetExplode = 0;
    updateButtonStates();
  }
}

function presentationStep() {
  if (!presentationMode) return;
  const elapsed = (performance.now() - presentationStart) / 1000;
  const phase = elapsed % 28;
  demoMode = false;
  currentGesture = "PRESENTATION";
  if (phase < 5) {
    xrayMode = true;
    labelsMode = true;
    fieldMode = false;
    targetExplode = 0.2;
    selectPart(-1);
    setHud("Presentation: X-Ray", "Shell trasparente e stack interno in evidenza.", phase / 5);
  } else if (phase < 11) {
    xrayMode = true;
    labelsMode = true;
    fieldMode = true;
    targetExplode = 0.82;
    const index = clamp(Math.floor(((phase - 5) / 6) * parts.length), 0, parts.length - 1);
    selectPart(index);
    setHud("Presentation: Component Tour", "Tour automatico dei componenti interni con callout e inspector.", (phase - 5) / 6);
  } else if (phase < 17) {
    xrayMode = false;
    labelsMode = true;
    fieldMode = true;
    targetExplode = 0.65;
    selectPart(partOrder.indexOf("coilPrimary"));
    setHud("Presentation: Magnetic Field", "Visualizzazione concettuale delle linee di campo attorno a bobine e magnete.", (phase - 11) / 6);
  } else if (phase < 23) {
    xrayMode = true;
    labelsMode = true;
    fieldMode = false;
    targetExplode = 1 - (phase - 17) / 6;
    const index = clamp(Math.floor(((phase - 17) / 6) * parts.length), 0, parts.length - 1);
    selectPart(index);
    setHud("Presentation: Assembly", "Sequenza cinematografica di riassemblaggio del MicroBot.", (phase - 17) / 6);
  } else {
    xrayMode = false;
    labelsMode = false;
    fieldMode = false;
    targetExplode = 0;
    selectPart(-1);
    setHud("Presentation: Final Assembly", "Modello assemblato pronto per passare a dashboard, firmware e validazione hardware.", (phase - 23) / 5);
  }
  text(baseUI.mode, "PRESENTATION");
  text(baseUI.gesture, "PRESENTATION");
  updateButtonStates();
}

function setMaterialModes() {
  parts.forEach((part, index) => {
    const isSelected = index === selectedIndex;
    const isShell = part.label === "shell" || part.label === "dome";
    const isBottom = part.label === "bottomCap";
    const ghostShell = xrayMode && isShell;
    const boostInternal = xrayMode && !isShell && !isBottom;
    part.mesh.traverse((obj) => {
      if (!obj.material) return;
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      materials.forEach((mat) => {
        if (mat.opacity === undefined) return;
        if (mat.userData.baseOpacity === undefined) {
          mat.userData.baseOpacity = mat.opacity;
          mat.userData.baseTransparent = mat.transparent;
          mat.userData.baseEmissiveIntensity = mat.emissiveIntensity || 0;
        }
        if (ghostShell) {
          mat.transparent = true;
          mat.opacity = 0.12;
        } else {
          mat.transparent = Boolean(mat.userData.baseTransparent || xrayMode || isSelected);
          mat.opacity = isSelected ? Math.min(1, (mat.userData.baseOpacity ?? 1) + 0.1) : (mat.userData.baseOpacity ?? 1);
        }
        if (mat.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = (mat.userData.baseEmissiveIntensity || 0) + (boostInternal ? 0.22 : 0) + (isSelected ? 0.25 : 0);
        }
      });
    });
  });
}

function updateModes(elapsed) {
  if (fieldGroup) {
    fieldGroup.visible = fieldMode && !performanceMode;
    fieldGroup.rotation.y += 0.004;
    fieldGroup.children.forEach((line, index) => {
      if (line.material) line.material.opacity = 0.12 + Math.sin(elapsed * 2 + index * 0.4) * 0.035 + (xrayMode ? 0.08 : 0);
    });
  }
  if (particles) {
    particles.visible = !performanceMode;
    particles.rotation.y += 0.002;
  }
  if (grid) grid.visible = !performanceMode;
  if (wire) wire.visible = !performanceMode || xrayMode || fieldMode;
  updateLabels();
  setMaterialModes();
}

function updateButtonStates() {
  ui.demoBtn?.classList.toggle("active", demoMode);
  ui.xrayBtn?.classList.toggle("active", xrayMode);
  ui.labelsBtn?.classList.toggle("active", labelsMode);
  ui.fieldBtn?.classList.toggle("active", fieldMode);
  ui.assemblyBtn?.classList.toggle("active", assemblyMode);
  ui.presentationBtn?.classList.toggle("active", presentationMode);
  ui.qualityBtn?.classList.toggle("active", performanceMode);
}

function animate() {
  if (!running && !demoMode && !assemblyMode && !presentationMode) return;
  animationId = requestAnimationFrame(animate);
  const now = performance.now();
  text(baseUI.fps, `${Math.round(1000 / Math.max(1, now - lastFrame))} FPS`);
  lastFrame = now;
  const dt = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  if (running && !demoMode && !presentationMode && !assemblyMode && handLandmarker && video.readyState >= 2) {
    processHands(handLandmarker.detectForVideo(video, now));
  }

  demoStep(elapsed);
  assemblyStep();
  presentationStep();
  interactWithHands();
  explode = lerp(explode, targetExplode, 0.06);

  parts.forEach((part, index) => {
    if (!demoMode && !presentationMode && !assemblyMode && (pinch.left || pinch.right)) return;
    const target = new THREE.Vector3().lerpVectors(part.home, part.exploded, explode);
    part.mesh.position.lerp(target, 0.06);
    const rotationSpeed = (demoMode || presentationMode) ? 0.006 : (1 - explode) * 0.003 + 0.001;
    part.mesh.rotation.y += rotationSpeed;
    if (index === selectedIndex) part.mesh.rotation.x += 0.003;
  });

  if (particles) {
    particles.rotation.y += dt * 0.08;
    particles.material.opacity = 0.38 + Math.sin(elapsed * 2) * 0.08;
  }

  rings.forEach((ring, index) => {
    ring.visible = !performanceMode || index === 0;
    const axis = ["x", "y", "z"][index];
    ring.rotation[axis] = elapsed * ring.userData.speed;
    ring.scale.setScalar(1 + explode * 0.9);
    ring.material.opacity = 0.16 + explode * 0.12 + Math.sin(elapsed * 2 + index) * 0.04;
  });

  if (wire) {
    wire.rotation.x = elapsed * 0.15;
    wire.rotation.y = elapsed * 0.1;
    wire.scale.setScalar(1 + explode * 0.58);
    wire.material.opacity = 0.055 + explode * 0.09;
  }

  const gears = parts.find((part) => part.label === "gears");
  if (gears) {
    if (gears.mesh.children[0]) gears.mesh.children[0].rotation.z += dt * 2;
    if (gears.mesh.children[1]) gears.mesh.children[1].rotation.z -= dt * 3;
  }

  updateModes(elapsed);
  updateStatus();
  renderer.render(scene, camera3d);
}

function ensureRenderLoop() {
  if (!renderer) initThree();
  if (!animationId) animate();
}

async function start() {
  if (running) return;
  try {
    stopDemo(false);
    presentationMode = false;
    assemblyMode = false;
    instructions?.classList.add("hidden");
    if (!renderer) initThree();
    await initHands();
    await initCamera();
    running = true;
    text(baseUI.camera, "ON");
    text(baseUI.tracking, "ACTIVE");
    currentGesture = "WAITING";
    setHud("Camera Active", "Mostra una mano alla camera. Pizzica per afferrare, usa due mani per scomporre.", explode);
    resizeRenderer();
    updateButtonStates();
    animate();
  } catch (error) {
    console.error("AR Lab error:", error);
    text(baseUI.camera, "ERROR");
    text(baseUI.tracking, "ERROR");
    currentGesture = "ERROR";
    setHud("Camera Error", "La camera non è disponibile. Usa DEMO MODE o PRESENTATION per esplorare comunque il modello.", explode);
    instructions?.classList.remove("hidden");
  }
}

function stop() {
  running = false;
  if (animationId && !demoMode && !assemblyMode && !presentationMode) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
  video.srcObject = null;
  hands.count = 0;
  hands.left = null;
  hands.right = null;
  pinch.left = false;
  pinch.right = false;
  text(baseUI.camera, "OFF");
  text(baseUI.tracking, "OFF");
  text(baseUI.gesture, "—");
  text(baseUI.mode, demoMode ? "DEMO" : "IDLE");
  text(baseUI.hands, "0 HANDS");
  if (!demoMode && !assemblyMode && !presentationMode) instructions?.classList.remove("hidden");
  currentGesture = "IDLE";
  updateStatus();
}

function reset() {
  demoMode = false;
  assemblyMode = false;
  presentationMode = false;
  targetExplode = 0;
  explode = 0;
  parts.forEach((part) => part.mesh.position.copy(part.home));
  selectPart(-1);
  text(baseUI.modeText, "Assemblato");
  setHud("Reset Complete", "Il modello è tornato assemblato. Puoi usare X-Ray, Labels, Field, Assembly, Presentation o Camera.", 0);
  updateButtonStates();
  if (animationId && !running) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function startDemo() {
  if (!renderer) initThree();
  stop();
  demoMode = true;
  assemblyMode = false;
  presentationMode = false;
  instructions?.classList.add("hidden");
  text(baseUI.camera, "DEMO");
  text(baseUI.tracking, "DEMO");
  text(baseUI.hands, "0 HANDS");
  currentGesture = "DEMO TOUR";
  resizeRenderer();
  updateButtonStates();
  animate();
}

function stopDemo(resetUi = true) {
  demoMode = false;
  if (resetUi) {
    text(baseUI.camera, mediaStream ? "ON" : "OFF");
    text(baseUI.tracking, running ? "ACTIVE" : "OFF");
    currentGesture = "IDLE";
  }
  updateButtonStates();
}

function toggleDemo() {
  if (demoMode) {
    stopDemo(true);
    if (animationId && !running && !assemblyMode && !presentationMode) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    instructions?.classList.remove("hidden");
  } else {
    startDemo();
  }
}

function toggleXray() {
  xrayMode = !xrayMode;
  if (xrayMode) {
    labelsMode = true;
    targetExplode = Math.max(targetExplode, 0.42);
  }
  setHud("X-Ray Mode", xrayMode ? "Shell e dome diventano trasparenti per mostrare elettronica, bobine e magnete interno." : "X-Ray disattivato: il modello torna alla resa standard.", explode);
  updateButtonStates();
  ensureRenderLoop();
}

function toggleLabels() {
  labelsMode = !labelsMode;
  setHud("3D Labels", labelsMode ? "Callout 3D attivi sui componenti del MicroBot." : "Callout 3D disattivati.", explode);
  updateButtonStates();
  ensureRenderLoop();
}

function toggleField() {
  fieldMode = !fieldMode;
  if (fieldMode) targetExplode = Math.max(targetExplode, 0.55);
  setHud("Magnetic Field Visualization", fieldMode ? "Linee di campo concettuali attive attorno a bobine e magnete." : "Visualizzazione del campo disattivata.", explode);
  updateButtonStates();
  ensureRenderLoop();
}

function startAssembly() {
  if (!renderer) initThree();
  stopDemo(false);
  presentationMode = false;
  assemblyMode = true;
  labelsMode = true;
  xrayMode = true;
  targetExplode = 1;
  explode = Math.max(explode, 0.95);
  assemblyStart = performance.now();
  instructions?.classList.add("hidden");
  updateButtonStates();
  animate();
}

function togglePresentation() {
  if (!renderer) initThree();
  presentationMode = !presentationMode;
  if (presentationMode) {
    stop();
    demoMode = false;
    assemblyMode = false;
    presentationStart = performance.now();
    instructions?.classList.add("hidden");
    animate();
  } else {
    xrayMode = false;
    fieldMode = false;
    labelsMode = false;
    targetExplode = 0;
    selectPart(-1);
    if (animationId && !running && !demoMode && !assemblyMode) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    instructions?.classList.remove("hidden");
  }
  updateButtonStates();
}

function toggleQuality() {
  performanceMode = !performanceMode;
  renderer?.setPixelRatio(performanceMode ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  setHud("Quality Toggle", performanceMode ? "Performance Mode attivo: particelle, griglia e campi complessi ridotti." : "High Quality attiva: rendering completo.", explode);
  updateButtonStates();
  ensureRenderLoop();
}

buildUI();
setHud("Interaction Guide", "Premi START AR per usare la camera oppure usa DEMO, X-RAY, LABELS, FIELD, ASSEMBLY, PRESENTATION e PERFORMANCE.", 0);
updateStatus();

startBtn?.addEventListener("click", start);
stopBtn?.addEventListener("click", stop);
resetBtn?.addEventListener("click", reset);
ui.demoBtn?.addEventListener("click", toggleDemo);
ui.xrayBtn?.addEventListener("click", toggleXray);
ui.labelsBtn?.addEventListener("click", toggleLabels);
ui.fieldBtn?.addEventListener("click", toggleField);
ui.assemblyBtn?.addEventListener("click", startAssembly);
ui.presentationBtn?.addEventListener("click", togglePresentation);
ui.qualityBtn?.addEventListener("click", toggleQuality);
window.addEventListener("resize", resizeRenderer);
