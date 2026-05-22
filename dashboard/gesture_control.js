
/*
 * MicroBot Labs — Browser Hand Gesture Control v0.3
 *
 * Browser-side gesture input for the simulated MicroBot dashboard.
 * Uses MediaPipe Tasks Vision HandLandmarker loaded at runtime from CDN.
 *
 * Evidence status:
 * PRE_HARDWARE_SIMULATED.
 * This does not validate real ESP32 hardware.
 */

(function () {
  "use strict";

  const gestureState = {
    enabled: false,
    safetyLocked: false,
    handLandmarker: null,
    stream: null,
    lastVideoTime: -1,
    lastFireAt: 0,
    lastPalmX: null,
    lastPalmY: null,
    selectedIndex: 0,
    confidence: 0,
    rafId: null,
    lastCommand: "none"
  };

  const connections = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20],
    [5,9],[9,13],[13,17]
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function nodeList() {
    if (typeof plannedNodes === "function") return plannedNodes();
    if (typeof nodes !== "undefined") return nodes.filter(n => n.id !== "NODE_00_MASTER");
    return [];
  }

  function selectedNode() {
    const list = nodeList();
    return list[gestureState.selectedIndex] || list[0] || null;
  }

  function setBadge(text, mode) {
    const badge = byId("gestureStatusBadge");
    if (!badge) return;
    badge.textContent = text;
    badge.className = `status-pill ${mode || "simulated"}`;
  }

  function updateReadout(name, meaning, confidence) {
    const node = selectedNode();
    const selected = node ? node.id : "none";
    const percent = `${Math.round((confidence || 0) * 100)}%`;

    if (byId("gestureName")) byId("gestureName").textContent = name;
    if (byId("gestureMeaning")) byId("gestureMeaning").textContent = meaning;
    if (byId("gestureDetected")) byId("gestureDetected").textContent = name;
    if (byId("gestureSelectedNode")) byId("gestureSelectedNode").textContent = selected;
    if (byId("gestureConfidence")) byId("gestureConfidence").textContent = percent;
    if (byId("gestureLastCommand")) byId("gestureLastCommand").textContent = gestureState.lastCommand;
  }

  function logGesture(prefix, payload) {
    if (typeof logPacket === "function") logPacket(prefix, payload);
    else console.log(prefix, payload);
  }

  function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function palmCenter(lm) {
    return {
      x: (lm[0].x + lm[5].x + lm[9].x + lm[13].x + lm[17].x) / 5,
      y: (lm[0].y + lm[5].y + lm[9].y + lm[13].y + lm[17].y) / 5
    };
  }

  function fingerStates(lm) {
    const index = lm[8].y < lm[6].y;
    const middle = lm[12].y < lm[10].y;
    const ring = lm[16].y < lm[14].y;
    const pinky = lm[20].y < lm[18].y;
    const wrist = lm[0];
    const thumbTip = lm[4];
    const thumbIp = lm[3];
    const thumb = Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbIp.x - wrist.x) + 0.015;
    return { thumb, index, middle, ring, pinky };
  }

  function countExtended(f) {
    return ["thumb", "index", "middle", "ring", "pinky"].filter(k => f[k]).length;
  }

  function isPinch(lm) {
    return distance(lm[4], lm[8]) < 0.055;
  }

  function isThumbUp(lm, f) {
    return f.thumb && !f.index && !f.middle && !f.ring && !f.pinky && lm[4].y < lm[0].y - 0.08;
  }

  function isThumbDown(lm, f) {
    return f.thumb && !f.index && !f.middle && !f.ring && !f.pinky && lm[4].y > lm[0].y + 0.08;
  }

  function classifySingleHand(lm) {
    const f = fingerStates(lm);
    const extended = countExtended(f);
    const palm = palmCenter(lm);

    let motionX = 0;
    let motionY = 0;

    if (gestureState.lastPalmX !== null) motionX = palm.x - gestureState.lastPalmX;
    if (gestureState.lastPalmY !== null) motionY = palm.y - gestureState.lastPalmY;

    gestureState.lastPalmX = palm.x;
    gestureState.lastPalmY = palm.y;

    if (extended >= 4 && motionX > 0.080) return { name: "SWIPE_RIGHT", confidence: 0.88 };
    if (extended >= 4 && motionX < -0.080) return { name: "SWIPE_LEFT", confidence: 0.88 };
    if (extended >= 4 && motionY < -0.075) return { name: "PALM_UP", confidence: 0.82 };
    if (extended >= 4 && motionY > 0.075) return { name: "PALM_DOWN", confidence: 0.82 };

    if (isPinch(lm)) return { name: "PINCH", confidence: 0.88 };
    if (isThumbUp(lm, f)) return { name: "THUMBS_UP", confidence: 0.86 };
    if (isThumbDown(lm, f)) return { name: "THUMBS_DOWN", confidence: 0.86 };

    if (extended >= 5) return { name: "OPEN_PALM", confidence: 0.90 };
    if (extended === 0) return { name: "FIST", confidence: 0.90 };

    if (!f.thumb && f.index && !f.middle && !f.ring && !f.pinky) {
      return { name: "INDEX_POINT", confidence: 0.86 };
    }

    if (!f.thumb && f.index && f.middle && !f.ring && !f.pinky) {
      return { name: "PEACE_V", confidence: 0.86 };
    }

    if (!f.thumb && f.index && f.middle && f.ring && !f.pinky) {
      return { name: "THREE_FINGERS", confidence: 0.82 };
    }

    return { name: "UNKNOWN", confidence: 0.35 };
  }

  function classifyHands(results) {
    const hands = results.landmarks || [];

    if (hands.length >= 2) {
      const a = classifySingleHand(hands[0]);
      const b = classifySingleHand(hands[1]);

      if (a.name === "OPEN_PALM" && b.name === "OPEN_PALM") return { name: "TWO_HANDS_OPEN", confidence: 0.93 };
      if (a.name === "FIST" && b.name === "FIST") return { name: "TWO_FISTS", confidence: 0.93 };

      return a.confidence >= b.confidence ? a : b;
    }

    if (hands.length === 1) return classifySingleHand(hands[0]);
    return { name: "NONE", confidence: 0 };
  }

  function meaningFor(name) {
    const node = selectedNode();
    const nodeName = node ? node.id : "selected node";

    const map = {
      OPEN_PALM: "Scan the simulated node field.",
      FIST: "Put the simulated system into safe mode.",
      INDEX_POINT: `Activate ${nodeName}.`,
      PINCH: `Run the role-specific action of ${nodeName}.`,
      PEACE_V: "Run a six-node sweep.",
      THREE_FINGERS: "Run the full simulated mission demo.",
      THUMBS_UP: "Activate all simulated MicroBots.",
      THUMBS_DOWN: "Return all simulated MicroBots to idle.",
      SWIPE_RIGHT: "Select the next MicroBot node.",
      SWIPE_LEFT: "Select the previous MicroBot node.",
      PALM_UP: `Set ${nodeName} to warning/review.`,
      PALM_DOWN: `Return ${nodeName} to idle.`,
      TWO_HANDS_OPEN: "Reset the simulated system.",
      TWO_FISTS: "Trigger simulated emergency stop.",
      UNKNOWN: "Gesture not mapped.",
      NONE: "No hand detected."
    };

    return map[name] || "Gesture not mapped.";
  }

  function selectNode(index) {
    const list = nodeList();
    if (!list.length) return;

    gestureState.selectedIndex = (index + list.length) % list.length;
    const node = list[gestureState.selectedIndex];

    if (typeof appState !== "undefined") appState.selectedNodeId = node.id;

    const select = byId("nodeSelect");
    if (select) select.value = node.id;

    if (typeof pulseMicrobot === "function") pulseMicrobot(node.id);

    updateReadout("NODE SELECT", `Selected ${node.id}.`, 0.88);
  }

  function fireCommand(name) {
    const t = performance.now();
    if (t - gestureState.lastFireAt < 900) return;
    if (name === "UNKNOWN" || name === "NONE") return;

    const node = selectedNode();
    let commandLabel = "none";

    if (gestureState.safetyLocked && name !== "TWO_HANDS_OPEN") {
      gestureState.lastFireAt = t;
      gestureState.lastCommand = "blocked by safety lock";
      updateReadout(name, "Gesture recognized but blocked by Gesture Safety Lock. Use Two Hands Open to reset.", gestureState.confidence);
      logGesture("[GESTURE-BLOCKED]", {
        type: "gesture",
        source: "BROWSER_HAND_GESTURE",
        validation_mode: "PRE_HARDWARE_SIMULATED",
        gesture: name,
        blocked: true
      });
      return;
    }

    gestureState.lastFireAt = t;

    if (name === "OPEN_PALM" && typeof handleCommand === "function") {
      commandLabel = "SCAN_NODES";
      handleCommand("SCAN_NODES");
    }

    if (name === "FIST" && typeof handleCommand === "function") {
      commandLabel = "STOP";
      handleCommand("STOP");
    }

    if (name === "INDEX_POINT" && node && typeof executeNodeAction === "function") {
      commandLabel = `${node.id} ACTIVE`;
      executeNodeAction(node.id, "ACTIVE");
    }

    if (name === "PINCH" && node && typeof executeNodeAction === "function") {
      const roleAction = node.roleAction || "ACTIVE";
      commandLabel = `${node.id} ${roleAction}`;
      executeNodeAction(node.id, roleAction);
    }

    if (name === "PEACE_V" && typeof handleCommand === "function") {
      commandLabel = "SWARM_SWEEP";
      handleCommand("SWARM_SWEEP");
    }

    if (name === "THREE_FINGERS" && typeof handleCommand === "function") {
      commandLabel = "MISSION_DEMO";
      handleCommand("MISSION_DEMO");
    }

    if (name === "THUMBS_UP" && typeof handleCommand === "function") {
      commandLabel = "ALL_ACTIVE";
      handleCommand("ALL_ACTIVE");
    }

    if (name === "THUMBS_DOWN" && typeof handleCommand === "function") {
      commandLabel = "ALL_IDLE";
      handleCommand("ALL_IDLE");
    }

    if (name === "SWIPE_RIGHT") {
      commandLabel = "SELECT_NEXT_NODE";
      selectNode(gestureState.selectedIndex + 1);
    }

    if (name === "SWIPE_LEFT") {
      commandLabel = "SELECT_PREVIOUS_NODE";
      selectNode(gestureState.selectedIndex - 1);
    }

    if (name === "PALM_UP" && node && typeof executeNodeAction === "function") {
      commandLabel = `${node.id} WARNING`;
      executeNodeAction(node.id, "WARNING");
    }

    if (name === "PALM_DOWN" && node && typeof executeNodeAction === "function") {
      commandLabel = `${node.id} IDLE`;
      executeNodeAction(node.id, "IDLE");
    }

    if (name === "TWO_HANDS_OPEN" && typeof handleCommand === "function") {
      commandLabel = "RESET";
      gestureState.safetyLocked = false;
      handleCommand("RESET");
    }

    if (name === "TWO_FISTS" && typeof handleCommand === "function") {
      commandLabel = "EMERGENCY_STOP";
      gestureState.safetyLocked = true;
      handleCommand("EMERGENCY_STOP");
    }

    gestureState.lastCommand = commandLabel;
    updateReadout(name, meaningFor(name), gestureState.confidence);

    logGesture("[GESTURE]", {
      version: "v0.3-gesture-control",
      validation_mode: "PRE_HARDWARE_SIMULATED",
      type: "gesture_command",
      source: "BROWSER_HAND_GESTURE",
      gesture: name,
      command: commandLabel,
      selected_node: node ? node.id : null,
      confidence: gestureState.confidence,
      interpretation: "browser-side gesture input controlling simulated MicroBot dashboard"
    });
  }

  function drawOverlay(results) {
    const canvas = byId("gestureCanvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const hands = results.landmarks || [];

    hands.forEach((lm) => {
      connections.forEach(([a, b]) => {
        const pa = lm[a];
        const pb = lm[b];
        ctx.beginPath();
        ctx.moveTo(pa.x * canvas.width, pa.y * canvas.height);
        ctx.lineTo(pb.x * canvas.width, pb.y * canvas.height);
        ctx.strokeStyle = "rgba(255,255,255,0.82)";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      lm.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x * canvas.width, point.y * canvas.height, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.65)";
        ctx.stroke();
      });
    });
  }

  async function startGestureControl() {
    try {
      setBadge("LOADING MODEL", "warning");

      const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest");
      const fileset = await vision.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      gestureState.handLandmarker = await vision.HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.55,
        minTrackingConfidence: 0.55
      });

      const video = byId("gestureVideo");
      gestureState.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 960 },
          height: { ideal: 540 },
          facingMode: "user"
        },
        audio: false
      });

      video.srcObject = gestureState.stream;
      await video.play();

      gestureState.enabled = true;
      setBadge("GESTURE ACTIVE", "ready");
      updateReadout("READY", "Camera and hand landmark model are active.", 1);

      gestureLoop();
    } catch (error) {
      setBadge("GESTURE ERROR", "warning");
      updateReadout("ERROR", `Gesture control could not start: ${error.message}`, 0);
      logGesture("[GESTURE-ERROR]", {
        type: "error",
        source: "BROWSER_HAND_GESTURE",
        message: error.message,
        hint: "Use localhost/HTTPS, allow camera permission, and make sure the browser can load MediaPipe assets."
      });
    }
  }

  function gestureLoop() {
    if (!gestureState.enabled || !gestureState.handLandmarker) return;

    const video = byId("gestureVideo");

    if (video && video.readyState >= 2 && video.currentTime !== gestureState.lastVideoTime) {
      gestureState.lastVideoTime = video.currentTime;

      const results = gestureState.handLandmarker.detectForVideo(video, performance.now());
      drawOverlay(results);

      const classification = classifyHands(results);
      gestureState.confidence = classification.confidence;

      updateReadout(classification.name, meaningFor(classification.name), classification.confidence);

      if (classification.confidence >= 0.80) {
        fireCommand(classification.name);
      }
    }

    gestureState.rafId = requestAnimationFrame(gestureLoop);
  }

  function stopGestureControl() {
    gestureState.enabled = false;

    if (gestureState.rafId) {
      cancelAnimationFrame(gestureState.rafId);
      gestureState.rafId = null;
    }

    if (gestureState.stream) {
      gestureState.stream.getTracks().forEach(track => track.stop());
      gestureState.stream = null;
    }

    const video = byId("gestureVideo");
    if (video) video.srcObject = null;

    const canvas = byId("gestureCanvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setBadge("GESTURE OFF", "simulated");
    updateReadout("STOPPED", "Gesture control stopped.", 0);
  }

  function calibrateNeutral() {
    gestureState.lastPalmX = null;
    gestureState.lastPalmY = null;
    updateReadout("CALIBRATED", "Neutral hand motion reset. Continue with slow, clear gestures.", 1);
  }

  function toggleSafetyLock() {
    gestureState.safetyLocked = !gestureState.safetyLocked;
    const state = gestureState.safetyLocked ? "LOCKED" : "UNLOCKED";

    updateReadout("SAFETY LOCK", `Gesture safety lock is now ${state}.`, 1);

    logGesture("[GESTURE-SAFETY]", {
      type: "gesture_safety",
      source: "BROWSER_HAND_GESTURE",
      validation_mode: "PRE_HARDWARE_SIMULATED",
      safety_lock: gestureState.safetyLocked
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const start = byId("btnGestureStart");
    const stop = byId("btnGestureStop");
    const calibrate = byId("btnGestureCalibrate");
    const lock = byId("btnGestureSafetyLock");

    if (start) start.addEventListener("click", startGestureControl);
    if (stop) stop.addEventListener("click", stopGestureControl);
    if (calibrate) calibrate.addEventListener("click", calibrateNeutral);
    if (lock) lock.addEventListener("click", toggleSafetyLock);

    setBadge("GESTURE OFF", "simulated");
    updateReadout("No gesture", "Start the camera to enable browser-side gesture control.", 0);
  });

  window.MicroBotGestureControl = {
    startGestureControl,
    stopGestureControl,
    calibrateNeutral,
    toggleSafetyLock
  };
})();
