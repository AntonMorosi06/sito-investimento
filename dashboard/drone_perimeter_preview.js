(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const perimeter = [
    { x: 120, y: 120 },
    { x: 880, y: 120 },
    { x: 880, y: 520 },
    { x: 120, y: 520 },
    { x: 120, y: 120 }
  ];

  const obstacles = [
    { id: "desk", x: 290, y: 255, w: 120, h: 72, label: "desk" },
    { id: "chair", x: 600, y: 350, w: 76, h: 76, label: "chair" },
    { id: "shelf", x: 760, y: 190, w: 90, h: 56, label: "shelf" }
  ];

  const microbotPositions = [
    { id: "NODE_01", x: 185, y: 170, role: "LED" },
    { id: "NODE_02", x: 820, y: 180, role: "PROX" },
    { id: "NODE_03", x: 180, y: 470, role: "DOCK" },
    { id: "NODE_04", x: 820, y: 455, role: "MOTION" },
    { id: "NODE_05", x: 430, y: 510, role: "TEL" },
    { id: "NODE_06", x: 570, y: 510, role: "VISION" }
  ];

  const state = {
    running: false,
    paused: false,
    t: 0,
    speed: 0.0026,
    raf: null,
    coverage: 0,
    distance: 0,
    points: [],
    obstaclesVisible: true,
    microbotsVisible: true,
    missionState: "IDLE",
    lastPhase: "IDLE",
    startedAt: null
  };

  function totalPathLength() {
    let total = 0;
    for (let i = 0; i < perimeter.length - 1; i++) {
      total += Math.hypot(perimeter[i + 1].x - perimeter[i].x, perimeter[i + 1].y - perimeter[i].y);
    }
    return total;
  }

  const pathLength = totalPathLength();

  function pointAt(t) {
    const clamped = Math.max(0, Math.min(1, t));
    const target = clamped * pathLength;
    let travelled = 0;

    for (let i = 0; i < perimeter.length - 1; i++) {
      const a = perimeter[i];
      const b = perimeter[i + 1];
      const segment = Math.hypot(b.x - a.x, b.y - a.y);

      if (travelled + segment >= target) {
        const local = (target - travelled) / segment;
        const x = a.x + (b.x - a.x) * local;
        const y = a.y + (b.y - a.y) * local;
        const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        return { x, y, angle };
      }

      travelled += segment;
    }

    return { x: 120, y: 120, angle: 0 };
  }

  function logEvent(message) {
    const out = $("droneEventLog");
    const time = new Date().toLocaleTimeString();
    const line = `[${time}] ${message}`;

    if (out) {
      out.textContent += "\n" + line;
      out.scrollTop = out.scrollHeight;
    }

    if (typeof logPacket === "function") {
      logPacket("[DRONE-PERIMETER]", {
        version: "v0.3-drone-perimeter-preview",
        validation_mode: "PRE_HARDWARE_SIMULATED",
        type: "drone_perimeter_event",
        source: "DRONE_PERIMETER_PREVIEW",
        message,
        mission_state: state.missionState,
        coverage_percent: Math.round(state.coverage),
        scan_points: state.points.length,
        interpretation: "simulated drone perimeter preview, not real flight evidence"
      });
    }
  }

  function setBadge(text, mode = "simulated") {
    const badge = $("dronePerimeterBadge");
    if (!badge) return;
    badge.textContent = text;
    badge.className = `status-pill ${mode}`;
  }

  function phaseForCoverage(coverage) {
    if (coverage <= 0) return "IDLE / WAITING FOR SIMULATION";
    if (coverage < 20) return "TAKEOFF / INITIAL WALL ACQUISITION";
    if (coverage < 45) return "BOUNDARY FOLLOWING / FIRST SIDE";
    if (coverage < 70) return "CORNERING / OBSTACLE REVIEW";
    if (coverage < 95) return "FINAL WALL PASS / MAP CLOSURE";
    return "PERIMETER COMPLETE / READY FOR EXPORT";
  }

  function renderObstacles() {
    const group = $("droneObstacles");
    if (!group) return;

    if (!state.obstaclesVisible) {
      group.innerHTML = "";
      return;
    }

    group.innerHTML = obstacles.map((o) => `
      <g class="drone-obstacle" data-obstacle="${o.id}">
        <rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="12"></rect>
        <text x="${o.x + 12}" y="${o.y + 24}">${o.label}</text>
      </g>
    `).join("");
  }

  function renderMicrobots() {
    const group = $("droneMicrobots");
    if (!group) return;

    if (!state.microbotsVisible) {
      group.innerHTML = "";
      return;
    }

    group.innerHTML = microbotPositions.map((m) => `
      <g class="map-microbot" data-node="${m.id}">
        <circle cx="${m.x}" cy="${m.y}" r="18"></circle>
        <text x="${m.x}" y="${m.y + 4}" text-anchor="middle">${m.role}</text>
        <text x="${m.x}" y="${m.y + 32}" text-anchor="middle">${m.id}</text>
      </g>
    `).join("");
  }

  function renderScanPoints() {
    const group = $("droneScanPoints");
    if (!group) return;

    group.innerHTML = state.points.map((p, index) => `
      <circle class="scan-point" cx="${p.x}" cy="${p.y}" r="${index % 5 === 0 ? 5 : 3}"></circle>
    `).join("");
  }

  function updateProgressPath() {
    const progressPath = $("droneProgressPath");
    if (!progressPath) return;

    const progressLength = pathLength * (1 - Math.max(0, Math.min(1, state.t)));
    progressPath.style.strokeDasharray = String(pathLength);
    progressPath.style.strokeDashoffset = String(progressLength);
  }

  function updateStats() {
    const assign = (id, value) => {
      const el = $(id);
      if (el) el.textContent = String(value);
    };

    const linkQuality = typeof telemetryState !== "undefined" && telemetryState.quality ? telemetryState.quality : 94;

    assign("droneMissionState", state.missionState);
    assign("droneCoverage", `${Math.round(state.coverage)}%`);
    assign("droneDistance", `${state.distance.toFixed(1)} m`);
    assign("dronePointCount", state.points.length);
    assign("droneObstacleCount", state.obstaclesVisible ? obstacles.length : 0);
    assign("droneLinkQuality", `${linkQuality}/100`);
    assign("droneMissionPhase", phaseForCoverage(state.coverage));

    const phase = phaseForCoverage(state.coverage);
    if (phase !== state.lastPhase && state.running) {
      state.lastPhase = phase;
      logEvent(`mission phase: ${phase}`);
    }
  }

  function syncMicrobotStateWithDrone() {
    if (typeof executeNodeAction !== "function") return;

    if (state.coverage > 10 && state.coverage < 13) executeNodeAction("NODE_06_VISION_CAMERA", "VISION_SCAN");
    if (state.coverage > 35 && state.coverage < 38) executeNodeAction("NODE_05_TELEMETRY_SENSOR", "TELEMETRY_BURST");
    if (state.coverage > 60 && state.coverage < 63) executeNodeAction("NODE_02_PROXIMITY_SAFETY", "PROXIMITY_CHECK");
    if (state.coverage > 92 && state.coverage < 95) executeNodeAction("NODE_01_LED_STATE", "ACTIVE");
  }

  function frame() {
    if (!state.running || state.paused) return;

    state.t += state.speed;
    if (state.t >= 1) {
      state.t = 1;
      state.running = false;
      state.missionState = "COMPLETE";
      setBadge("PERIMETER COMPLETE", "ready");
      logEvent("perimeter mission complete; export is available");
    }

    const p = pointAt(state.t);
    const vehicle = $("droneVehicle");
    const cone = $("droneSensorCone");

    if (vehicle) vehicle.setAttribute("transform", `translate(${p.x},${p.y}) rotate(${p.angle})`);
    if (cone) cone.setAttribute("transform", `translate(${p.x},${p.y}) rotate(${p.angle})`);

    const last = state.points[state.points.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 28) {
      state.points.push({ x: Math.round(p.x), y: Math.round(p.y), t: Number(state.t.toFixed(4)) });
      renderScanPoints();
    }

    state.coverage = state.t * 100;
    state.distance = (state.t * pathLength) / 100;
    updateProgressPath();
    updateStats();
    syncMicrobotStateWithDrone();

    if (state.running) {
      state.raf = requestAnimationFrame(frame);
    }
  }

  function startMission() {
    resetMission(false);
    state.running = true;
    state.paused = false;
    state.missionState = "RUNNING";
    state.startedAt = new Date().toISOString();
    setBadge("PERIMETER RUNNING", "ready");
    logEvent("perimeter simulation started");
    state.raf = requestAnimationFrame(frame);

    if (typeof handleCommand === "function") {
      handleCommand("SCAN_NODES");
    }
  }

  function pauseMission() {
    if (!state.running) return;
    state.paused = true;
    state.missionState = "PAUSED";
    setBadge("PERIMETER PAUSED", "warning");
    updateStats();
    logEvent("perimeter simulation paused");
  }

  function resumeMission() {
    if (!state.paused) return;
    state.paused = false;
    state.running = true;
    state.missionState = "RUNNING";
    setBadge("PERIMETER RUNNING", "ready");
    updateStats();
    logEvent("perimeter simulation resumed");
    state.raf = requestAnimationFrame(frame);
  }

  function resetMission(shouldLog = true) {
    if (state.raf) cancelAnimationFrame(state.raf);
    state.running = false;
    state.paused = false;
    state.t = 0;
    state.coverage = 0;
    state.distance = 0;
    state.points = [];
    state.missionState = "IDLE";
    state.lastPhase = "IDLE";

    const p = pointAt(0);
    const vehicle = $("droneVehicle");
    const cone = $("droneSensorCone");

    if (vehicle) vehicle.setAttribute("transform", `translate(${p.x},${p.y}) rotate(${p.angle})`);
    if (cone) cone.setAttribute("transform", `translate(${p.x},${p.y}) rotate(${p.angle})`);

    renderScanPoints();
    updateProgressPath();
    updateStats();
    setBadge("PERIMETER SIM", "simulated");

    if (shouldLog) logEvent("perimeter simulation reset");
  }

  function toggleObstacles() {
    state.obstaclesVisible = !state.obstaclesVisible;
    renderObstacles();
    updateStats();
    logEvent(`obstacles ${state.obstaclesVisible ? "enabled" : "hidden"}`);
  }

  function toggleMicrobots() {
    state.microbotsVisible = !state.microbotsVisible;
    renderMicrobots();
    logEvent(`MicroBot map markers ${state.microbotsVisible ? "enabled" : "hidden"}`);
  }

  function exportPerimeter() {
    const payload = {
      generated_at: new Date().toISOString(),
      validation_mode: "PRE_HARDWARE_SIMULATED",
      hardware_validation_status: "not hardware-validated",
      mission_state: state.missionState,
      coverage_percent: Math.round(state.coverage),
      distance_m: Number(state.distance.toFixed(2)),
      scan_points: state.points,
      obstacles: state.obstaclesVisible ? obstacles : [],
      microbots: state.microbotsVisible ? microbotPositions : [],
      note: "Simulated drone perimeter preview. Not real drone flight, not real room mapping evidence."
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `microbot_drone_perimeter_preview_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    logEvent("perimeter JSON exported");
  }

  function bindControls() {
    $("btnDroneStart")?.addEventListener("click", startMission);
    $("btnDronePause")?.addEventListener("click", pauseMission);
    $("btnDroneResume")?.addEventListener("click", resumeMission);
    $("btnDroneReset")?.addEventListener("click", () => resetMission(true));
    $("btnDroneObstacles")?.addEventListener("click", toggleObstacles);
    $("btnDroneMicrobots")?.addEventListener("click", toggleMicrobots);
    $("btnDroneExport")?.addEventListener("click", exportPerimeter);
  }

  function patchShellIfPresent() {
    if (!window.MicroBotDashboardShell || !window.MicroBotDashboardShell.setActiveSection) return;

    const nav = document.querySelector(".shell-nav");
    if (nav && !nav.querySelector('[data-shell-target="drone-perimeter"]')) {
      const button = document.createElement("button");
      button.className = "shell-nav-item";
      button.dataset.shellTarget = "drone-perimeter";
      button.innerHTML = `<span>12</span><strong>Drone Perimeter</strong><small>room map preview</small>`;
      button.addEventListener("click", () => {
        window.MicroBotDashboardShell.setActiveSection("drone-perimeter");
        document.body.classList.remove("shell-nav-open");
      });
      nav.appendChild(button);
    }
  }

  function init() {
    renderObstacles();
    renderMicrobots();
    renderScanPoints();
    updateProgressPath();
    updateStats();
    bindControls();
    setTimeout(patchShellIfPresent, 80);
    setTimeout(patchShellIfPresent, 650);

    window.MicroBotDronePerimeterPreview = {
      startMission,
      pauseMission,
      resumeMission,
      resetMission,
      exportPerimeter,
      state
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
