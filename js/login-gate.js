let FaceLandmarker = null;
let FilesetResolver = null;

const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const registerBtn = document.getElementById("registerBtn");
const verifyBtn = document.getElementById("verifyBtn");
const demoAccessBtn = document.getElementById("demoAccessBtn");
const clearProfileBtn = document.getElementById("clearProfileBtn");

const cameraStatus = document.getElementById("authCameraStatus");
const trackingState = document.getElementById("trackingState");

const detectStatus = document.getElementById("detectStatus");
const landmarkStatus = document.getElementById("landmarkStatus");
const identityStatus = document.getElementById("identityStatus");
const confidenceValue = document.getElementById("confidenceValue");

const presenceBar = document.getElementById("presenceBar");
const matchBar = document.getElementById("matchBar");
const stabilityBar = document.getElementById("stabilityBar");

const logPanel = document.getElementById("logPanel");

const authOverlay = document.getElementById("authOverlay");
const authOverlayText = document.getElementById("authOverlayText");

const enrollmentGuide = document.getElementById("enrollmentGuide");
const enrollmentInstruction = document.getElementById("enrollmentInstruction");
const enrollmentProgress = document.getElementById("enrollmentProgress");

const viewerFrame = document.querySelector(".viewer-frame");
const enrollmentRing = document.getElementById("enrollmentRing");
const enrollmentRingProgress = document.getElementById("enrollmentRingProgress");

const microbotDashboard = document.getElementById("microbotDashboard");
const dashboardAccessStatus = document.getElementById("dashboardAccessStatus");
const biometricSessionText = document.getElementById("biometricSessionText");

const enableSwarmBtn = document.getElementById("enableSwarmBtn");
const startTelemetryBtn = document.getElementById("startTelemetryBtn");
const linkControllerBtn = document.getElementById("linkControllerBtn");

const swarmStatusText = document.getElementById("swarmStatusText");
const telemetryStatusText = document.getElementById("telemetryStatusText");
const controllerLinkText = document.getElementById("controllerLinkText");

let faceLandmarker = null;
let streamStarted = false;
let lastVideoTime = -1;
let animationId = null;
let stableFrames = 0;
let systemState = "IDLE";
let currentFaceLandmarks = null;

let registeredFaceSamples = [];

let enrollmentActive = false;
let enrollmentStepIndex = 0;
let enrollmentCooldown = false;

let swarmEnabled = false;
let telemetryActive = false;
let controllerLinked = false;

const enrollmentSteps = [
  { key: "CENTER", label: "LOOK STRAIGHT AHEAD" },
  { key: "LEFT", label: "TURN HEAD LEFT" },
  { key: "RIGHT", label: "TURN HEAD RIGHT" },
  { key: "UP", label: "LIFT YOUR CHIN" },
  { key: "DOWN", label: "LOWER YOUR CHIN" }
];

const ENROLLMENT_RING_RADIUS = 92;
const ENROLLMENT_RING_CIRCUMFERENCE = 2 * Math.PI * ENROLLMENT_RING_RADIUS;
const FACE_PROFILE_STORAGE_KEY = "microbot_face_profile_v1";

async function loadVisionBundle() {
  if (FaceLandmarker && FilesetResolver) return;

  const visionModule = await import(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs"
  );

  FaceLandmarker = visionModule.FaceLandmarker;
  FilesetResolver = visionModule.FilesetResolver;
}

function addLog(message) {
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logPanel.prepend(line);

  const items = logPanel.querySelectorAll(".log-line");
  if (items.length > 18) {
    items[items.length - 1].remove();
  }
}

function setIdentity(text) {
  identityStatus.textContent = text;
}

function setBar(el, value) {
  el.style.width = `${Math.max(0, Math.min(100, value))}%`;
}

function showAuthOverlay(text, type = "granted") {
  authOverlayText.textContent = text;
  authOverlay.classList.remove("hidden", "granted", "denied");
  authOverlay.classList.add(type);

  setTimeout(() => {
    authOverlay.classList.add("hidden");
    authOverlay.classList.remove("granted", "denied");
  }, 1400);
}

function setEnrollmentProgress(stepIndex, totalSteps) {
  const progress = Math.max(0, Math.min(1, stepIndex / totalSteps));
  const offset = ENROLLMENT_RING_CIRCUMFERENCE * (1 - progress);

  enrollmentRingProgress.style.strokeDasharray = `${ENROLLMENT_RING_CIRCUMFERENCE}`;
  enrollmentRingProgress.style.strokeDashoffset = `${offset}`;
}

function showEnrollmentRing() {
  enrollmentRing.classList.add("visible");
  viewerFrame.classList.add("enrollment-active");
}

function hideEnrollmentRing() {
  enrollmentRing.classList.remove("visible");
  viewerFrame.classList.remove("enrollment-active");
}

function pulseEnrollmentRingSuccess() {
  enrollmentRingProgress.style.stroke = "rgba(0,255,136,1)";
  enrollmentRing.style.transform = "scale(1.04)";

  setTimeout(() => {
    enrollmentRing.style.transform = "scale(1)";
    enrollmentRingProgress.style.stroke = "rgba(0,212,255,0.95)";
  }, 240);
}

function saveFaceProfileToStorage() {
  try {
    const payload = {
      samples: registeredFaceSamples,
      savedAt: new Date().toISOString(),
      version: 1
    };

    localStorage.setItem(FACE_PROFILE_STORAGE_KEY, JSON.stringify(payload));
    addLog(`Face profile saved locally (${registeredFaceSamples.length} samples)`);
  } catch (error) {
    console.error("Storage save error:", error);
    addLog("Failed to save face profile locally");
  }
}

function loadFaceProfileFromStorage() {
  try {
    const raw = localStorage.getItem(FACE_PROFILE_STORAGE_KEY);

    if (!raw) {
      addLog("No local face profile found");
      return false;
    }

    const payload = JSON.parse(raw);

    if (!payload || !Array.isArray(payload.samples) || !payload.samples.length) {
      addLog("Stored face profile is invalid");
      return false;
    }

    registeredFaceSamples = payload.samples;
    confidenceValue.textContent = "100%";
    setBar(matchBar, 100);

    addLog(`Face profile loaded from local storage (${registeredFaceSamples.length} samples)`);
    return true;
  } catch (error) {
    console.error("Storage load error:", error);
    addLog("Failed to load face profile from local storage");
    return false;
  }
}

function clearFaceProfileFromStorage() {
  try {
    localStorage.removeItem(FACE_PROFILE_STORAGE_KEY);
    addLog("Local face profile cleared");
  } catch (error) {
    console.error("Storage clear error:", error);
    addLog("Failed to clear local face profile");
  }
}

function resetDashboardModules() {
  swarmEnabled = false;
  telemetryActive = false;
  controllerLinked = false;

  if (swarmStatusText) swarmStatusText.textContent = "Swarm system currently offline.";
  if (telemetryStatusText) telemetryStatusText.textContent = "Telemetry stream inactive.";
  if (controllerLinkText) controllerLinkText.textContent = "Controller link not established.";

  if (enableSwarmBtn) {
    enableSwarmBtn.classList.remove("active");
    enableSwarmBtn.textContent = "Enable Swarm";
  }

  if (startTelemetryBtn) {
    startTelemetryBtn.classList.remove("active");
    startTelemetryBtn.textContent = "Start Telemetry";
  }

  if (linkControllerBtn) {
    linkControllerBtn.classList.remove("active");
    linkControllerBtn.textContent = "Link Controller";
  }
}

function lockMicrobotDashboard() {
  if (!microbotDashboard || !dashboardAccessStatus || !biometricSessionText) return;

  microbotDashboard.classList.add("hidden");
  dashboardAccessStatus.textContent = "ACCESS LOCKED";
  biometricSessionText.textContent = "No active verified session.";
  resetDashboardModules();
}

function unlockMicrobotDashboard(confidence) {
  if (!microbotDashboard || !dashboardAccessStatus || !biometricSessionText) return;

  microbotDashboard.classList.remove("hidden");
  dashboardAccessStatus.textContent = "ACCESS GRANTED";
  biometricSessionText.textContent = `Verified biometric session active with ${confidence}% confidence.`;
}

function toggleSwarm() {
  swarmEnabled = !swarmEnabled;

  if (swarmEnabled) {
    swarmStatusText.textContent = "Swarm system online. Broadcast patterns and node grouping available.";
    enableSwarmBtn.classList.add("active");
    enableSwarmBtn.textContent = "Disable Swarm";
    addLog("Swarm control enabled");
  } else {
    swarmStatusText.textContent = "Swarm system currently offline.";
    enableSwarmBtn.classList.remove("active");
    enableSwarmBtn.textContent = "Enable Swarm";
    addLog("Swarm control disabled");
  }
}

function toggleTelemetry() {
  telemetryActive = !telemetryActive;

  if (telemetryActive) {
    telemetryStatusText.textContent = "Telemetry stream active. Live diagnostics channel opened.";
    startTelemetryBtn.classList.add("active");
    startTelemetryBtn.textContent = "Stop Telemetry";
    addLog("Telemetry stream started");
  } else {
    telemetryStatusText.textContent = "Telemetry stream inactive.";
    startTelemetryBtn.classList.remove("active");
    startTelemetryBtn.textContent = "Start Telemetry";
    addLog("Telemetry stream stopped");
  }
}

function toggleControllerLink() {
  controllerLinked = !controllerLinked;

  if (controllerLinked) {
    controllerLinkText.textContent = "Controller link established. Ready for remote interface integration.";
    linkControllerBtn.classList.add("active");
    linkControllerBtn.textContent = "Unlink Controller";
    addLog("Controller link established");
  } else {
    controllerLinkText.textContent = "Controller link not established.";
    linkControllerBtn.classList.remove("active");
    linkControllerBtn.textContent = "Link Controller";
    addLog("Controller link disconnected");
  }
}

function setSystemState(newState) {
  systemState = newState;

  switch (newState) {
    case "IDLE":
      trackingState.textContent = "SYSTEM IDLE";
      cameraStatus.textContent = "Standby";
      detectStatus.textContent = "Offline";
      landmarkStatus.textContent = "Offline";
      setIdentity("Unknown");
      break;

    case "LOADING":
      trackingState.textContent = "LOADING ENGINE";
      cameraStatus.textContent = "Loading MediaPipe";
      detectStatus.textContent = "Loading";
      landmarkStatus.textContent = "Loading";
      setIdentity("Unknown");
      break;

    case "CAMERA_STARTING":
      trackingState.textContent = "STARTING CAMERA";
      cameraStatus.textContent = "Starting camera";
      detectStatus.textContent = "Initializing";
      landmarkStatus.textContent = "Initializing";
      setIdentity("Unknown");
      break;

    case "SCANNING":
      trackingState.textContent = "SCANNING";
      cameraStatus.textContent = "Camera online";
      detectStatus.textContent = "Active";
      landmarkStatus.textContent = "Tracking";
      setIdentity("Scanning");
      break;

    case "NO_FACE":
      trackingState.textContent = "NO TARGET";
      detectStatus.textContent = "Searching";
      landmarkStatus.textContent = "Standby";
      setIdentity("No Face");
      break;

    case "FACE_DETECTED":
      trackingState.textContent = "TARGET LOCKED";
      detectStatus.textContent = "Detected";
      landmarkStatus.textContent = "Tracking";
      setIdentity(registeredFaceSamples.length ? "Profile Loaded" : "Face Detected");
      break;

    case "REGISTERING":
      trackingState.textContent = "REGISTERING FACE";
      setIdentity("Registering");
      break;

    case "VERIFYING":
      trackingState.textContent = "VERIFYING IDENTITY";
      setIdentity("Verifying");
      break;

    case "ACCESS_GRANTED":
      trackingState.textContent = "ACCESS GRANTED";
      setIdentity("Verified");
      break;

    case "ACCESS_DENIED":
      trackingState.textContent = "ACCESS DENIED";
      setIdentity("Denied");
      break;

    case "ERROR":
      trackingState.textContent = "SYSTEM ERROR";
      cameraStatus.textContent = "Error";
      detectStatus.textContent = "Error";
      landmarkStatus.textContent = "Error";
      setIdentity("Error");
      break;
  }
}

function drawPoint(x, y, r = 1.6) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawMesh(landmarks, width, height) {
  ctx.fillStyle = "rgba(0,212,255,0.85)";
  for (const lm of landmarks) {
    drawPoint(lm.x * width, lm.y * height, 1.3);
  }
}

async function initFaceLandmarker() {
  if (faceLandmarker) return;

  try {
    setSystemState("LOADING");
    addLog("Loading MediaPipe Face Landmarker...");
    await loadVisionBundle();

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "./models/face_landmarker.task"
      },
      runningMode: "VIDEO",
      numFaces: 1,
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true
    });

    cameraStatus.textContent = "MediaPipe ready";
    detectStatus.textContent = "Ready";
    landmarkStatus.textContent = "Ready";
    addLog("MediaPipe Face Landmarker loaded");
  } catch (error) {
    console.error("FaceLandmarker init error:", error);
    setSystemState("ERROR");
    addLog(error.message || "Failed to initialize MediaPipe");
    throw error;
  }
}

async function startCamera() {
  if (streamStarted) {
    addLog("Camera already running");
    return;
  }

  try {
    await initFaceLandmarker();
    setSystemState("CAMERA_STARTING");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    video.srcObject = stream;

    video.onloadedmetadata = async () => {
      try {
        await video.play();

        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        streamStarted = true;
        setSystemState("SCANNING");

        addLog("Camera stream started");
        renderLoop();
      } catch (playError) {
        console.error("Video play error:", playError);
        setSystemState("ERROR");
        addLog("Could not play camera stream");
      }
    };
  } catch (error) {
    console.error("Camera start error:", error);
    setSystemState("ERROR");
    addLog(error.message || "Failed to start MediaPipe");
  }
}

function renderLoop() {
  if (!streamStarted || !faceLandmarker) return;

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;

    const results = faceLandmarker.detectForVideo(video, performance.now());

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      const face = results.faceLandmarks[0];
      currentFaceLandmarks = face;

      drawMesh(face, canvas.width, canvas.height);

      setSystemState("FACE_DETECTED");

      if (!registeredFaceSamples.length) {
        confidenceValue.textContent = "—";
      }

      setBar(presenceBar, 100);

      stableFrames = Math.min(stableFrames + 2, 100);
      setBar(stabilityBar, stableFrames);

      if (enrollmentActive && !enrollmentCooldown) {
        const pose = estimateHeadPose(face);
        const currentStep = enrollmentSteps[enrollmentStepIndex];

        updateEnrollmentUI();

        if (currentStep && matchesEnrollmentStep(currentStep.key, pose)) {
          const signature = buildFaceSignature(face);

          if (signature) {
            registeredFaceSamples.push(signature);

            const percent = Math.round(
              (registeredFaceSamples.length / enrollmentSteps.length) * 100
            );

            confidenceValue.textContent = `${percent}%`;
            setBar(matchBar, percent);

            addLog(`Enrollment step completed: ${currentStep.label}`);
            showAuthOverlay(`STEP ${enrollmentStepIndex + 1} COMPLETE`, "granted");
            pulseEnrollmentRingSuccess();

            enrollmentCooldown = true;

            setTimeout(() => {
              enrollmentStepIndex += 1;
              enrollmentCooldown = false;

              if (enrollmentStepIndex >= enrollmentSteps.length) {
                finishEnrollment();
              } else {
                updateEnrollmentUI();
              }
            }, 900);
          }
        }
      }
    } else {
      currentFaceLandmarks = null;

      setSystemState("NO_FACE");
      confidenceValue.textContent = "0%";

      setBar(presenceBar, 8);
      setBar(matchBar, 0);

      stableFrames = Math.max(stableFrames - 6, 0);
      setBar(stabilityBar, stableFrames);

      if (enrollmentActive) {
        updateEnrollmentUI();
      }
    }
  }

  animationId = requestAnimationFrame(renderLoop);
}

function distance2D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function averagePoint(points) {
  const total = points.reduce(
    (acc, p) => ({
      x: acc.x + p.x,
      y: acc.y + p.y,
      z: (acc.z || 0) + (p.z || 0)
    }),
    { x: 0, y: 0, z: 0 }
  );

  return {
    x: total.x / points.length,
    y: total.y / points.length,
    z: total.z / points.length
  };
}

function buildFaceSignature(landmarks) {
  if (!landmarks || landmarks.length < 455) return null;

  const leftEye = averagePoint([landmarks[33], landmarks[133]]);
  const rightEye = averagePoint([landmarks[362], landmarks[263]]);
  const noseTip = landmarks[1];
  const mouthCenter = averagePoint([landmarks[13], landmarks[14]]);
  const chin = landmarks[152];
  const faceLeft = landmarks[234];
  const faceRight = landmarks[454];
  const forehead = landmarks[10];

  const faceWidth = distance2D(faceLeft, faceRight);
  const faceHeight = distance2D(forehead, chin);

  if (!faceWidth || !faceHeight) return null;

  const eyeDistance = distance2D(leftEye, rightEye) / faceWidth;
  const noseToMouth = distance2D(noseTip, mouthCenter) / faceHeight;
  const noseToChin = distance2D(noseTip, chin) / faceHeight;
  const mouthToChin = distance2D(mouthCenter, chin) / faceHeight;
  const leftEyeToNose = distance2D(leftEye, noseTip) / faceWidth;
  const rightEyeToNose = distance2D(rightEye, noseTip) / faceWidth;
  const aspectRatio = faceWidth / faceHeight;

  return [
    eyeDistance,
    noseToMouth,
    noseToChin,
    mouthToChin,
    leftEyeToNose,
    rightEyeToNose,
    aspectRatio
  ];
}

function compareSignatures(sigA, sigB) {
  if (!sigA || !sigB || sigA.length !== sigB.length) return Infinity;

  let sum = 0;
  for (let i = 0; i < sigA.length; i++) {
    const diff = sigA[i] - sigB[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

function signatureDistanceToConfidence(distance) {
  const maxDistance = 0.12;
  const confidence = Math.max(0, 1 - distance / maxDistance);
  return Math.round(confidence * 100);
}

function getBestMatchDistance(currentSignature) {
  if (!registeredFaceSamples.length || !currentSignature) return Infinity;

  let bestDistance = Infinity;

  for (const sample of registeredFaceSamples) {
    const distance = compareSignatures(sample, currentSignature);
    if (distance < bestDistance) {
      bestDistance = distance;
    }
  }

  return bestDistance;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function estimateHeadPose(landmarks) {
  if (!landmarks || landmarks.length < 455) return null;

  const leftEye = averagePoint([landmarks[33], landmarks[133]]);
  const rightEye = averagePoint([landmarks[362], landmarks[263]]);
  const nose = landmarks[1];
  const chin = landmarks[152];
  const forehead = landmarks[10];
  const faceLeft = landmarks[234];
  const faceRight = landmarks[454];
  const mouthCenter = averagePoint([landmarks[13], landmarks[14]]);

  const faceWidth = distance2D(faceLeft, faceRight);
  const faceHeight = distance2D(forehead, chin);

  if (!faceWidth || !faceHeight) return null;

  const eyeCenter = averagePoint([leftEye, rightEye]);

  const yaw = clamp((nose.x - eyeCenter.x) / (faceWidth * 0.35), -1, 1);
  const pitch = clamp(
    (mouthCenter.y - nose.y - faceHeight * 0.18) / (faceHeight * 0.22),
    -1,
    1
  );
  const roll = clamp((rightEye.y - leftEye.y) / (faceWidth * 0.18), -1, 1);

  return { yaw, pitch, roll };
}

function matchesEnrollmentStep(stepKey, pose) {
  if (!pose) return false;

  const yaw = pose.yaw;
  const pitch = pose.pitch;
  const roll = Math.abs(pose.roll);

  switch (stepKey) {
    case "CENTER":
      return Math.abs(yaw) < 0.12 && Math.abs(pitch) < 0.16 && roll < 0.12;
    case "LEFT":
      return yaw < -0.18 && roll < 0.18;
    case "RIGHT":
      return yaw > 0.18 && roll < 0.18;
    case "UP":
      return pitch < -0.18 && Math.abs(yaw) < 0.2;
    case "DOWN":
      return pitch > 0.18 && Math.abs(yaw) < 0.2;
    default:
      return false;
  }
}

function updateEnrollmentUI() {
  if (!enrollmentActive) {
    enrollmentGuide.classList.add("hidden");
    hideEnrollmentRing();
    setEnrollmentProgress(0, enrollmentSteps.length);
    return;
  }

  const step = enrollmentSteps[enrollmentStepIndex];

  if (!step) {
    enrollmentGuide.classList.add("hidden");
    hideEnrollmentRing();
    return;
  }

  enrollmentGuide.classList.remove("hidden");
  enrollmentInstruction.textContent = step.label;
  enrollmentProgress.textContent = `STEP ${enrollmentStepIndex + 1} / ${enrollmentSteps.length}`;

  showEnrollmentRing();
  setEnrollmentProgress(enrollmentStepIndex, enrollmentSteps.length);
}

function startEnrollment() {
  registeredFaceSamples = [];
  clearFaceProfileFromStorage();
  lockMicrobotDashboard();

  enrollmentActive = true;
  enrollmentStepIndex = 0;
  enrollmentCooldown = false;

  setSystemState("REGISTERING");
  updateEnrollmentUI();

  confidenceValue.textContent = "0%";
  setBar(matchBar, 0);

  addLog("Guided face enrollment started");
  showAuthOverlay("START ENROLLMENT", "granted");
}

function finishEnrollment() {
  enrollmentActive = false;
  updateEnrollmentUI();

  confidenceValue.textContent = "100%";
  setBar(matchBar, 100);

  saveFaceProfileToStorage();

  setSystemState("FACE_DETECTED");
  addLog("Guided face enrollment completed");
  showAuthOverlay("PROFILE COMPLETE", "granted");
}

startBtn.addEventListener("click", startCamera);

registerBtn.addEventListener("click", () => {
  if (!currentFaceLandmarks) {
    addLog("No face available to start enrollment");
    setSystemState("NO_FACE");
    showAuthOverlay("NO FACE", "denied");
    return;
  }

  startEnrollment();
});

verifyBtn.addEventListener("click", () => {
  setSystemState("VERIFYING");

  if (!registeredFaceSamples.length) {
    addLog("No registered face profile found");
    setIdentity("No Profile");
    confidenceValue.textContent = "0%";
    setBar(matchBar, 0);
    lockMicrobotDashboard();
    showAuthOverlay("NO PROFILE", "denied");
    return;
  }

  if (!currentFaceLandmarks) {
    addLog("No face available for verification");
    setSystemState("NO_FACE");
    confidenceValue.textContent = "0%";
    setBar(matchBar, 0);
    lockMicrobotDashboard();
    showAuthOverlay("NO FACE", "denied");
    return;
  }

  const currentSignature = buildFaceSignature(currentFaceLandmarks);

  if (!currentSignature) {
    addLog("Failed to build current face signature");
    setSystemState("ERROR");
    lockMicrobotDashboard();
    showAuthOverlay("VERIFY ERROR", "denied");
    return;
  }

  const bestDistance = getBestMatchDistance(currentSignature);
  const confidence = signatureDistanceToConfidence(bestDistance);

  confidenceValue.textContent = `${confidence}%`;
  setBar(matchBar, confidence);

  const isVerified = bestDistance < 0.055;

if (isVerified) {
  setSystemState("ACCESS_GRANTED");
  unlockMicrobotDashboard(confidence);

  addLog(
    `Identity verified. Best distance: ${bestDistance.toFixed(4)} | Confidence: ${confidence}%`
  );

  showAuthOverlay("ACCESS GRANTED", "granted");

  setTimeout(() => {
    unlockSystemGate();
  }, 1200);
} else {
  setSystemState("ACCESS_DENIED");
  lockMicrobotDashboard();

  addLog(
    `Identity denied. Best distance: ${bestDistance.toFixed(4)} | Confidence: ${confidence}%`
  );

  showAuthOverlay("ACCESS DENIED", "denied");
}

  setTimeout(() => {
    if (currentFaceLandmarks) {
      setSystemState("FACE_DETECTED");
    } else {
      setSystemState("NO_FACE");
    }
  }, 1100);
});

if (demoAccessBtn) {
  demoAccessBtn.addEventListener("click", () => {
    const confidence = 100;
    setSystemState("ACCESS_GRANTED");
    unlockMicrobotDashboard(confidence);
    confidenceValue.textContent = `${confidence}%`;
    setBar(matchBar, confidence);
    addLog("Investor demo access granted without camera requirement");
    showAuthOverlay("DEMO ACCESS", "granted");

    setTimeout(() => {
      unlockSystemGate();
    }, 650);
  });
}

clearProfileBtn.addEventListener("click", () => {
  registeredFaceSamples = [];
  clearFaceProfileFromStorage();
  lockMicrobotDashboard();

  enrollmentActive = false;
  enrollmentStepIndex = 0;
  enrollmentCooldown = false;

  updateEnrollmentUI();

  confidenceValue.textContent = "0%";
  setBar(matchBar, 0);
  setIdentity("No Profile");

  addLog("Face profile reset");
  showAuthOverlay("PROFILE CLEARED", "denied");

  if (currentFaceLandmarks) {
    setSystemState("FACE_DETECTED");
  } else {
    setSystemState("IDLE");
  }
});

enableSwarmBtn.addEventListener("click", () => {
  if (microbotDashboard.classList.contains("hidden")) return;
  toggleSwarm();
});

startTelemetryBtn.addEventListener("click", () => {
  if (microbotDashboard.classList.contains("hidden")) return;
  toggleTelemetry();
});

linkControllerBtn.addEventListener("click", () => {
  if (microbotDashboard.classList.contains("hidden")) return;
  toggleControllerLink();
});

window.addEventListener("load", () => {
  setSystemState("IDLE");
  updateEnrollmentUI();
  addLog("Waiting for system start");
  lockMicrobotDashboard();

  const profileLoaded = loadFaceProfileFromStorage();

  if (profileLoaded) {
    setIdentity("Profile Loaded");
    showAuthOverlay("PROFILE RESTORED", "granted");
  }
});

function unlockSystemGate() {
  const faceAuthGate = document.getElementById("faceAuthGate");
  if (!faceAuthGate) return;

  /* ── 1. Stop face-auth camera stream ── */
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }

  streamStarted = false;
  currentFaceLandmarks = null;

  /* ── 2. Prepare main site for cascade entrance ── */
  document.body.classList.add("site-entering");

  /* ── 3. Cinematic gate exit (iris-zoom-blur) ── */
  faceAuthGate.classList.add("gate-exiting");

  /* ── 4. After gate animation completes → reveal site ── */
  faceAuthGate.addEventListener("animationend", () => {
    faceAuthGate.classList.add("hidden");
    faceAuthGate.classList.remove("gate-exiting");

    document.body.classList.remove("locked");
    document.body.classList.remove("site-entering");
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    /* trigger cascade entrance */
    document.body.classList.add("site-entered");

    /* clean up entrance classes after animations complete */
    setTimeout(() => {
      document.body.classList.remove("site-entered");
    }, 1800);

    addLog("System gate unlocked — camera released");
  }, { once: true });
}
