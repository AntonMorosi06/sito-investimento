/* MicroBot AR Interaction Lab — upgraded public demo
   Local camera processing, gesture HUD, demo mode, part inspector, detailed 15-part 3D MicroBot rendering. */

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
  shell: ["Outer Shell", "Protective body", "Digital concept", "Transparent reinforced shell with rim rings, vertical ribs and inspection panels. It communicates the external mechanical envelope of the MicroBot unit."],
  dome: ["Upper Dome", "Top cap / orientation layer", "Digital concept", "Upper cap with visual sensor windows and orientation markers for future perception, lighting or status modules."],
  bottomCap: ["Bottom Cap", "Base plate", "Digital concept", "Lower contact plate with landing pads and structural interface marks for surface interaction and internal stack closure."],
  coilPrimary: ["Primary Coil", "Main electromagnetic actuator", "Simulation target", "Multi-winding primary coil used to visualize attraction, repulsion and docking experiments. Real magnetic force still requires physical validation."],
  coilSecondary: ["Secondary Coil", "Auxiliary winding", "Simulation target", "Secondary winding layer for visualizing multi-state field control, polarity switching and future axis separation."],
  magnetCore: ["Magnet Core", "Permanent magnetic reference", "Simulation target", "Central magnetic core with polarity bands used to explain alignment, docking and field interaction logic."],
  poleNorth: ["North Pole", "Polarity marker", "Educational marker", "Visible north-pole marker for explaining magnetic orientation and polarity-dependent docking behavior."],
  poleSouth: ["South Pole", "Polarity marker", "Educational marker", "Visible south-pole marker for explaining attraction, repulsion and stable alignment states."],
  pcb: ["Main PCB", "Embedded electronics carrier", "Planned hardware", "Detailed board render with traces, test pads and bus lines for MCU, coil drivers, sensors and telemetry routing."],
  chip: ["ESP32 Control Core", "Embedded processing", "Firmware-ready target", "ESP32-style control package with pins and package outline for commands, telemetry, safety state and node behavior."],
  antenna: ["Wireless Antenna", "Communication interface", "Planned network layer", "Wireless antenna render for future ESP-NOW or similar low-latency controller/node communication experiments."],
  battery: ["LiPo Battery", "Energy source", "Design target", "Local energy block with terminal markers. Real implementation needs charging, protection, current and thermal safety."],
  ledStatus: ["RGB Status LED", "Visible feedback", "Prototype-friendly", "Glowing status indicator for node state, errors, connection state and early hardware demonstrations."],
  sensorArray: ["Sensor Array", "Perception inputs", "Planned sensing layer", "Multi-lens sensor array representing proximity, orientation, magnetic or environmental feedback channels."],
  gears: ["Micro Gear Mechanism", "Mechanical concept", "Concept visual", "Mechanical detail included to communicate possible actuation, transmission or internal kinematic layers."],
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
  document.querySelectorAll(".arlab-part").forEach((el) => el.addEventListener("click", () => selectPart(partOrder.indexOf(el.dataset.part), true)));
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
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
  if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.035);
  clock = new THREE.Clock();
  camera3d = new THREE.PerspectiveCamera(48, 1, .1, 100);
  camera3d.position.set(0, 0, 5.2);

  scene.add(new THREE.AmbientLight(0xffffff, .32));
  [[0xffffff,1.05,3,5,4],[0x00d4ff,.7,-3,-2,2],[0xff6b9d,.32,-4,3,-3],[0x00ff88,.28,0,-3,2]].forEach(([c,i,x,y,z]) => {
    const l = new THREE.DirectionalLight(c, i);
    l.position.set(x, y, z);
    scene.add(l);
  });
  const coreLight = new THREE.PointLight(0x00d4ff, .55, 5.5);
  coreLight.position.set(0, .25, 1.6);
  scene.add(coreLight);

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

const mat = (c, o = {}) => new THREE.MeshStandardMaterial({
  color: c,
  metalness: o.m ?? .3,
  roughness: o.r ?? .5,
  transparent: o.a != null,
  opacity: o.a ?? 1,
  side: o.d ? THREE.DoubleSide : THREE.FrontSide,
  emissive: o.e ? new THREE.Color(o.e) : new THREE.Color(0x000000),
  emissiveIntensity: o.ei ?? 0,
});
const em = (c, e, i = .6) => mat(c, { m:.1, r:.28, e, ei:i });

function edge(mesh, color = 0x9beeff, opacity = .2) {
  if (!mesh.geometry) return;
  const eg = new THREE.EdgesGeometry(mesh.geometry, 18);
  const ln = new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color, transparent:true, opacity }));
  mesh.add(ln);
}

function add(mesh, home, exploded, label) {
  const h = new THREE.Vector3(...home);
  const ex = new THREE.Vector3(...exploded);
  mesh.position.copy(h);
  mesh.traverse((o) => { if (o.isMesh) { o.userData.microbotLabel = label; } });
  scene.add(mesh);
  parts.push({ mesh, home:h, exploded:ex, label });
}

function box(w,h,d,c,o={}) { const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat(c,o)); edge(m, o.edge ?? 0x9beeff, o.edgeOpacity ?? .12); return m; }
function cyl(r1,r2,h,seg,c,o={}) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg), mat(c,o)); edge(m, o.edge ?? 0x9beeff, o.edgeOpacity ?? .12); return m; }
function torus(r,t,c,o={}) { const m = new THREE.Mesh(new THREE.TorusGeometry(r,t,12,96), mat(c,o)); m.rotation.x = Math.PI/2; return m; }

function textPlane(text, w=.28, h=.08, fg="#ffffff", bg="rgba(0,0,0,0)") {
  const cnv = document.createElement("canvas");
  cnv.width = 512; cnv.height = 160;
  const ctx = cnv.getContext("2d");
  ctx.clearRect(0,0,cnv.width,cnv.height);
  ctx.fillStyle = bg; ctx.fillRect(0,0,cnv.width,cnv.height);
  ctx.font = "700 46px JetBrains Mono, monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillStyle = fg; ctx.fillText(text, cnv.width/2, cnv.height/2);
  const tex = new THREE.CanvasTexture(cnv);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({ map:tex, transparent:true, side:THREE.DoubleSide }));
  return m;
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
  const m = new THREE.Mesh(g, mat(color, { m:.8, r:.2 }));
  edge(m, 0xffffff, .18);
  return m;
}

function createShell() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.56,.54,.92,72,1,true), mat(0x00d4ff,{m:.65,r:.18,a:.42,d:true,e:0x002b38,ei:.18}));
  edge(body, 0x9beeff, .24); g.add(body);
  [-.46,.46].forEach((y) => { const r = torus(.56,.014,0x9beeff,{m:.55,r:.18,e:0x00d4ff,ei:.1}); r.position.y = y; g.add(r); });
  for (let i=0;i<12;i++) { const a=i/12*TAU; const rib=cyl(.007,.007,.86,8,0x8be9ff,{m:.55,r:.22,a:.72,e:0x00d4ff,ei:.08}); rib.position.set(Math.cos(a)*.565,0,Math.sin(a)*.565); g.add(rib); }
  for (let i=0;i<6;i++) { const a=i/6*TAU; const p=box(.12,.006,.055,0xdff8ff,{m:.25,r:.18,a:.38,edgeOpacity:.08}); p.position.set(Math.cos(a)*.565,.08,Math.sin(a)*.565); p.rotation.y = -a; g.add(p); }
  return g;
}

function createDome() {
  const g = new THREE.Group();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(.55,72,32,0,TAU,0,Math.PI/2), mat(0x00b8d9,{m:.58,r:.2,a:.58,d:true,e:0x00384d,ei:.15}));
  edge(dome,0x9beeff,.18); g.add(dome);
  const rim = torus(.55,.012,0x00d4ff,{m:.55,r:.2,e:0x00d4ff,ei:.18}); g.add(rim);
  for (let i=0;i<3;i++) { const a=i/3*TAU+Math.PI/6; const lens=cyl(.035,.035,.014,18,0x0b1120,{m:.25,r:.08,e:0x00e5ff,ei:.55}); lens.rotation.x=Math.PI/2; lens.position.set(Math.cos(a)*.28,.31,Math.sin(a)*.28); g.add(lens); }
  const label = textPlane("TOP", .22, .06, "#9beeff"); label.position.set(0,.56,.12); label.rotation.x = -Math.PI/2; g.add(label);
  return g;
}

function createBottomCap() {
  const g = new THREE.Group();
  const base = cyl(.55,.52,.08,72,0x0a2a3a,{m:.86,r:.14,edge:0x00d4ff,edgeOpacity:.18}); g.add(base);
  for (let i=0;i<6;i++) { const a=i/6*TAU; const pad=cyl(.055,.055,.012,20,0x1d2d3a,{m:.72,r:.18,edge:0x00ff88,edgeOpacity:.16}); pad.position.set(Math.cos(a)*.34,.055,Math.sin(a)*.34); g.add(pad); }
  const axis = torus(.24,.004,0x00ff88,{m:.2,r:.2,a:.75,e:0x00ff88,ei:.18}); axis.position.y=.06; g.add(axis);
  return g;
}

function createCoil(radius, turns, color, coreColor) {
  const g = new THREE.Group();
  for (let i=0;i<turns;i++) { const ring = torus(radius + Math.sin(i*.7)*.006, .010, color, {m:.75,r:.24,e:color,ei:.06}); ring.position.y = (i-(turns-1)/2)*.028; ring.rotation.z = i*.17; g.add(ring); }
  const core = cyl(radius*.34,radius*.34,.18,32,coreColor,{m:.7,r:.22,edge:0xffffff,edgeOpacity:.16}); core.rotation.x = Math.PI/2; g.add(core);
  const flux = torus(radius+.09,.004,0x00d4ff,{a:.45,e:0x00d4ff,ei:.3}); flux.scale.set(1,1,.55); g.add(flux);
  return g;
}

function createMagnetCore() {
  const g = new THREE.Group();
  const core = cyl(.15,.15,.56,36,0x323b52,{m:.86,r:.14,edge:0xffffff,edgeOpacity:.18}); g.add(core);
  const n = cyl(.153,.153,.18,36,0xff4d6a,{m:.72,r:.18,e:0xff3333,ei:.2}); n.position.y=.19; g.add(n);
  const s = cyl(.153,.153,.18,36,0x4d72ff,{m:.72,r:.18,e:0x3366ff,ei:.2}); s.position.y=-.19; g.add(s);
  const stripe = torus(.153,.006,0xffffff,{m:.2,r:.2,a:.5}); stripe.position.y=0; g.add(stripe);
  return g;
}

function createPCB() {
  const g = new THREE.Group();
  const board = box(.68,.055,.46,0x00a65a,{m:.18,r:.62,edge:0x00ff88,edgeOpacity:.22}); g.add(board);
  const traceMat = {m:.55,r:.28,e:0xffbe2e,ei:.08,edge:0xffbe2e,edgeOpacity:.05};
  [[-.18,.035,-.12,.28,.01,.014],[.12,.035,-.08,.22,.01,.014],[0,.035,.08,.42,.01,.014],[-.08,.035,.18,.16,.01,.014],[.25,.035,.12,.01,.01,.18],[-.3,.035,0,.01,.01,.28]].forEach(([x,y,z,w,h,d]) => { const tr=box(w,h,d,0xffc857,traceMat); tr.position.set(x,y,z); g.add(tr); });
  for (let x of [-.28,-.14,0,.14,.28]) for (let z of [-.18,.18]) { const pad=cyl(.018,.018,.009,16,0xd9fff0,{m:.6,r:.18,edgeOpacity:.04}); pad.position.set(x,.043,z); g.add(pad); }
  const label = textPlane("PCB", .18, .055, "#001b10", "rgba(0,255,136,.65)"); label.rotation.x = -Math.PI/2; label.position.set(.2,.046,-.02); g.add(label);
  return g;
}

function createChip() {
  const g = new THREE.Group();
  const pkg = box(.24,.05,.18,0x0b1020,{m:.35,r:.42,edge:0x9beeff,edgeOpacity:.18}); g.add(pkg);
  for (let i=0;i<7;i++) { const z=-.09+i*.03; const p1=box(.035,.012,.006,0xb0bec5,{m:.8,r:.2,edgeOpacity:.02}); p1.position.set(-.14,.003,z); g.add(p1); const p2=p1.clone(); p2.position.x=.14; g.add(p2); }
  const dot = cyl(.015,.015,.006,16,0x00d4ff,{m:.2,r:.2,e:0x00d4ff,ei:.5}); dot.position.set(-.07,.032,.045); g.add(dot);
  const label = textPlane("ESP32", .17, .055, "#9beeff"); label.rotation.x=-Math.PI/2; label.position.set(0,.033,0); g.add(label);
  return g;
}

function createAntenna() {
  const g = new THREE.Group();
  const mast = cyl(.018,.018,.34,12,0xd7dee8,{m:.9,r:.08,edgeOpacity:.05}); g.add(mast);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(.045,18,18), em(0x00ff88,0x00ff88,.8)); tip.position.y=.18; g.add(tip);
  for (let r of [.11,.18,.25]) { const wave=torus(r,.003,0x00ff88,{a:.35,e:0x00ff88,ei:.2}); wave.position.y=.18; wave.scale.y=.35; g.add(wave); }
  return g;
}

function createBattery() {
  const g = new THREE.Group();
  const body = box(.34,.13,.22,0xffbe2e,{m:.35,r:.38,edge:0xffffff,edgeOpacity:.12}); g.add(body);
  const plus = cyl(.025,.025,.018,16,0xff3333,{m:.55,r:.18,e:0xff0000,ei:.18}); plus.rotation.z=Math.PI/2; plus.position.set(.18,.02,.055); g.add(plus);
  const minus = cyl(.025,.025,.018,16,0x20242d,{m:.55,r:.18}); minus.rotation.z=Math.PI/2; minus.position.set(.18,.02,-.055); g.add(minus);
  const label = textPlane("LiPo", .20, .06, "#050508", "rgba(255,255,255,.55)"); label.rotation.x=-Math.PI/2; label.position.set(-.03,.071,0); g.add(label);
  return g;
}

function createLED() {
  const g = new THREE.Group();
  const glow = new THREE.Mesh(new THREE.SphereGeometry(.16,24,24), new THREE.MeshBasicMaterial({color:0xe040fb,transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false})); g.add(glow);
  const led = new THREE.Mesh(new THREE.SphereGeometry(.06,24,24), em(0xe040fb,0xe040fb,1.15)); g.add(led);
  const light = new THREE.PointLight(0xe040fb,.55,1.7); light.position.set(0,0,.08); g.add(light);
  return g;
}

function createSensors() {
  const g = new THREE.Group();
  const base = cyl(.13,.13,.018,32,0x263246,{m:.45,r:.38,edge:0x00e5ff,edgeOpacity:.16}); g.add(base);
  for (let i=0;i<3;i++) { const a=i/3*TAU; const lens=cyl(.033,.033,.03,18,0x071827,{m:.28,r:.12,e:0x00e5ff,ei:.45}); lens.position.set(Math.cos(a)*.078,.025,Math.sin(a)*.078); g.add(lens); const halo=torus(.046,.003,0x00e5ff,{a:.5,e:0x00e5ff,ei:.2}); halo.position.copy(lens.position); g.add(halo); }
  return g;
}

function buildModel() {
  parts.length = 0;
  add(createShell(), [0,0,0], [0,2.2,0], "shell");
  add(createDome(), [0,.45,0], [0,3.2,.5], "dome");
  add(createBottomCap(), [0,-.45,0], [0,-2.8,0], "bottomCap");
  add(createCoil(.32,11,0xff8a3d,0x4a2a16), [0,.1,0], [-2,.8,0], "coilPrimary");
  add(createCoil(.25,9,0xffc04d,0x3e2b12), [0,-.1,0], [-2,-.5,.5], "coilSecondary");
  add(createMagnetCore(), [0,-.05,0], [2,.6,0], "magnetCore");
  add(new THREE.Mesh(new THREE.SphereGeometry(.16,24,12,0,TAU,0,Math.PI/2), em(0xff6b6b,0xff3333,.55)), [0,.22,0], [2,1.5,.4], "poleNorth");
  add(new THREE.Mesh(new THREE.SphereGeometry(.16,24,12,0,TAU,Math.PI/2,Math.PI/2), em(0x6b8fff,0x3366ff,.55)), [0,-.32,0], [2,-.5,.4], "poleSouth");
  add(createPCB(), [0,.22,0], [0,-2,1], "pcb");
  add(createChip(), [.1,.27,.05], [.4,-1.5,1.4], "chip");
  add(createAntenna(), [.25,.62,.15], [1.5,2.8,.8], "antenna");
  add(createBattery(), [.15,-.28,0], [1.5,-2,-.5], "battery");
  add(createLED(), [0,.52,.38], [-1.5,-1.8,-.5], "ledStatus");
  add(createSensors(), [-.2,.48,.2], [-1.5,2.5,.8], "sensorArray");
  const gg = new THREE.Group(); gg.add(gear(.14,12,.04,0xb0bec5)); const g2 = gear(.09,8,.04,0x90a4ae); g2.position.x=.2; gg.add(g2); gg.rotation.x=Math.PI/2; add(gg, [0,-.15,.3], [-.5,-2.5,-1], "gears");
}

function buildEffects() {
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(540);
  for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() - .5) * 4.4;
  geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  particles = new THREE.Points(geo, new THREE.PointsMaterial({ size:.033, transparent:true, opacity:.5, color:0x00d4ff, blending:THREE.AdditiveBlending, depthWrite:false }));
  scene.add(particles);
  rings = [];
  [0x00d4ff,0x00ff88,0xe040fb].forEach((c,i) => { const r = new THREE.Mesh(new THREE.TorusGeometry(.72+i*.18,.005,8,96), new THREE.MeshBasicMaterial({ color:c, transparent:true, opacity:.25, blending:THREE.AdditiveBlending })); r.userData = { speed:.3+i*.12 }; rings.push(r); scene.add(r); });
  wire = new THREE.Mesh(new THREE.IcosahedronGeometry(.82,1), new THREE.MeshBasicMaterial({ color:0x00d4ff, wireframe:true, transparent:true, opacity:.075, blending:THREE.AdditiveBlending }));
  scene.add(wire);
  const grid = new THREE.GridHelper(4.2, 28, 0x00d4ff, 0x223040);
  grid.position.y = -1.25;
  grid.material.transparent = true; grid.material.opacity = .12;
  scene.add(grid);
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
    setText(ui.text, "Start the AR Lab or activate Demo Mode. The upgraded renderer now shows reinforced shell ribs, multi-turn coils, PCB traces, chip pins, battery terminals, sensor lenses and emissive status lighting.");
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
  targetExplode = .32 + (Math.sin(t*.55)+1) * .34;
  gesture = "DEMO TOUR";
  const i = Math.floor((t*.48) % parts.length);
  if (i !== selected) selectPart(i);
  setText(baseUI.mode, "DEMO"); setText(baseUI.gesture, "DEMO TOUR"); setText(baseUI.modeText, targetExplode > .6 ? "Scomposto" : "Ispezione");
  hud("Rendering Demo Mode", "Tour automatico del modello dettagliato: shell, bobine, PCB, ESP32, batteria, sensori e luci emissive.", targetExplode);
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
  if (particles) { particles.rotation.y += dt*.08; particles.material.opacity = .38 + Math.sin(t*2)*.08; }
  rings.forEach((r, i) => { r.rotation[["x","y","z"][i]] = t*r.userData.speed; r.scale.setScalar(1+explode*.9); r.material.opacity = .16 + explode*.12 + Math.sin(t*2+i)*.04; });
  if (wire) { wire.rotation.x = t*.15; wire.rotation.y = t*.1; wire.scale.setScalar(1+explode*.58); wire.material.opacity = .055+explode*.09; }
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
    hud("Camera Error", "La camera non è disponibile. Usa DEMO MODE per esplorare comunque il modello dettagliato.", explode); instructions?.classList.remove("hidden");
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

function reset() { targetExplode = explode = 0; parts.forEach(p => p.mesh.position.copy(p.home)); selectPart(-1); setText(baseUI.modeText, "Assemblato"); hud("Reset Complete", "Il modello dettagliato è tornato assemblato. Puoi riattivare DEMO MODE o usare la camera.", 0); }
function startDemo() { if (!renderer) initThree(); stop(); demo = true; instructions?.classList.add("hidden"); ui.demoBtn?.classList.add("active"); setText(baseUI.camera,"DEMO"); setText(baseUI.tracking,"DEMO"); setText(baseUI.hands,"0 HANDS"); gesture = "DEMO TOUR"; resize(); animate(); }
function stopDemo(resetUI = true) { demo = false; ui.demoBtn?.classList.remove("active"); if (resetUI) { setText(baseUI.camera, stream ? "ON" : "OFF"); setText(baseUI.tracking, running ? "ACTIVE" : "OFF"); gesture = "IDLE"; } }
function toggleDemo() { if (demo) { stopDemo(true); reset(); if (raf && !running) { cancelAnimationFrame(raf); raf = null; } instructions?.classList.remove("hidden"); } else startDemo(); }

buildUpgradeUI(); hud("Interaction Guide", "Premi START AR per usare la camera oppure DEMO MODE per vedere il rendering dettagliato senza webcam.", 0); status();
startBtn?.addEventListener("click", start); stopBtn?.addEventListener("click", stop); resetBtn?.addEventListener("click", reset); ui.demoBtn?.addEventListener("click", toggleDemo); window.addEventListener("resize", resize);
