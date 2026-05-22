import * as vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/+esm";

const { FilesetResolver, HandLandmarker, FaceLandmarker } = vision;
const $ = (id) => document.getElementById(id);
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const neuralCanvas = $("trackingCanvas");
const video = $("handVideo");
const overlay = $("handOverlay");

const startBtn = $("startTracking");
const stopBtn = $("stopTracking");

if (!neuralCanvas || !video || !overlay) {
  throw new Error("Tracking section elements not found.");
}

const nctx = neuralCanvas.getContext("2d");
const octx = overlay.getContext("2d");

const els = {
  gesture: $("trackGesture"),
  openness: $("trackOpenness"),
  landmarks: $("trackLandmarks"),
  camera: $("trackCamera"),
  state: $("trackState"),
  fps: $("trackFps"),
  count: $("trackCount"),
  accuracy: $("trackAccuracy"),
  latency: $("trackLatency"),
  mode: $("trackMode"),
  badge: $("trackingGestureBadge"),
  cameraStatus: $("cameraStatus")
};

const state = {
  hands: [],
  handedness: [],
  face: null,
  headGesture: "HEAD_CENTER",
  gesture: "WAITING",
  openness: 0,
  fps: 0,
  lastFrameTs: performance.now(),
  handLandmarker: null,
  faceLandmarker: null,
  streamReady: false,
  running: false
};

let animationId = null;
let mediaStream = null;

const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20],
  [0,17]
];

function resizeCanvasToElement(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width: rect.width, height: rect.height };
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function handOpenness(landmarks) {
  const wrist = landmarks[0];
  const tips = [4, 8, 12, 16, 20].map((i) => landmarks[i]);
  const avg = tips.reduce((sum, p) => sum + dist(wrist, p), 0) / tips.length;
  return clamp((avg - 0.10) / 0.22, 0, 1);
}

function labelGestureForHand(open) {
  if (open > 0.62) return "OPEN";
  if (open < 0.30) return "CLOSED";
  return "MID";
}

function combinedHandGesture(hands, handedness) {
  if (!hands.length) {
    return { label: "WAITING", openness: 0 };
  }

  const items = hands.map((lm, i) => {
    const open = handOpenness(lm);
    const side = handedness[i]?.[0]?.categoryName || `HAND_${i + 1}`;
    return {
      side: side.toUpperCase(),
      open,
      label: labelGestureForHand(open)
    };
  });

  const avgOpen = items.reduce((s, h) => s + h.open, 0) / items.length;

  if (items.length === 1) {
    return {
      label: `${items[0].side}_${items[0].label}`,
      openness: avgOpen
    };
  }

  const left = items.find((x) => x.side.includes("LEFT"));
  const right = items.find((x) => x.side.includes("RIGHT"));

  const l = left?.label ?? "MID";
  const r = right?.label ?? "MID";

  if (l === "OPEN" && r === "OPEN") {
    return { label: "BOTH_OPEN", openness: avgOpen };
  }
  if (l === "CLOSED" && r === "CLOSED") {
    return { label: "BOTH_CLOSED", openness: avgOpen };
  }

  return {
    label: `${left ? `L_${l}` : ""}${left && right ? " | " : ""}${right ? `R_${r}` : ""}` || "DUAL_HAND",
    openness: avgOpen
  };
}

function estimateHeadGesture(faceLandmarks) {
  if (!faceLandmarks || faceLandmarks.length < 300) return "NO_FACE";

  const nose = faceLandmarks[1];
  const leftCheek = faceLandmarks[234];
  const rightCheek = faceLandmarks[454];
  const forehead = faceLandmarks[10];
  const chin = faceLandmarks[152];

  const faceCenterX = (leftCheek.x + rightCheek.x) * 0.5;
  const faceWidth = Math.max(0.001, Math.abs(rightCheek.x - leftCheek.x));
  const yawNorm = (nose.x - faceCenterX) / faceWidth;

  const faceCenterY = (forehead.y + chin.y) * 0.5;
  const faceHeight = Math.max(0.001, Math.abs(chin.y - forehead.y));
  const pitchNorm = (nose.y - faceCenterY) / faceHeight;

  if (yawNorm < -0.08) return "HEAD_LEFT";
  if (yawNorm > 0.08) return "HEAD_RIGHT";
  if (pitchNorm < -0.10) return "HEAD_UP";
  if (pitchNorm > 0.10) return "HEAD_DOWN";
  return "HEAD_CENTER";
}

function drawConnections(ctx, points, connections, strokeStyle, lineWidth = 1.5) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  for (const [a, b] of connections) {
    const p1 = points[a];
    const p2 = points[b];
    if (!p1 || !p2) continue;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

function drawPoints(ctx, points, fillStyle, radius = 4) {
  ctx.fillStyle = fillStyle;
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFaceOutline(ctx, facePts) {
  const indices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
  ctx.strokeStyle = "rgba(135,206,235,0.75)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  indices.forEach((idx, i) => {
    const p = facePts[idx];
    if (!p) return;
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.stroke();
}

function drawCameraOverlay() {
  const { width: w, height: h } = resizeCanvasToElement(overlay);
  octx.clearRect(0, 0, w, h);

  if (state.face?.length) {
    const facePts = state.face.map((p) => ({
      x: (1 - p.x) * w,
      y: p.y * h
    }));
    drawFaceOutline(octx, facePts);

    const nose = facePts[1];
    if (nose) {
      octx.fillStyle = "rgba(135,206,235,0.95)";
      octx.beginPath();
      octx.arc(nose.x, nose.y, 5, 0, Math.PI * 2);
      octx.fill();
    }
  }

  state.hands.forEach((landmarks, handIndex) => {
    const side = state.handedness[handIndex]?.[0]?.categoryName?.toUpperCase() || "HAND";
    const points = landmarks.map((p) => ({
      x: (1 - p.x) * w,
      y: p.y * h
    }));

    drawConnections(octx, points, HAND_CONNECTIONS, "rgba(255,255,255,0.85)", 2);

    const open = handOpenness(landmarks);
    const fill =
      open > 0.62
        ? "rgba(144,238,144,0.95)"
        : open < 0.30
        ? "rgba(255,107,107,0.95)"
        : "rgba(255,255,255,0.95)";

    drawPoints(octx, points, fill, 4.5);

    const wrist = points[0];
    if (wrist) {
      octx.fillStyle = "rgba(255,255,255,0.9)";
      octx.font = '12px "JetBrains Mono", monospace';
      octx.fillText(side, wrist.x + 10, wrist.y - 10);
    }
  });
}

function drawNeuralDots() {
  const { width: w, height: h } = resizeCanvasToElement(neuralCanvas);
  nctx.clearRect(0, 0, w, h);

  const g = nctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "rgba(255,255,255,0.03)");
  g.addColorStop(1, "rgba(255,255,255,0.00)");
  nctx.fillStyle = g;
  nctx.fillRect(0, 0, w, h);

  nctx.strokeStyle = "rgba(255,255,255,0.04)";
  nctx.lineWidth = 1;
  const step = Math.max(32, Math.floor(w / 12));
  for (let x = 0; x <= w; x += step) {
    nctx.beginPath();
    nctx.moveTo(x, 0);
    nctx.lineTo(x, h);
    nctx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    nctx.beginPath();
    nctx.moveTo(0, y);
    nctx.lineTo(w, y);
    nctx.stroke();
  }

  if (!state.hands.length && !state.face) {
    nctx.fillStyle = "rgba(255,255,255,0.35)";
    nctx.font = '16px "JetBrains Mono", monospace';
    nctx.textAlign = "center";
    nctx.fillText("WAITING FOR FACE / HANDS...", w / 2, h / 2);
    return;
  }

  if (state.face?.length) {
    const facePts = state.face.map((p) => ({
      x: (1 - p.x) * w,
      y: p.y * h
    }));
    drawFaceOutline(nctx, facePts);

    const nose = facePts[1];
    if (nose) {
      nctx.beginPath();
      nctx.arc(nose.x, nose.y, 6, 0, Math.PI * 2);
      nctx.fillStyle = "rgba(135,206,235,0.95)";
      nctx.fill();
      nctx.font = '12px "JetBrains Mono", monospace';
      nctx.fillStyle = "rgba(135,206,235,0.95)";
      nctx.fillText(state.headGesture, nose.x + 12, nose.y - 12);
    }
  }

  state.hands.forEach((landmarks, i) => {
    const points = landmarks.map((p) => ({
      x: (1 - p.x) * w,
      y: p.y * h
    }));

    drawConnections(nctx, points, HAND_CONNECTIONS, "rgba(255,255,255,0.20)", 1.2);

    const side = state.handedness[i]?.[0]?.categoryName?.toUpperCase() || `HAND_${i + 1}`;
    const open = handOpenness(landmarks);
    const fill =
      open > 0.62
        ? "rgba(144,238,144,0.95)"
        : open < 0.30
        ? "rgba(255,107,107,0.95)"
        : "rgba(255,255,255,0.95)";

    drawPoints(nctx, points, fill, 4);

    const wrist = points[0];
    if (wrist) {
      nctx.fillStyle = "rgba(255,255,255,0.9)";
      nctx.font = '12px "JetBrains Mono", monospace';
      nctx.fillText(side, wrist.x + 10, wrist.y - 10);
    }
  });
}

function emitGestureEvent() {
  window.dispatchEvent(new CustomEvent("microbotGesture", {
    detail: {
      gesture: state.gesture,
      openness: state.openness,
      hands: state.hands.length,
      head: state.headGesture
    }
  }));
}

function updateMetrics() {
  const now = performance.now();
  const dt = Math.max(1, now - state.lastFrameTs);
  state.fps = 1000 / dt;
  state.lastFrameTs = now;

  const combo = combinedHandGesture(state.hands, state.handedness);
  state.gesture = `${combo.label} | ${state.headGesture}`;
  state.openness = combo.openness;

  if (els.gesture) els.gesture.textContent = state.gesture;
  if (els.openness) els.openness.textContent = `${Math.round(state.openness * 100)}%`;
  if (els.landmarks) els.landmarks.textContent = `${state.hands.length * 21 + (state.face ? 1 : 0)}`;
  if (els.camera) els.camera.textContent = state.streamReady ? "ON" : "OFF";
  if (els.state) els.state.textContent = (state.hands.length || state.face) ? "Tracking" : "Idle";
  if (els.fps) els.fps.textContent = `${Math.round(state.fps)}`;
  if (els.count) els.count.textContent = `${state.hands.length}`;
  if (els.accuracy) els.accuracy.textContent = (state.hands.length || state.face) ? "Locked" : "Searching";
  if (els.latency) els.latency.textContent = "Realtime";
  if (els.mode) els.mode.textContent = state.gesture;

  if (els.badge) {
    els.badge.textContent = state.gesture;
    els.badge.classList.toggle("live", state.hands.length > 0 || !!state.face);
  }

  if (els.cameraStatus) {
    els.cameraStatus.textContent = state.streamReady ? "ONLINE" : "OFFLINE";
    els.cameraStatus.classList.toggle("live", state.streamReady);
  }

  emitGestureEvent();
}

async function initTasks() {
const filesetResolver = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

  state.handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
    },
    runningMode: "VIDEO",
    numHands: 2
  });

  state.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
    },
    runningMode: "VIDEO",
    numFaces: 1,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false
  });
}

async function initCamera() {
  mediaStream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 960 },
      height: { ideal: 720 },
      facingMode: "user"
    },
    audio: false
  });

  video.srcObject = mediaStream;
  await video.play();
  state.streamReady = true;
}

function processLoop() {
  if (!state.running) return;

  const nowMs = performance.now();

  if (video.readyState >= 2) {
    const handResult = state.handLandmarker.detectForVideo(video, nowMs);
    const faceResult = state.faceLandmarker.detectForVideo(video, nowMs);

    state.hands = handResult.landmarks || [];
    state.handedness = handResult.handedness || [];
    state.face = faceResult.faceLandmarks?.[0] || null;
    state.headGesture = estimateHeadGesture(state.face);

    drawCameraOverlay();
    drawNeuralDots();
    updateMetrics();
  }

  animationId = requestAnimationFrame(processLoop);
}

async function startTracking() {
  if (state.running) return;

  try {
    if (!state.handLandmarker || !state.faceLandmarker) {
      await initTasks();
    }

    await initCamera();

    state.running = true;
    processLoop();

    if (els.cameraStatus) {
      els.cameraStatus.textContent = "ONLINE";
      els.cameraStatus.classList.add("live");
    }
  } catch (err) {
    console.error(err);
    if (els.cameraStatus) els.cameraStatus.textContent = "ERROR";
    if (els.state) els.state.textContent = "Error";
  }
}

function stopTracking() {
  state.running = false;

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }

  video.srcObject = null;
  state.streamReady = false;
  state.hands = [];
  state.handedness = [];
  state.face = null;
  state.gesture = "WAITING";
  state.headGesture = "HEAD_CENTER";
  state.openness = 0;

  drawCameraOverlay();
  drawNeuralDots();
  updateMetrics();

  if (els.cameraStatus) {
    els.cameraStatus.textContent = "OFFLINE";
    els.cameraStatus.classList.remove("live");
  }
}

async function init() {
  drawNeuralDots();
  updateMetrics();

  if (startBtn) startBtn.addEventListener("click", startTracking);
  if (stopBtn) stopBtn.addEventListener("click", stopTracking);

  window.addEventListener("resize", () => {
    drawCameraOverlay();
    drawNeuralDots();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}