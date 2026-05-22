/* ═══════════════════════════════════════════════════════════
   AR INTERACTION LAB — ADVANCED
   MediaPipe Hand Tracking + Three.js 3D MicroBot
   ─ Complex model with 15 parts
   ─ Particle effects, energy fields, holographic wireframes
   ─ Glow pulses & animated connections
   ─ One hand pinch  → grab & move assembled model
   ─ Two hands pinch → explode & grab individual parts
═══════════════════════════════════════════════════════════ */

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs";

const $ = id => document.getElementById(id);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const TAU   = Math.PI * 2;

/* ── DOM ── */
const video       = $("arVideo");
const canvas      = $("arCanvas");
const startBtn    = $("arStartBtn");
const stopBtn     = $("arStopBtn");
const resetBtn    = $("arResetBtn");
const instructions = $("arInstructions");

const ui = {
  mode:     $("arModeChip"),
  hands:    $("arHandsChip"),
  fps:      $("arFpsChip"),
  camera:   $("arCameraStatus"),
  tracking: $("arTrackingStatus"),
  gesture:  $("arGestureStatus"),
  modeText: $("arModeStatus"),
};

if (!video || !canvas) throw new Error("AR Lab elements not found");

/* ── State ── */
let handLandmarker = null;
let mediaStream    = null;
let renderer, scene, camera3d, clock;
let running   = false;
let animId    = null;
let lastTime  = performance.now();
let explodeT  = 0;
let targetExplode = 0;

const hands = { left: null, right: null, count: 0 };
const pinch = { left: false, right: false };

/* Effects containers */
let particles       = null;
let energyRings     = [];
let connectionLines = [];
let hologramWire    = null;

/* ═══════════════════════════════════════════════════════════
   THREE.JS SETUP
═══════════════════════════════════════════════════════════ */
const PARTS = [];

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  scene  = new THREE.Scene();
  clock  = new THREE.Clock();

  camera3d = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera3d.position.set(0, 0, 5);

  /* Lights — richer setup */
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.4);
  rimLight.position.set(-3, -2, 2);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0xff6b9d, 0.2);
  fillLight.position.set(-4, 3, -3);
  scene.add(fillLight);

  const bottomLight = new THREE.PointLight(0x00ff88, 0.3, 8);
  bottomLight.position.set(0, -3, 0);
  scene.add(bottomLight);

  buildMicroBot();
  buildEffects();
  resizeRenderer();
}

function resizeRenderer() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width, h = rect.height;
  renderer.setSize(w, h);
  camera3d.aspect = w / h;
  camera3d.updateProjectionMatrix();
}

/* ═══════════════════════════════════════════════════════════
   BUILD MICROBOT MODEL — 15 DETAILED PARTS
═══════════════════════════════════════════════════════════ */
function buildMicroBot() {
  PARTS.length = 0;

  const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({
    color,
    metalness: opts.metal ?? 0.3,
    roughness: opts.rough ?? 0.5,
    transparent: opts.alpha != null,
    opacity: opts.alpha ?? 1,
    side: opts.double ? THREE.DoubleSide : THREE.FrontSide,
  });

  const emissiveMat = (color, emColor, intensity = 0.6) => {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.1,
      roughness: 0.3,
      emissive: new THREE.Color(emColor),
      emissiveIntensity: intensity,
    });
  };

  /* ──────── 1. OUTER SHELL — main cylindrical body ──────── */
  const shell = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.9, 48, 1, true),
    mat(0x00d4ff, { metal: 0.7, rough: 0.2, alpha: 0.55, double: true })
  );
  addPart(shell, [0, 0, 0], [0, 2.2, 0], "shell");

  /* ──────── 2. DOME — top hemispherical cap ──────── */
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 48, 24, 0, TAU, 0, Math.PI / 2),
    mat(0x00b8d9, { metal: 0.6, rough: 0.25, alpha: 0.6 })
  );
  dome.position.y = 0.45;
  addPart(dome, [0, 0.45, 0], [0, 3.2, 0.5], "dome");

  /* ──────── 3. BOTTOM CAP — flat base plate ──────── */
  const bottomCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.52, 0.08, 48),
    mat(0x0a2a3a, { metal: 0.8, rough: 0.15 })
  );
  addPart(bottomCap, [0, -0.45, 0], [0, -2.8, 0], "bottomCap");

  /* ──────── 4. COIL PRIMARY — main electromagnetic coil ──────── */
  const coil1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.05, 16, 48),
    mat(0xff8a3d, { metal: 0.7, rough: 0.3 })
  );
  coil1.rotation.x = Math.PI / 2;
  addPart(coil1, [0, 0.1, 0], [-2.0, 0.8, 0], "coilPrimary");

  /* ──────── 5. COIL SECONDARY — secondary winding ──────── */
  const coil2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.04, 16, 48),
    mat(0xffa726, { metal: 0.6, rough: 0.35 })
  );
  coil2.rotation.x = Math.PI / 2;
  addPart(coil2, [0, -0.1, 0], [-2.0, -0.5, 0.5], "coilSecondary");

  /* ──────── 6. MAGNET CORE — central permanent magnet ──────── */
  const magnet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.55, 24),
    mat(0xff4d6a, { metal: 0.85, rough: 0.15 })
  );
  addPart(magnet, [0, -0.05, 0], [2.0, 0.6, 0], "magnetCore");

  /* ──────── 7. MAGNET POLE NORTH ──────── */
  const poleTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 24, 12, 0, TAU, 0, Math.PI / 2),
    emissiveMat(0xff6b6b, 0xff3333, 0.4)
  );
  addPart(poleTop, [0, 0.22, 0], [2.0, 1.5, 0.4], "poleNorth");

  /* ──────── 8. MAGNET POLE SOUTH ──────── */
  const poleBottom = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 24, 12, 0, TAU, Math.PI / 2, Math.PI / 2),
    emissiveMat(0x6b8fff, 0x3366ff, 0.4)
  );
  addPart(poleBottom, [0, -0.32, 0], [2.0, -0.5, 0.4], "poleSouth");

  /* ──────── 9. PCB — main circuit board ──────── */
  const pcb = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.05, 0.45),
    mat(0x00c853, { metal: 0.15, rough: 0.7 })
  );
  addPart(pcb, [0, 0.22, 0], [0, -2.0, 1.0], "pcb");

  /* ──────── 10. MICROCHIP — ESP32 processor ──────── */
  const chip = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.04, 0.14),
    mat(0x1a1a2e, { metal: 0.3, rough: 0.5 })
  );
  addPart(chip, [0.1, 0.27, 0.05], [0.4, -1.5, 1.4], "chip");

  /* ──────── 11. ANTENNA — wireless module ──────── */
  const antennaBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8),
    mat(0xcccccc, { metal: 0.9, rough: 0.1 })
  );
  const antennaTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 12, 12),
    emissiveMat(0x00ff88, 0x00ff88, 0.8)
  );
  antennaTip.position.y = 0.15;
  antennaBase.add(antennaTip);
  addPart(antennaBase, [0.25, 0.62, 0.15], [1.5, 2.8, 0.8], "antenna");

  /* ──────── 12. BATTERY — LiPo cell ──────── */
  const batt = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.12, 0.2),
    mat(0xffbe2e, { metal: 0.3, rough: 0.45 })
  );
  const termPlus = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8),
    emissiveMat(0xff3333, 0xff0000, 0.5)
  );
  termPlus.position.set(0.15, 0.06, 0);
  termPlus.rotation.z = Math.PI / 2;
  batt.add(termPlus);
  const termMinus = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8),
    mat(0x333333, { metal: 0.5 })
  );
  termMinus.position.set(-0.15, 0.06, 0);
  termMinus.rotation.z = Math.PI / 2;
  batt.add(termMinus);
  addPart(batt, [0.15, -0.28, 0], [1.5, -2.0, -0.5], "battery");

  /* ──────── 13. LED STATUS — RGB indicator ──────── */
  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    emissiveMat(0xe040fb, 0xe040fb, 1.0)
  );
  addPart(led, [0, 0.52, 0.38], [-1.5, -1.8, -0.5], "ledStatus");

  /* ──────── 14. SENSOR ARRAY — 3 tiny sensors on a base ──────── */
  const sensorGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * TAU;
    const sensor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.025, 12),
      emissiveMat(0x00e5ff, 0x00e5ff, 0.6)
    );
    sensor.position.set(Math.cos(angle) * 0.08, 0, Math.sin(angle) * 0.08);
    sensorGroup.add(sensor);
  }
  const sensorBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.015, 24),
    mat(0x2a2a3e, { metal: 0.4, rough: 0.4 })
  );
  sensorGroup.add(sensorBase);
  addPart(sensorGroup, [-0.2, 0.48, 0.2], [-1.5, 2.5, 0.8], "sensorArray");

  /* ──────── 15. GEAR MECHANISM — micro gear pair ──────── */
  const gear1 = createGearMesh(0.14, 12, 0.04, 0xb0bec5);
  const gear2 = createGearMesh(0.09, 8, 0.04, 0x90a4ae);
  gear2.position.set(0.2, 0, 0);
  gear2.rotation.z = Math.PI / 8;
  const gearGroup = new THREE.Group();
  gearGroup.add(gear1);
  gearGroup.add(gear2);
  gearGroup.rotation.x = Math.PI / 2;
  addPart(gearGroup, [0, -0.15, 0.3], [-0.5, -2.5, -1.0], "gears");
}

/* Helper: gear shape via extruded geometry */
function createGearMesh(radius, teeth, thickness, color) {
  const shape = new THREE.Shape();
  const inner = radius * 0.7;

  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * TAU;
    const a2 = ((i + 0.3) / teeth) * TAU;
    const a3 = ((i + 0.5) / teeth) * TAU;
    const a4 = ((i + 0.8) / teeth) * TAU;

    const method = i === 0 ? 'moveTo' : 'lineTo';
    shape[method](Math.cos(a1) * inner, Math.sin(a1) * inner);
    shape.lineTo(Math.cos(a2) * radius, Math.sin(a2) * radius);
    shape.lineTo(Math.cos(a3) * radius, Math.sin(a3) * radius);
    shape.lineTo(Math.cos(a4) * inner, Math.sin(a4) * inner);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  geo.center();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color, metalness: 0.8, roughness: 0.2
  }));
}

function addPart(mesh, home, exploded, label) {
  const homePos     = new THREE.Vector3(...home);
  const explodedPos = new THREE.Vector3(...exploded);
  mesh.position.copy(homePos);
  mesh.userData = { index: PARTS.length, label };
  scene.add(mesh);
  PARTS.push({ mesh, homePos, explodedPos, label, grabbed: false });
}

/* ═══════════════════════════════════════════════════════════
   VISUAL EFFECTS
═══════════════════════════════════════════════════════════ */
function buildEffects() {
  buildParticles();
  buildEnergyRings();
  buildHologramWireframe();
}

/* ── Floating Particles ── */
function buildParticles() {
  const count = 180;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const speeds = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    speeds.push(Math.random() * 0.5 + 0.2);
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData = { speeds };

  const spriteTex = generateGlowTexture();

  particles = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.04,
    map: spriteTex,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0x00d4ff,
  }));
  scene.add(particles);
}

function generateGlowTexture() {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.5)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/* ── Energy Rings ── */
function buildEnergyRings() {
  energyRings = [];
  const ringColors = [0x00d4ff, 0x00ff88, 0xe040fb];

  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.7 + i * 0.15, 0.005, 8, 64),
      new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      })
    );
    ring.userData = { baseRadius: 0.7 + i * 0.15, speed: 0.3 + i * 0.15, axis: i };
    scene.add(ring);
    energyRings.push(ring);
  }
}

/* ── Holographic wireframe overlay ── */
function buildHologramWireframe() {
  hologramWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.75, 1),
    new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(hologramWire);
}

/* ── Connection Lines (visible when exploded) ── */
function updateConnectionLines(t) {
  connectionLines.forEach(l => scene.remove(l));
  connectionLines = [];
  if (t < 0.15) return;

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: Math.min(t * 1.5, 0.35),
    blending: THREE.AdditiveBlending,
  });

  const connections = [
    [0, 1], [0, 2],     // shell → dome, bottom
    [3, 4],              // coils
    [5, 6], [5, 7],     // magnet → poles
    [8, 9], [8, 10],    // pcb → chip, antenna
    [11, 8], [12, 8],   // battery, led → pcb
    [13, 8],             // sensors → pcb
  ];

  connections.forEach(([a, b]) => {
    if (a >= PARTS.length || b >= PARTS.length) return;
    const geo = new THREE.BufferGeometry().setFromPoints([
      PARTS[a].mesh.position.clone(),
      PARTS[b].mesh.position.clone(),
    ]);
    const line = new THREE.Line(geo, lineMat);
    scene.add(line);
    connectionLines.push(line);
  });
}

/* ═══════════════════════════════════════════════════════════
   ANIMATE EFFECTS
═══════════════════════════════════════════════════════════ */
function animateEffects(elapsed, dt) {
  /* Particles: orbit + float */
  if (particles) {
    const pos = particles.geometry.attributes.position;
    const speeds = particles.geometry.userData.speeds;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      const spd = speeds[i];
      const dist = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x) + dt * spd * 0.3;
      x = Math.cos(angle) * dist;
      z = Math.sin(angle) * dist;
      y += Math.sin(elapsed * spd + i) * dt * 0.03;

      if (Math.abs(y) > 2) y *= 0.99;
      if (dist > 2.5) { x *= 0.99; z *= 0.99; }

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;

    particles.material.opacity = 0.3 + Math.sin(elapsed * 2) * 0.15;
    particles.material.color.setRGB(
      lerp(0, 0.9, explodeT),
      lerp(0.83, 0.3, explodeT),
      lerp(1, 0.2, explodeT)
    );
  }

  /* Energy Rings */
  energyRings.forEach((ring, i) => {
    const spd = ring.userData.speed;
    ring.scale.setScalar(1 + explodeT * 1.5);

    if (i === 0) ring.rotation.x = elapsed * spd;
    else if (i === 1) ring.rotation.y = elapsed * spd;
    else ring.rotation.z = elapsed * spd;

    ring.material.opacity = 0.15 + Math.sin(elapsed * 3 + i * 2) * 0.1;

    const targetR = ring.userData.baseRadius + explodeT * 0.8;
    ring.geometry.dispose();
    ring.geometry = new THREE.TorusGeometry(targetR, 0.005, 8, 64);
  });

  /* Hologram wireframe */
  if (hologramWire) {
    hologramWire.rotation.x = elapsed * 0.15;
    hologramWire.rotation.y = elapsed * 0.1;
    hologramWire.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.05 + explodeT * 0.6);
    hologramWire.material.opacity = 0.06 + explodeT * 0.08;
  }

  /* Connection lines */
  updateConnectionLines(explodeT);

  /* Pulsing emissive on parts */
  PARTS.forEach((p, i) => {
    const pulse = val => 0.4 + Math.sin(elapsed * 3 + i * 0.8) * val;
    if (p.mesh.material && p.mesh.material.emissiveIntensity !== undefined) {
      p.mesh.material.emissiveIntensity = pulse(0.3);
    }
    p.mesh.traverse(child => {
      if (child.isMesh && child.material && child.material.emissiveIntensity !== undefined) {
        child.material.emissiveIntensity = pulse(0.4);
      }
    });
  });

  /* Gear rotation */
  const gearPart = PARTS.find(p => p.label === 'gears');
  if (gearPart) {
    if (gearPart.mesh.children[0]) gearPart.mesh.children[0].rotation.z += dt * 2;
    if (gearPart.mesh.children[1]) gearPart.mesh.children[1].rotation.z -= dt * 3;
  }

  /* Antenna blink */
  const antPart = PARTS.find(p => p.label === 'antenna');
  if (antPart && antPart.mesh.children[0] && antPart.mesh.children[0].material) {
    antPart.mesh.children[0].material.emissiveIntensity = Math.sin(elapsed * 8) > 0 ? 1.0 : 0.2;
  }
}

/* ═══════════════════════════════════════════════════════════
   MEDIAPIPE HAND TRACKING
═══════════════════════════════════════════════════════════ */
async function initHandTracking() {
  if (handLandmarker) return;
  setUI("tracking", "Loading...");

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
    },
    runningMode: "VIDEO",
    numHands: 2,
    minHandDetectionConfidence: 0.6,
    minHandPresenceConfidence: 0.6,
    minTrackingConfidence: 0.5,
  });

  setUI("tracking", "Ready");
}

async function initCamera() {
  mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
    audio: false
  });
  video.srcObject = mediaStream;
  await video.play();
  setUI("camera", "ON");
}

/* ═══════════════════════════════════════════════════════════
   GESTURE DETECTION
═══════════════════════════════════════════════════════════ */
function pinchDist(lm) {
  const t = lm[4], i = lm[8];
  return Math.hypot(t.x - i.x, t.y - i.y, (t.z || 0) - (i.z || 0));
}

function palmCenter(lm) {
  const pts = [lm[0], lm[5], lm[17]];
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / 3,
    y: pts.reduce((s, p) => s + p.y, 0) / 3,
    z: pts.reduce((s, p) => s + (p.z || 0), 0) / 3,
  };
}

function handSpan(leftLm, rightLm) {
  const lc = palmCenter(leftLm), rc = palmCenter(rightLm);
  return Math.hypot(lc.x - rc.x, lc.y - rc.y);
}

function processHands(result) {
  hands.count = result.landmarks?.length || 0;
  hands.left = hands.right = null;
  pinch.left = pinch.right = false;

  if (!result.landmarks) return;

  for (let i = 0; i < result.landmarks.length; i++) {
    const lm = result.landmarks[i];
    const side = result.handedness?.[i]?.[0]?.categoryName?.toUpperCase();
    const isPinch = pinchDist(lm) < 0.07;

    if (side === "LEFT") { hands.right = lm; pinch.right = isPinch; }
    else { hands.left = lm; pinch.left = isPinch; }
  }

  updateUI(ui.hands, `${hands.count} HAND${hands.count !== 1 ? "S" : ""}`);
}

/* ═══════════════════════════════════════════════════════════
   INTERACTION LOGIC
═══════════════════════════════════════════════════════════ */
function updateInteraction() {
  const bothPinch = pinch.left && pinch.right && hands.left && hands.right;
  const onePinch  = (pinch.left && hands.left) || (pinch.right && hands.right);

  if (bothPinch) {
    const span = handSpan(hands.left, hands.right);
    targetExplode = clamp(span / 0.45, 0, 1);
    setUI("gesture", "EXPLODE");
    setUI("modeText", "Scomposto");
    updateUI(ui.mode, "EXPLODE");
    return;
  }

  if (onePinch) {
    const activeLm = pinch.left ? hands.left : hands.right;
    const tip = activeLm[8];
    const nx = (1 - tip.x) * 2 - 1;
    const ny = -(tip.y * 2 - 1);
    const targetX = nx * 3;
    const targetY = ny * 2.2;

    if (explodeT > 0.3) {
      let nearest = -1, minD = Infinity;
      PARTS.forEach((p, i) => {
        const d = Math.hypot(p.mesh.position.x - targetX, p.mesh.position.y - targetY);
        if (d < minD) { minD = d; nearest = i; }
      });
      if (nearest >= 0 && minD < 2) {
        PARTS[nearest].mesh.position.x = lerp(PARTS[nearest].mesh.position.x, targetX, 0.15);
        PARTS[nearest].mesh.position.y = lerp(PARTS[nearest].mesh.position.y, targetY, 0.15);
        highlightPart(nearest);
      }
    } else {
      PARTS.forEach(p => {
        p.mesh.position.x = lerp(p.mesh.position.x, p.homePos.x + targetX, 0.12);
        p.mesh.position.y = lerp(p.mesh.position.y, p.homePos.y + targetY, 0.12);
      });
    }

    setUI("gesture", "GRAB");
    updateUI(ui.mode, "GRAB");
    return;
  }

  targetExplode = Math.max(targetExplode - 0.008, 0);
  setUI("gesture", hands.count > 0 ? "OPEN" : "—");
  setUI("modeText", explodeT > 0.1 ? "Scomposto" : "Assemblato");
  updateUI(ui.mode, hands.count > 0 ? "TRACKING" : "IDLE");
}

function highlightPart(index) {
  document.querySelectorAll(".arlab-part").forEach((el, i) => el.classList.toggle("active", i === index));
}

/* ═══════════════════════════════════════════════════════════
   RENDER LOOP
═══════════════════════════════════════════════════════════ */
function frame() {
  if (!running) return;
  animId = requestAnimationFrame(frame);

  const now = performance.now();
  updateUI(ui.fps, `${Math.round(1000 / Math.max(1, now - lastTime))} FPS`);
  lastTime = now;

  const dt = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  if (handLandmarker && video.readyState >= 2) {
    processHands(handLandmarker.detectForVideo(video, now));
  }

  updateInteraction();
  explodeT = lerp(explodeT, targetExplode, 0.06);

  PARTS.forEach(p => {
    if (pinch.left || pinch.right) return;
    const target = new THREE.Vector3().lerpVectors(p.homePos, p.explodedPos, explodeT);
    p.mesh.position.lerp(target, 0.06);
  });

  const rotSpeed = (1 - explodeT) * 0.003 + 0.001;
  PARTS.forEach(p => p.mesh.rotation.y += rotSpeed);

  animateEffects(elapsed, dt);
  renderer.render(scene, camera3d);
}

/* ═══════════════════════════════════════════════════════════
   CONTROLS
═══════════════════════════════════════════════════════════ */
async function start() {
  if (running) return;
  try {
    instructions.classList.add("hidden");
    setUI("tracking", "Loading...");
    await initHandTracking();
    await initCamera();
    if (!renderer) initThree();
    resizeRenderer();
    running = true;
    setUI("camera", "ON");
    setUI("tracking", "ACTIVE");
    frame();
  } catch (err) {
    console.error("AR Lab error:", err);
    setUI("camera", "ERROR");
    setUI("tracking", "ERROR");
    instructions.classList.remove("hidden");
  }
}

function stop() {
  running = false;
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
  video.srcObject = null;
  setUI("camera", "OFF");
  setUI("tracking", "OFF");
  setUI("gesture", "—");
  updateUI(ui.mode, "IDLE");
  updateUI(ui.hands, "0 HANDS");
  instructions.classList.remove("hidden");
}

function reset() {
  explodeT = 0;
  targetExplode = 0;
  PARTS.forEach(p => p.mesh.position.copy(p.homePos));
  setUI("modeText", "Assemblato");
  document.querySelectorAll(".arlab-part").forEach(el => el.classList.remove("active"));
}

function setUI(key, text) { if (ui[key]) ui[key].textContent = text; }
function updateUI(el, text) { if (el) el.textContent = text; }

if (startBtn) startBtn.addEventListener("click", start);
if (stopBtn)  stopBtn.addEventListener("click", stop);
if (resetBtn) resetBtn.addEventListener("click", reset);
window.addEventListener("resize", () => { if (renderer) resizeRenderer(); });
