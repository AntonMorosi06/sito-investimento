/* MicroBot AR Interaction Lab — upgraded public demo
   Local camera processing, gesture HUD, demo mode, part inspector, 15-part 3D MicroBot. */

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs";

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
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
  shell: ["Outer Shell", "Protective body", "Digital concept", "External structure for protection, alignment and visual identity of the MicroBot unit."],
  dome: ["Upper Dome", "Top cap / orientation layer", "Digital concept", "Upper cover used to communicate orientation, status and future sensor or light integration."],
  bottomCap: ["Bottom Cap", "Base plate", "Digital concept", "Lower interface that represents the contact plane and the mechanical constraint of the internal stack."],
  coilPrimary: ["Primary Coil", "Main electromagnetic actuator", "Simulation target", "Primary coil for attraction, repulsion and docking experiments. Real force requires physical validation."],
  coilSecondary: ["Secondary Coil", "Auxiliary winding", "Simulation target", "Secondary electromagnetic layer for visualizing multi-state field control and future axis separation."],
  magnetCore: ["Magnet Core", "Permanent magnetic reference", "Simulation target", "Central magnetic core used to explain alignment, docking and polarity-based interaction logic."],
  poleNorth: ["North Pole", "Polarity marker", "Educational marker", "Visual indicator for one side of the magnetic polarity model."],
  poleSouth: ["South Pole", "Polarity marker", "Educational marker", "Visual indicator for the opposite side of the magnetic polarity model."],
  pcb: ["Main PCB", "Embedded electronics carrier", "Planned hardware", "Board layer for MCU, power routing, coil drivers, sensors and telemetry interfaces."],
  chip: ["ESP32 Control Core", "Embedded processing", "Firmware-ready target", "ESP32-based control layer for commands, telemetry, safety state and node behavior."],
  antenna: ["Wireless Antenna", "Communication interface", "Planned network layer", "Wireless link for future ESP-NOW or similar low-latency controller/node experiments."],
  battery: ["LiPo Battery", "Energy source", "Design target", "Local energy block. Real implementation needs charging, protection, current and thermal safety."],
  ledStatus: ["RGB Status LED", "Visible feedback", "Prototype-friendly", "Status indicator for node state, errors, connection state and early hardware demonstrations."],
  sensorArray: ["Sensor Array", "Perception inputs", "Planned sensing layer", "Representation of local sensors for proximity, orientation, magnetic or environmental feedback."],
  gears: ["Micro Gear Mechanism", "Mechanical concept", "Concept visual", "Mechanical detail included to communicate possible actuation or transmission layers."],
};
const partOrder = Object.keys(partInfo);

let renderer, scene, camera3d, clock, handLandmarker, stream, raf;
let running = false;
let demo = false;
let explode = 0;
let targetExplode = 0;
let selected = -1;
let last = performance.now();
let gesture = "IDLE";
const parts = [];
const hands = { left: null, right: null, count: 0 };
const pinch = { left: false, right: false };
const PINCH_ON = 0.065;
const PINCH_OFF = 0.095;
let particles;
let rings = [];
let wire;
let ui = {};

function setText(el, text) { if (el) el.textContent = text; }

function injectCSS() {
  if ($("arLabUpgradeStyles")) return;
  const s = document.createElement("style");
  s.id = "arLabUpgradeStyles";
  s.textContent = `
    .arlab-btn-demo{border-color:rgba(0,255,136,.38)!important;color:var(--accent-secondary)!important}.arlab-btn-demo.active{background:var(--accent-secondary)!important;color:#050508!important;box-shadow:0 0 26px rgba(0,255,136,.22)}
    .arlab-upgrade-status{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem}.arlab-upgrade-stat{border:1px solid var(--border-subtle);background:rgba(0,0,0,.28);padding:.8rem;min-height:68px}.arlab-upgrade-stat span{display:block;font-family:"JetBrains Mono",monospace;font-size:.52rem;color:var(--accent-mid);letter-spacing:1px;text-transform:uppercase;margin-bottom:.28rem}.arlab-upgrade-stat strong{font-family:"Orbitron",sans-serif;font-size:.8rem;color:var(--accent-white);line-height:1.35;word-break:break-word}
    .arlab-gesture-hud{position:absolute;left:1rem;right:1rem;bottom:1rem;z-index:8;display:grid;grid-template-columns:1fr 1.6fr;gap:.8rem;pointer-events:none}.arlab-hud-card{border:1px solid var(--border-subtle);background:rgba(5,5,8,.66);backdrop-filter:blur(16px);padding:.85rem 1rem;box-shadow:0 18px 45px rgba(0,0,0,.35)}.arlab-hud-title{font-family:"JetBrains Mono",monospace;font-size:.56rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent-primary);margin-bottom:.28rem}.arlab-hud-text{color:var(--text-primary);font-size:.84rem;line-height:1.45}.arlab-hud-progress{height:4px;margin-top:.65rem;background:rgba(255,255,255,.08);overflow:hidden}.arlab-hud-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent-primary),var(--accent-secondary));transition:width .18s ease}
    .arlab-inspector-title{font-family:"Orbitron",sans-serif;font-size:1rem;letter-spacing:1px;margin-bottom:.5rem}.arlab-inspector-role{font-family:"JetBrains Mono",monospace;font-size:.58rem;color:var(--accent-primary);letter-spacing:1px;text-transform:uppercase;margin-bottom:.45rem}.arlab-inspector-status{font-family:"JetBrains Mono",monospace;font-size:.58rem;color:var(--warning);letter-spacing:1px;text-transform:uppercase;margin-bottom:.9rem}.arlab-inspector-text{color:var(--text-secondary);font-size:.9rem;line-height:1.85}.arlab-demo-note,.arlab-privacy-note{margin-top:.8rem;padding:.8rem;border:1px solid var(--border-subtle);background:rgba(0,0,0,.22);color:var(--text-secondary);font-size:.78rem;line-height:1.65}.arlab-privacy-note strong{color:var(--accent-secondary);font-family:"JetBrains Mono",monospace;font-size:.62rem;letter-spacing:1px;text-transform:uppercase}
    .arlab-ghost-cursor{position:absolute;width:22px;height:22px;border-radius:50%;border:1px solid rgba(0,212,255,.92);box-shadow:0 0 18px rgba(0,212,255,.35);transform:translate(-50%,-50%) scale(.82);opacity:0;z-index:9;pointer-events:none;transition:opacity .16s ease,transform .16s ease,border-color .16s ease}.arlab-ghost-cursor.active{opacity:1}.arlab-ghost-cursor.grab{transform:translate(-50%,-50%) scale(1.25);border-color:rgba(0,255,136,.95);box-shadow:0 0 24px rgba(0,255,136,.45)}.arlab-part.active{transform:translateX(4px);border-color:rgba(0,212,255,.5)!important;background:rgba(0,212,255,.08)!important}
    @media(max-width:900px){.arlab-upgrade-status,.arlab-gesture-hud{grid-template-columns:1fr}}
  `;
  document.head.appendChild(s);
}

function buildUpgradeUI() {
  injectCSS();
  const controls = document.querySelector(".arlab-controls");
  if (controls && !$("arDemoBtn")) {
    const b = document.createElement("button");
    b.id = "arDemoBtn";
    b.type = "button";
    b.className = "arlab-btn arlab-btn-demo";
    b.textContent = "DEMO MODE";
    controls.appendChild(b);
  }
  if (viewport && !$("arGestureHud")) {
    const ghost = document.createElement("div");
    ghost.id = "arGhostCursor";
    ghost.className = "arlab-ghost-cursor";
    viewport.appendChild(ghost);
    const h = document.createElement("div");
    h.id = "arGestureHud";
    h.className = "arlab-gesture-hud";
    h.innerHTML = `<div class="arlab-hud-card"><div class="arlab-hud-title" id="arHudTitle">Interaction Guide</div><div class="arlab-hud-text" id="arHudText">Premi START AR oppure DEMO MODE.</div></div><div class="arlab-hud-card"><div class="arlab-hud-title">Explode / Inspection Progress</div><div class="arlab-hud-text">Una mano: grab. Due mani: explode. Demo: tour automatico.</div><div class="arlab-hud-progress"><span id="arHudProgress"></span></div></div>`;
    viewport.appendChild(h);
  }
  if (sidebar && !$("arUpgradeStatusCard")) {
    const card = document.createElement("div");
    card.className = "arlab-info-card";
    card.id = "arUpgradeStatusCard";
    card.innerHTML = `<div class="arlab-info-title">Interaction Status</div><div class="arlab-upgrade-status"><div class="arlab-upgrade-stat"><span>Camera</span><strong id="arStatusCamera">OFF</strong></div><div class="arlab-upgrade-stat"><span>Tracking</span><strong id="arStatusTracking">OFF</strong></div><div class="arlab-upgrade-stat"><span>Hands</span><strong id="arStatusHands">0</strong></div><div class="arlab-upgrade-stat"><span>Gesture</span><strong id="arStatusGesture">IDLE</strong></div><div class="arlab-upgrade-stat"><span>Model</span><strong id="arStatusModel">ASSEMBLED</strong></div><div class="arlab-upgrade-stat"><span>Selected</span><strong id="arStatusSelected">None</strong></div></div><div class="arlab-demo-note">Local browser digital twin demo. This is not real hardware control yet.</div>`;
    sidebar.insertBefore(card, sidebar.children[1] || null);
  }
  if (sidebar && !$("arPartInspector")) {
    const ins = document.createElement("div");
    ins.className = "arlab-info-card";
    ins.id = "arPartInspector";
    ins.innerHTML = `<div class="arlab-info-title">Selected Component</div><div class="arlab-inspector-title" id="arInspectorTitle">MicroBot Assembly</div><div class="arlab-inspector-role" id="arInspectorRole">Full digital twin view</div><div class="arlab-inspector-status" id="arInspectorStatus">Local interactive demo</div><p class="arlab-inspector-text" id="arInspectorText">Start the AR Lab or activate Demo Mode. When a component is selected, this panel explains its role inside the MicroBot architecture.</p><div class="arlab-privacy-note"><strong>Privacy</strong><br>Camera frames are processed locally in the browser. No video upload is performed by this static GitHub Pages demo.</div>`;
    const partsCard = document.querySelector(".arlab-parts-list")?.closest(".arlab-info-card");
    if (partsCard) sidebar.insertBefore(ins, partsCard);
    else sidebar.appendChild(ins);
  }
  ui = {
    demoBtn: $("arDemoBtn"), cam: $("arStatusCamera"), track: $("arStatusTracking"), hands: $("arStatusHands"), gest: $("arStatusGesture"), model: $("arStatusModel"), sel: $("arStatusSelected"),
    hudTitle: $("arHudTitle"), hudText: $("arHudText"), hudProgress: $("arHudProgress"), ghost: $("arGhostCursor"),
    title: $("arInspectorTitle"), role: $("arInspectorRole"), status: $("arInspectorStatus"), text: $("arInspectorText")
  };
  document.querySelectorAll(".arlab-part").forEach((el) => {
    el.addEventListener("click", () => selectPart(partOrder.indexOf(el.dataset.part), true));
  });
}

function hud(title, text, progress = explode) {
  setText(ui.hudTitle, title);
  setText(ui.hudText, text);
  if (ui.hudProgress) ui.hudProgress.style.width = `${Math.round(clamp(progress, 0, 1) * 100)}%`;
}

function status() {
  setText(ui.cam, demo ? "DEMO" : stream ? "ON" : "OFF");
  setText(ui.track, demo ? "DEMO PLAYBACK" : running ? "ACTIVE" : "OFF");
  setText(ui.hands, `${hands.count}`);
  setText(ui.gest, gesture);
  setText(ui.model, explode > .72 ? "EXPLODED" : explode > .12 ? "INSPECTION" : "ASSEMBLED");
  setText(ui.sel, selected >= 0 ? partInfo[parts[selected]?.label]?.[0] || parts[selected]?.label : "None");
}

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  camera3d = new THREE.PerspectiveCamera(50, 1, .1, 100);
  camera3d.position.set(0, 0, 5);
  scene.add(new THREE.AmbientLight(0xffffff, .38));
  [[0xffffff,.9,3,5,4],[0x00d4ff,.45,-3,-2,2],[0xff6b9d,.22,-4,3,-3]].forEach(([c,i,x,y,z]) => {
    const l = new THREE.DirectionalLight(c, i);
    l.position.set(x, y, z);
    scene.add(l);
  });
  const p = new THREE.PointLight(0x00ff88, .35, 8);
  p.position.set(0, -3, 0);
  scene.add(p);
  buildModel();
  buildEffects();
  resize();
  selectPart(-1);
}

function resize() {
  if (!renderer) return;
  const r = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(Math.max(1, r.width), Math.max(1, r.height));
  camera3d.aspect = Math.max(1, r.width) / Math.max(1, r.height);
  camera3d.updateProjectionMatrix();
}

const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color:c, metalness:o.m ?? .3, roughness:o.r ?? .5, transparent:o.a != null, opacity:o.a ?? 1, side:o.d ? THREE.DoubleSide : THREE.FrontSide });
const em = (c, e, i = .6) => new THREE.MeshStandardMaterial({ color:c, metalness:.1, roughness:.3, emissive:new THREE.Color(e), emissiveIntensity:i });

function add(mesh, home, exploded, label) {
  const h = new THREE.Vector3(...home);
  const ex = new THREE.Vector3(...exploded);
  mesh.position.copy(h);
  scene.add(mesh);
  parts.push({ mesh, home:h, exploded:ex, label });
}

function gear(radius, teeth, thick, color) {
  const sh = new THREE.Shape();
  const inn = radius * .7;
  for (let i = 0; i < teeth; i++) {
    const a1 = i / teeth * TAU, a2 = (i + .3) / teeth * TAU, a3 = (i + .5) / teeth * TAU, a4 = (i + .8) / teeth * TAU;
    sh[i ? "lineTo" : "moveTo"](Math.cos(a1) * inn, Math.sin(a1) * inn);
    sh.lineTo(Math.cos(a2) * radius, Math.sin(a2) * radius);
    sh.lineTo(Math.cos(a3) * radius, Math.sin(a3) * radius);
    sh.lineTo(Math.cos(a4) * inn, Math.sin(a4) * inn);
  }
  sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth:thick, bevelEnabled:false });
  g.center();
  return new THREE.Mesh(g, mat(color, { m:.8, r:.2 }));
}

function buildModel() {
  parts.length = 0;
  add(new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.9,48,1,true), mat(0x00d4ff,{m:.7,r:.2,a:.55,d:true})), [0,0,0], [0,2.2,0], "shell");
  add(new THREE.Mesh(new THREE.SphereGeometry(.55,48,24,0,TAU,0,Math.PI/2), mat(0x00b8d9,{m:.6,r:.25,a:.6})), [0,.45,0], [0,3.2,.5], "dome");
  add(new THREE.Mesh(new THREE.CylinderGeometry(.55,.52,.08,48), mat(0x0a2a3a,{m:.8,r:.15})), [0,-.45,0], [0,-2.8,0], "bottomCap");
  const c1 = new THREE.Mesh(new THREE.TorusGeometry(.32,.05,16,48), mat(0xff8a3d,{m:.7,r:.3})); c1.rotation.x = Math.PI/2; add(c1, [0,.1,0], [-2,.8,0], "coilPrimary");
  const c2 = new THREE.Mesh(new THREE.TorusGeometry(.25,.04,16,48), mat(0xffa726,{m:.6,r:.35})); c2.rotation.x = Math.PI/2; add(c2, [0,-.1,0], [-2,-.5,.5], "coilSecondary");
  add(new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.55,24), mat(0xff4d6a,{m:.85,r:.15})), [0,-.05,0], [2,.6,0], "magnetCore");
  add(new THREE.Mesh(new THREE.SphereGeometry(.16,24,12,0,TAU,0,Math.PI/2), em(0xff6b6b,0xff3333,.4)), [0,.22,0], [2,1.5,.4], "poleNorth");
  add(new THREE.Mesh(new THREE.SphereGeometry(.16,24,12,0,TAU,Math.PI/2,Math.PI/2), em(0x6b8fff,0x3366ff,.4)), [0,-.32,0], [2,-.5,.4], "poleSouth");
  add(new THREE.Mesh(new THREE.BoxGeometry(.65,.05,.45), mat(0x00c853,{m:.15,r:.7})), [0,.22,0], [0,-2,1], "pcb");
  add(new THREE.Mesh(new THREE.BoxGeometry(.18,.04,.14), mat(0x1a1a2e,{m:.3,r:.5})), [.1,.27,.05], [.4,-1.5,1.4], "chip");
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.3,8), mat(0xcccccc,{m:.9,r:.1}));
  const tip = new THREE.Mesh(new THREE.SphereGeometry(.04,12,12), em(0x00ff88,0x00ff88,.8)); tip.position.y = .15; ant.add(tip); add(ant, [.25,.62,.15], [1.5,2.8,.8], "antenna");
  add(new THREE.Mesh(new THREE.BoxGeometry(.3,.12,.2), mat(0xffbe2e,{m:.3,r:.45})), [.15,-.28,0], [1.5,-2,-.5], "battery");
  add(new THREE.Mesh(new THREE.SphereGeometry(.06,16,16), em(0xe040fb,0xe040fb,1)), [0,.52,.38], [-1.5,-1.8,-.5], "ledStatus");
  const sg = new THREE.Group();
  for (let i = 0; i < 3; i++) { const a = i / 3 * TAU; const s = new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.025,12), em(0x00e5ff,0x00e5ff,.6)); s.position.set(Math.cos(a)*.08,0,Math.sin(a)*.08); sg.add(s); }
  sg.add(new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.015,24), mat(0x2a2a3e,{m:.4,r:.4})));
  add(sg, [-.2,.48,.2], [-1.5,2.5,.8], "sensorArray");
  const gg = new THREE.Group(); gg.add(gear(.14,12,.04,0xb0bec5)); const g2 = gear(.09,8,.04,0x90a4ae); g2.position.x = .2; gg.add(g2); gg.rotation.x = Math.PI/2; add(gg, [0,-.15,.3], [-.5,-2.5,-1], "gears");
}

function buildEffects() {
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(450);
  for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() - .5) * 4;
  geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  particles = new THREE.Points(geo, new THREE.PointsMaterial({ size:.035, transparent:true, opacity:.5, color:0x00d4ff, blending:THREE.AdditiveBlending, depthWrite:false }));
  scene.add(particles);
  [0x00d4ff,0x00ff88,0xe040fb].forEach((c,i) => { const r = new THREE.Mesh(new THREE.TorusGeometry(.7+i*.15,.005,8,64), new THREE.MeshBasicMaterial({ color:c, transparent:true, opacity:.25, blending:THREE.AdditiveBlending })); r.userData = { speed:.3+i*.12 }; rings.push(r); scene.add(r); });
  wire = new THREE.Mesh(new THREE.IcosahedronGeometry(.75,1), new THREE.MeshBasicMaterial({ color:0x00d4ff, wireframe:true, transparent:true, opacity:.08, blending:THREE.AdditiveBlending }));
  scene.add(wire);
}

function selectPart(i, force = false) {
  selected = i;
  document.querySelectorAll(".arlab-part").forEach((e, idx) => e.classList.toggle("active", idx === i));
  if (i >= 0 && parts[i]) {
    const d = partInfo[parts[i].label];
    setText(ui.title, d[0]); setText(ui.role, d[1]); setText(ui.status, d[2]); setText(ui.text, d[3]);
    if (force) targetExplode = Math.max(targetExplode, .85);
  } else {
    setText(ui.title, "MicroBot Assembly"); setText(ui.role, "Full digital twin view"); setText(ui.status, "Local interactive demo");
    setText(ui.text, "Start the AR Lab or activate Demo Mode. When a component is selected, this panel explains its role inside the MicroBot architecture.");
  }
  status();
}

async function initHands() {
  if (handLandmarker) return;
  setText(baseUI.tracking, "Loading...");
  const v = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
  handLandmarker = await HandLandmarker.createFromOptions(v, { baseOptions:{ modelAssetPath:"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task" }, runningMode:"VIDEO", numHands:2, minHandDetectionConfidence:.6, minHandPresenceConfidence:.6, minTrackingConfidence:.5 });
}

async function initCamera() {
  stream = await navigator.mediaDevices.getUserMedia({ video:{ width:{ideal:1280}, height:{ideal:720}, facingMode:"user" }, audio:false });
  video.srcObject = stream;
  await video.play();
}

function pinchDistance(lm) { const a = lm[4], b = lm[8]; return Math.hypot(a.x-b.x, a.y-b.y, (a.z||0)-(b.z||0)); }
function pinchState(prev, d) { return prev ? d < PINCH_OFF : d < PINCH_ON; }
function palm(lm) { const p = [lm[0], lm[5], lm[17]]; return { x:p.reduce((s,v)=>s+v.x,0)/3, y:p.reduce((s,v)=>s+v.y,0)/3 }; }
function span(a,b) { const x = palm(a), y = palm(b); return Math.hypot(x.x-y.x, x.y-y.y); }

function processHands(res) {
  hands.count = res.landmarks?.length || 0;
  hands.left = hands.right = null;
  let lp = false, rp = false;
  (res.landmarks || []).forEach((lm, i) => {
    const side = res.handedness?.[i]?.[0]?.categoryName?.toUpperCase();
    const d = pinchDistance(lm);
    if (side === "LEFT") { hands.right = lm; rp = pinchState(pinch.right, d); }
    else { hands.left = lm; lp = pinchState(pinch.left, d); }
  });
  pinch.left = lp; pinch.right = rp;
  setText(baseUI.hands, `${hands.count} HAND${hands.count !== 1 ? "S" : ""}`);
}

function ghostAt(lm, grab = false) {
  if (!ui.ghost || !viewport || !lm) { ui.ghost?.classList.remove("active", "grab"); return; }
  const r = viewport.getBoundingClientRect();
  const t = lm[8];
  ui.ghost.style.left = `${(1-t.x)*r.width}px`;
  ui.ghost.style.top = `${t.y*r.height}px`;
  ui.ghost.classList.add("active");
  ui.ghost.classList.toggle("grab", grab);
}

function nearest(x, y) {
  let id = -1, m = 1e9;
  parts.forEach((p, i) => { const d = Math.hypot(p.mesh.position.x-x, p.mesh.position.y-y); if (d < m) { m = d; id = i; } });
  return { id, m };
}

function interact() {
  if (demo) return;
  const both = pinch.left && pinch.right && hands.left && hands.right;
  const one = (pinch.left && hands.left) || (pinch.right && hands.right);
  if (both) {
    targetExplode = clamp(span(hands.left, hands.right) / .45, 0, 1);
    gesture = "EXPLODE"; setText(baseUI.gesture, "EXPLODE"); setText(baseUI.modeText, "Scomposto"); setText(baseUI.mode, "EXPLODE");
    hud("Two-Hand Explode", "Allontana o avvicina le mani per controllare la scomposizione del MicroBot.", targetExplode);
    ghostAt(hands.left, true); return;
  }
  if (one) {
    const lm = pinch.left ? hands.left : hands.right;
    const t = lm[8]; const x = ((1-t.x)*2-1)*3; const y = -(t.y*2-1)*2.2;
    if (explode > .3) { const n = nearest(x, y); if (n.id >= 0 && n.m < 2) { parts[n.id].mesh.position.x = lerp(parts[n.id].mesh.position.x, x, .15); parts[n.id].mesh.position.y = lerp(parts[n.id].mesh.position.y, y, .15); selectPart(n.id); } }
    else parts.forEach(p => { p.mesh.position.x = lerp(p.mesh.position.x, p.home.x + x, .12); p.mesh.position.y = lerp(p.mesh.position.y, p.home.y + y, .12); });
    gesture = "GRAB"; setText(baseUI.gesture, "GRAB"); setText(baseUI.mode, "GRAB");
    hud("One-Hand Grab", "Stai controllando il modello con indice e pollice. In modalità esplosa puoi selezionare un componente.", explode);
    ghostAt(lm, true); return;
  }
  targetExplode = Math.max(0, targetExplode - .008);
  gesture = hands.count ? "OPEN" : "IDLE";
  setText(baseUI.gesture, hands.count ? "OPEN" : "—"); setText(baseUI.modeText, explode > .1 ? "Scomposto" : "Assemblato"); setText(baseUI.mode, hands.count ? "TRACKING" : "IDLE");
  ghostAt(hands.left || hands.right, false);
  hud(hands.count ? "Tracking Active" : "Waiting for Hands", hands.count ? "Pizzica indice e pollice per afferrare. Usa due mani per scomporre il MicroBot." : "Mostra una mano alla camera oppure usa DEMO MODE.", explode);
}

function demoStep(t) {
  if (!demo) return;
  targetExplode = .25 + (Math.sin(t*.55)+1) * .375;
  gesture = "DEMO TOUR";
  const i = Math.floor((t*.55) % parts.length);
  if (i !== selected) selectPart(i);
  setText(baseUI.mode, "DEMO"); setText(baseUI.gesture, "DEMO TOUR"); setText(baseUI.modeText, targetExplode > .6 ? "Scomposto" : "Ispezione");
  hud("Demo Mode", "Tour automatico del modello: il MicroBot viene scomposto e i componenti vengono spiegati senza webcam.", targetExplode);
  ghostAt(null);
}

function animate() {
  if (!running && !demo) return;
  raf = requestAnimationFrame(animate);
  const now = performance.now(); setText(baseUI.fps, `${Math.round(1000/Math.max(1, now-last))} FPS`); last = now;
  const dt = clock.getDelta(), t = clock.getElapsedTime();
  if (running && !demo && handLandmarker && video.readyState >= 2) processHands(handLandmarker.detectForVideo(video, now));
  demoStep(t); interact(); explode = lerp(explode, targetExplode, .06);
  parts.forEach((p, i) => { if (!demo && (pinch.left || pinch.right)) return; const v = new THREE.Vector3().lerpVectors(p.home, p.exploded, explode); p.mesh.position.lerp(v, .06); p.mesh.rotation.y += demo ? .006 : (1-explode)*.003+.001; if (i === selected) p.mesh.rotation.x += .003; });
  if (particles) particles.rotation.y += dt*.08;
  rings.forEach((r, i) => { r.rotation[["x","y","z"][i]] = t*r.userData.speed; r.scale.setScalar(1+explode*.8); });
  if (wire) { wire.rotation.x = t*.15; wire.rotation.y = t*.1; wire.scale.setScalar(1+explode*.55); wire.material.opacity = .06+explode*.08; }
  const gearPart = parts.find(p => p.label === "gears"); if (gearPart) { gearPart.mesh.children[0].rotation.z += dt*2; if (gearPart.mesh.children[1]) gearPart.mesh.children[1].rotation.z -= dt*3; }
  status(); renderer.render(scene, camera3d);
}

async function start() {
  if (running) return;
  try {
    stopDemo(false); instructions?.classList.add("hidden"); if (!renderer) initThree(); await initHands(); await initCamera(); running = true;
    setText(baseUI.camera, "ON"); setText(baseUI.tracking, "ACTIVE"); gesture = "WAITING";
    hud("Camera Active", "Mostra una mano alla camera. Pizzica per afferrare, usa due mani per scomporre.", explode); resize(); animate();
  } catch (e) {
    console.error(e); setText(baseUI.camera, "ERROR"); setText(baseUI.tracking, "ERROR"); gesture = "ERROR";
    hud("Camera Error", "La camera non è disponibile. Usa DEMO MODE per esplorare comunque il modello.", explode); instructions?.classList.remove("hidden");
  }
}

function stop() {
  running = false;
  if (raf && !demo) { cancelAnimationFrame(raf); raf = null; }
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  video.srcObject = null; hands.count = 0; hands.left = hands.right = null; pinch.left = pinch.right = false;
  setText(baseUI.camera, "OFF"); setText(baseUI.tracking, "OFF"); setText(baseUI.gesture, "—"); setText(baseUI.mode, demo ? "DEMO" : "IDLE"); setText(baseUI.hands, "0 HANDS");
  if (!demo) instructions?.classList.remove("hidden"); gesture = "IDLE"; status();
}

function reset() { targetExplode = explode = 0; parts.forEach(p => p.mesh.position.copy(p.home)); selectPart(-1); setText(baseUI.modeText, "Assemblato"); hud("Reset Complete", "Il modello è tornato assemblato. Puoi riattivare DEMO MODE o usare la camera.", 0); }
function startDemo() { if (!renderer) initThree(); stop(); demo = true; instructions?.classList.add("hidden"); ui.demoBtn?.classList.add("active"); setText(baseUI.camera,"DEMO"); setText(baseUI.tracking,"DEMO"); setText(baseUI.hands,"0 HANDS"); gesture = "DEMO TOUR"; resize(); animate(); }
function stopDemo(resetUI = true) { demo = false; ui.demoBtn?.classList.remove("active"); if (resetUI) { setText(baseUI.camera, stream ? "ON" : "OFF"); setText(baseUI.tracking, running ? "ACTIVE" : "OFF"); gesture = "IDLE"; } }
function toggleDemo() { if (demo) { stopDemo(true); reset(); if (raf && !running) { cancelAnimationFrame(raf); raf = null; } instructions?.classList.remove("hidden"); } else startDemo(); }

buildUpgradeUI(); hud("Interaction Guide", "Premi START AR per usare la camera oppure DEMO MODE per vedere la scomposizione senza webcam.", 0); status();
startBtn?.addEventListener("click", start); stopBtn?.addEventListener("click", stop); resetBtn?.addEventListener("click", reset); ui.demoBtn?.addEventListener("click", toggleDemo); window.addEventListener("resize", resize);
