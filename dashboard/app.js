const NODE_DEFINITIONS = [
  {
    id: "NODE_01_LED_STATE",
    label: "LED State",
    role: "Visible state node",
    short: "LED",
    position: { x: 16, y: 20 },
    roleAction: "ACTIVE"
  },
  {
    id: "NODE_02_PROXIMITY_SAFETY",
    label: "Proximity",
    role: "Distance and safety zone simulation",
    short: "PROX",
    position: { x: 84, y: 20 },
    roleAction: "PROXIMITY_CHECK"
  },
  {
    id: "NODE_03_MAGNETIC_DOCKING",
    label: "Docking",
    role: "Magnetic docking state simulation",
    short: "DOCK",
    position: { x: 13, y: 62 },
    roleAction: "DOCK"
  },
  {
    id: "NODE_04_MOTION_ACTUATOR",
    label: "Motion",
    role: "Motion actuator / vibration simulation",
    short: "MOTION",
    position: { x: 87, y: 62 },
    roleAction: "MOTION_PULSE"
  },
  {
    id: "NODE_05_TELEMETRY_SENSOR",
    label: "Telemetry",
    role: "IMU, energy and telemetry stream simulation",
    short: "TEL",
    position: { x: 32, y: 88 },
    roleAction: "TELEMETRY_BURST"
  },
  {
    id: "NODE_06_VISION_CAMERA",
    label: "Vision",
    role: "Camera / vision state simulation",
    short: "VISION",
    position: { x: 68, y: 88 },
    roleAction: "VISION_SCAN"
  }
];

const nodes = [
  {
    id: "NODE_00_MASTER",
    label: "Master",
    role: "Command router / coordinator",
    short: "MASTER",
    state: "READY",
    online: true,
    virtualOutput: "ROUTER_READY",
    evidence: "mock",
    position: { x: 50, y: 50 }
  },
  ...NODE_DEFINITIONS.map((node) => ({
    ...node,
    state: "IDLE",
    online: true,
    virtualOutput: "IDLE",
    evidence: "pre-hardware"
  }))
];

const appState = {
  connected: false,
  transport: "mock",
  mode: "OFFLINE MOCK",
  master: "READY",
  safety: "NORMAL",
  seq: 0,
  packetCount: 0,
  warnings: 0,
  errors: 0,
  lastCommand: "none",
  lastPacketType: "none",
  lastPacket: null,
  terminalLines: 0,
  evidenceMode: "PRE_HARDWARE_SIMULATED",
  selectedNodeId: "NODE_01_LED_STATE"
};

let serialAdapter = null;

const $ = (id) => document.getElementById(id);

function normalizeClass(value) {
  return String(value || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function stringify(value) {
  return JSON.stringify(value, null, 2);
}

function nodeById(id) {
  return nodes.find((node) => node.id === id);
}

function plannedNodes() {
  return nodes.filter((node) => node.id !== "NODE_00_MASTER");
}

function nextSeq() {
  appState.seq += 1;
  return appState.seq;
}

function outputForNodeState(node, state, action = "") {
  if (state === "OFFLINE") return "OFFLINE";
  if (state === "SAFE_MODE") return "SAFE_OUTPUT";
  if (state === "WARNING") return "WARNING_OUTPUT";
  if (state === "ERROR" || state === "EMERGENCY") return "ERROR_OUTPUT";
  if (state === "IDLE" || state === "READY") return "IDLE";

  const byNode = {
    NODE_01_LED_STATE: "LED_ON",
    NODE_02_PROXIMITY_SAFETY: "PROXIMITY_SCAN",
    NODE_03_MAGNETIC_DOCKING: "DOCKING_FIELD",
    NODE_04_MOTION_ACTUATOR: "MOTION_PULSE",
    NODE_05_TELEMETRY_SENSOR: "TELEMETRY_STREAM",
    NODE_06_VISION_CAMERA: "VISION_SCAN"
  };

  if (action === "RESET") return "IDLE";
  return byNode[node.id] || "ACTIVE_OUTPUT";
}

function stateForAction(action) {
  const map = {
    ACTIVE: "ACTIVE",
    IDLE: "IDLE",
    WARNING: "WARNING",
    ERROR: "ERROR",
    SAFE_MODE: "SAFE_MODE",
    RESET: "IDLE",
    PROXIMITY_CHECK: "ACTIVE",
    DOCK: "ACTIVE",
    MOTION_PULSE: "ACTIVE",
    TELEMETRY_BURST: "ACTIVE",
    VISION_SCAN: "ACTIVE",
    ROLE_ACTION: "ACTIVE"
  };
  return map[action] || "ACTIVE";
}

function payloadForNodeAction(node, action, state, virtualOutput) {
  const payload = {
    node_id: node.id,
    label: node.label,
    role: node.role,
    action,
    state,
    virtual_output: virtualOutput,
    simulated: true,
    validation_mode: appState.evidenceMode
  };

  if (node.id === "NODE_01_LED_STATE") {
    payload.led_state = virtualOutput;
  }

  if (node.id === "NODE_02_PROXIMITY_SAFETY") {
    payload.distance_cm = state === "WARNING" ? 7 : state === "ERROR" ? 2 : 38;
    payload.safety_zone = state === "WARNING" || state === "ERROR" ? "NEAR_OBJECT" : "CLEAR";
  }

  if (node.id === "NODE_03_MAGNETIC_DOCKING") {
    payload.magnetic_field = state === "ACTIVE" ? "ALIGNING" : "IDLE";
    payload.docking_status = action === "DOCK" ? "SIMULATED_DOCK_LOCK" : "SIMULATED_DOCK_READY";
  }

  if (node.id === "NODE_04_MOTION_ACTUATOR") {
    payload.motion_vector = state === "ACTIVE" ? { x: 1, y: 0, z: 0 } : { x: 0, y: 0, z: 0 };
    payload.actuator_mode = state === "ACTIVE" ? "PULSE" : "IDLE";
  }

  if (node.id === "NODE_05_TELEMETRY_SENSOR") {
    payload.telemetry = {
      battery_percent: state === "ERROR" ? 12 : 86,
      temperature_c: state === "WARNING" ? 43.2 : 29.4,
      imu_state: state === "ACTIVE" ? "STREAMING" : "IDLE"
    };
  }

  if (node.id === "NODE_06_VISION_CAMERA") {
    payload.vision = {
      camera_state: state === "ACTIVE" ? "SCANNING" : "IDLE",
      detected_markers: state === "ACTIVE" ? 3 : 0,
      confidence: state === "ACTIVE" ? 0.92 : 0
    };
  }

  return payload;
}

function buildPacket(type, source, command, status, payload, extra = {}) {
  return {
    version: "v0.3-six-node-dashboard",
    validation_mode: appState.evidenceMode,
    type,
    source,
    target: "PC_CONTROLLER",
    seq: nextSeq(),
    timestamp_ms: Date.now(),
    command,
    status,
    state: extra.state,
    virtual_output: extra.virtualOutput,
    payload
  };
}

function setEvidenceMode(mode) {
  appState.evidenceMode = mode;
  const badge = $("evidenceBadge");
  if (!badge) return;

  badge.textContent = mode;
  badge.className = "status-pill";

  if (mode.includes("SERIAL") || mode.includes("HARDWARE")) badge.classList.add("warning");
  else if (mode.includes("SIMULATED")) badge.classList.add("simulated");
  else badge.classList.add("info");
}

function logPacket(prefix, packet) {
  const terminal = $("terminal");
  const text = `${prefix} ${stringify(packet)}\n\n`;
  terminal.textContent += text;
  terminal.scrollTop = terminal.scrollHeight;

  appState.terminalLines += text.split("\n").length;
  appState.lastPacket = clone(packet);
  appState.lastPacketType = packet.type || "unknown";

  $("terminalCount").textContent = `${appState.terminalLines} lines`;
  $("packetInspector").textContent = stringify(packet);
}

function logText(prefix, message) {
  logPacket(prefix, {
    type: "dashboard_event",
    source: "DASHBOARD",
    message,
    timestamp_ms: Date.now()
  });
}

function setNodeState(id, state, online = true, options = {}) {
  const node = nodeById(id);
  if (!node) return;

  node.state = state || node.state;
  node.online = online;

  if (Object.prototype.hasOwnProperty.call(options, "virtualOutput")) {
    node.virtualOutput = options.virtualOutput;
  } else if (id !== "NODE_00_MASTER") {
    node.virtualOutput = outputForNodeState(node, node.state, options.action || "");
  }

  if (options.evidence) {
    node.evidence = options.evidence;
  }

  pulseMicrobot(id);
}

function pulseMicrobot(id) {
  const el = document.querySelector(`[data-bot-id="${id}"]`);
  if (!el) return;

  el.classList.remove("pulse", "move");
  void el.offsetWidth;
  el.classList.add("pulse", "move");
  setTimeout(() => el.classList.remove("pulse", "move"), 900);
}

function renderNodeSelect() {
  const nodeSelect = $("nodeSelect");
  if (!nodeSelect) return;

  nodeSelect.innerHTML = plannedNodes()
    .map((node) => `<option value="${node.id}">${node.id} — ${node.label}</option>`)
    .join("");

  nodeSelect.value = appState.selectedNodeId;
}

function renderNodeControlGrid() {
  const grid = $("nodeControlGrid");
  if (!grid) return;

  grid.innerHTML = "";

  plannedNodes().forEach((node) => {
    const card = document.createElement("div");
    card.className = "control-card";
    card.innerHTML = `
      <h3>${node.id}</h3>
      <p>${node.role}</p>
      <div class="mini-buttons">
        <button data-node-action="${node.id}:ACTIVE">ACTIVE</button>
        <button data-node-action="${node.id}:IDLE">IDLE</button>
        <button data-node-action="${node.id}:WARNING" class="warning">WARN</button>
        <button data-node-action="${node.id}:ERROR" class="danger">ERROR</button>
        <button data-node-action="${node.id}:${node.roleAction}" class="secondary">ROLE</button>
        <button data-node-action="${node.id}:RESET" class="secondary">RESET</button>
      </div>
    `;

    grid.appendChild(card);
  });

  grid.querySelectorAll("[data-node-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const [nodeId, action] = button.dataset.nodeAction.split(":");
      executeNodeAction(nodeId, action);
    });
  });
}

function renderNodes() {
  const grid = $("nodeGrid");
  grid.innerHTML = "";

  nodes.forEach((node) => {
    const card = document.createElement("div");
    const stateClass = normalizeClass(node.state);
    const outputClass = normalizeClass(node.virtualOutput);

    card.className = `node-card ${stateClass}`;
    card.innerHTML = `
      <strong>${node.id}</strong>
      <div class="label">${node.label}</div>
      <div class="node-role">${node.role}</div>
      <span class="badge ${stateClass}">${node.state}</span>
      <span class="badge">${node.online ? "ONLINE" : "OFFLINE"}</span>
      <span class="badge ${outputClass}">${node.virtualOutput}</span>
      <span class="badge">${node.evidence}</span>
    `;

    card.addEventListener("click", () => {
      appState.selectedNodeId = node.id === "NODE_00_MASTER" ? "NODE_01_LED_STATE" : node.id;
      if ($("nodeSelect")) $("nodeSelect").value = appState.selectedNodeId;
      $("nodeInspector").textContent = stringify(node);
    });

    grid.appendChild(card);
  });
}

function renderMicrobots() {
  const container = $("microbotVisuals");
  if (!container) return;

  container.innerHTML = "";

  plannedNodes().forEach((node) => {
    const stateClass = normalizeClass(node.state);
    const bot = document.createElement("div");
    bot.className = `microbot ${stateClass} ${node.online ? "" : "offline"}`;
    bot.dataset.botId = node.id;
    bot.style.left = `${node.position.x}%`;
    bot.style.top = `${node.position.y}%`;

    bot.innerHTML = `
      <div class="bot-signal"></div>
      <div class="microbot-inner">
        <div class="bot-core"></div>
        <div class="bot-eye"></div>
      </div>
      <div class="bot-label">${node.short}<br>${node.state}</div>
    `;

    bot.addEventListener("click", () => {
      appState.selectedNodeId = node.id;
      if ($("nodeSelect")) $("nodeSelect").value = node.id;
      $("nodeInspector").textContent = stringify(node);
      pulseMicrobot(node.id);
    });

    container.appendChild(bot);
  });
}

function renderMetrics() {
  $("connectionState").textContent = appState.connected ? `CONNECTED / ${appState.transport.toUpperCase()}` : "DISCONNECTED";
  $("masterState").textContent = appState.master;
  $("safetyState").textContent = appState.safety;
  $("operationMode").textContent = appState.mode;
  $("packetCount").textContent = String(appState.packetCount);
  $("warningCount").textContent = String(appState.warnings);
  $("errorCount").textContent = String(appState.errors);
  $("onlineNodes").textContent = String(nodes.filter((node) => node.online).length);
  $("lastCommand").textContent = appState.lastCommand;
  $("lastPacketType").textContent = appState.lastPacketType;

  const masterBadge = $("masterBadge");
  if (masterBadge) {
    masterBadge.textContent = appState.master;
    masterBadge.className = `status-pill ${normalizeClass(appState.master)}`;
  }

  $("simulationMode").textContent = appState.evidenceMode;
  $("nodeInspector").textContent = stringify(nodeById(appState.selectedNodeId) || nodes);
}

function renderAll() {
  renderNodeSelect();
  renderNodeControlGrid();
  renderNodes();
  renderMicrobots();
  renderMetrics();
}

function resetMockState() {
  appState.connected = true;
  appState.transport = "mock";
  appState.mode = "OFFLINE MOCK";
  appState.master = "READY";
  appState.safety = "NORMAL";
  appState.lastCommand = "none";
  setEvidenceMode("PRE_HARDWARE_SIMULATED");

  setNodeState("NODE_00_MASTER", "READY", true, { virtualOutput: "ROUTER_READY", evidence: "mock" });
  plannedNodes().forEach((node) => {
    setNodeState(node.id, "IDLE", true, {
      virtualOutput: "IDLE",
      evidence: "pre-hardware"
    });
  });
}

function updateSafetyFromNodes() {
  if (nodes.some((node) => node.state === "EMERGENCY")) {
    appState.safety = "EMERGENCY";
    return;
  }
  if (nodes.some((node) => node.state === "ERROR")) {
    appState.safety = "WARNING";
    return;
  }
  if (nodes.some((node) => node.state === "WARNING")) {
    appState.safety = "WARNING";
    return;
  }
  if (nodes.some((node) => node.state === "SAFE_MODE")) {
    appState.safety = "SAFE_MODE";
    return;
  }
  appState.safety = "NORMAL";
}

function executeNodeAction(nodeId, action) {
  const node = nodeById(nodeId);
  if (!node || node.id === "NODE_00_MASTER") return null;

  const resolvedAction = action === "ROLE_ACTION" ? node.roleAction : action;
  const state = stateForAction(resolvedAction);
  const virtualOutput = outputForNodeState(node, state, resolvedAction);

  appState.lastCommand = `${node.short}_${resolvedAction}`;
  setNodeState(node.id, state, true, {
    virtualOutput,
    evidence: "pre-hardware",
    action: resolvedAction
  });

  if (state === "WARNING") appState.warnings += 1;
  if (state === "ERROR") appState.errors += 1;

  updateSafetyFromNodes();

  const packet = buildPacket(
    state === "ERROR" ? "error" : "response",
    node.id,
    resolvedAction,
    state === "ERROR" ? "ERROR" : "OK",
    payloadForNodeAction(node, resolvedAction, state, virtualOutput),
    { state, virtualOutput }
  );

  applyIncomingPacket(packet, "[RX-NODE]");
  return packet;
}

function executeAllNodes(action, delay = 80) {
  plannedNodes().forEach((node, index) => {
    setTimeout(() => executeNodeAction(node.id, action), index * delay);
  });
}

function runSwarmSweep() {
  appState.mode = "SIX NODE SWARM SWEEP";
  setEvidenceMode("PRE_HARDWARE_SIMULATED");

  const sequence = [
    ["NODE_01_LED_STATE", "ACTIVE"],
    ["NODE_02_PROXIMITY_SAFETY", "PROXIMITY_CHECK"],
    ["NODE_03_MAGNETIC_DOCKING", "DOCK"],
    ["NODE_04_MOTION_ACTUATOR", "MOTION_PULSE"],
    ["NODE_05_TELEMETRY_SENSOR", "TELEMETRY_BURST"],
    ["NODE_06_VISION_CAMERA", "VISION_SCAN"],
    ["NODE_06_VISION_CAMERA", "IDLE"],
    ["NODE_05_TELEMETRY_SENSOR", "IDLE"],
    ["NODE_04_MOTION_ACTUATOR", "IDLE"],
    ["NODE_03_MAGNETIC_DOCKING", "IDLE"],
    ["NODE_02_PROXIMITY_SAFETY", "IDLE"],
    ["NODE_01_LED_STATE", "IDLE"]
  ];

  logText("[DEMO]", "Running six-node swarm sweep.");

  sequence.forEach(([nodeId, action], index) => {
    setTimeout(() => executeNodeAction(nodeId, action), index * 220);
  });
}

function runMissionDemo() {
  appState.mode = "SIX NODE MISSION DEMO";
  setEvidenceMode("PRE_HARDWARE_SIMULATED");

  const sequence = [
    ["NODE_01_LED_STATE", "ACTIVE"],
    ["NODE_02_PROXIMITY_SAFETY", "PROXIMITY_CHECK"],
    ["NODE_06_VISION_CAMERA", "VISION_SCAN"],
    ["NODE_05_TELEMETRY_SENSOR", "TELEMETRY_BURST"],
    ["NODE_03_MAGNETIC_DOCKING", "DOCK"],
    ["NODE_04_MOTION_ACTUATOR", "MOTION_PULSE"],
    ["NODE_02_PROXIMITY_SAFETY", "WARNING"],
    ["NODE_04_MOTION_ACTUATOR", "SAFE_MODE"],
    ["NODE_02_PROXIMITY_SAFETY", "IDLE"],
    ["NODE_04_MOTION_ACTUATOR", "IDLE"],
    ["NODE_03_MAGNETIC_DOCKING", "IDLE"],
    ["NODE_05_TELEMETRY_SENSOR", "IDLE"],
    ["NODE_06_VISION_CAMERA", "IDLE"],
    ["NODE_01_LED_STATE", "IDLE"]
  ];

  logText("[DEMO]", "Running simulated mission: LED signal, proximity check, vision scan, telemetry, docking and motion response.");

  sequence.forEach(([nodeId, action], index) => {
    setTimeout(() => executeNodeAction(nodeId, action), index * 260);
  });
}

function handleCommand(command) {
  appState.lastCommand = command;

  if (appState.transport === "serial" && serialAdapter) {
    sendCommandToSerial(command);
    return;
  }

  handleMockCommand(command);
}

function handleMockCommand(command) {
  const tx = {
    version: "v0.3-six-node-dashboard",
    validation_mode: appState.evidenceMode,
    type: "command",
    source: "PC_CONTROLLER",
    target: "NODE_00_MASTER",
    command,
    timestamp_ms: Date.now()
  };

  logPacket("[TX-MOCK]", tx);

  if (!appState.connected) resetMockState();

  let rx;

  if (command === "PING") {
    rx = buildPacket("response", "NODE_00_MASTER", "PING", "OK", { message: "PONG" }, { state: appState.master, virtualOutput: "ROUTER_READY" });
  } else if (command === "STATUS") {
    rx = buildPacket("response", "NODE_00_MASTER", "STATUS", "OK", {
      master_state: appState.master,
      safety_state: appState.safety,
      online_nodes: nodes.filter((node) => node.online).length,
      planned_nodes: 6,
      validation_mode: appState.evidenceMode
    }, { state: appState.master, virtualOutput: "ROUTER_READY" });
  } else if (command === "GET_NODE_TABLE") {
    rx = buildPacket("response", "NODE_00_MASTER", "GET_NODE_TABLE", "OK", {
      nodes: nodes.map((node) => ({
        id: node.id,
        state: node.state,
        online: node.online,
        role: node.role,
        virtual_output: node.virtualOutput,
        evidence: node.evidence
      }))
    }, { state: appState.master, virtualOutput: "ROUTER_READY" });
  } else if (command === "SCAN_NODES") {
    plannedNodes().forEach((node) => setNodeState(node.id, node.state === "OFFLINE" ? "IDLE" : node.state, true, { evidence: "pre-hardware" }));
    rx = buildPacket("response", "NODE_00_MASTER", "SCAN_NODES", "OK", {
      expected_nodes: 6,
      online_nodes: plannedNodes().filter((node) => node.online).length,
      mode: "six_node_dashboard_mock"
    }, { state: appState.master, virtualOutput: "ROUTER_READY" });
  } else if (command === "ALL_ACTIVE") {
    executeAllNodes("ACTIVE");
    rx = buildPacket("response", "NODE_00_MASTER", "ALL_ACTIVE", "OK", { message: "All six nodes scheduled ACTIVE" }, { state: appState.master });
  } else if (command === "ALL_IDLE") {
    executeAllNodes("IDLE");
    rx = buildPacket("response", "NODE_00_MASTER", "ALL_IDLE", "OK", { message: "All six nodes scheduled IDLE" }, { state: appState.master });
  } else if (command === "SWARM_SWEEP") {
    runSwarmSweep();
    rx = buildPacket("response", "NODE_00_MASTER", "SWARM_SWEEP", "OK", { message: "Six-node sweep started" }, { state: appState.master });
  } else if (command === "MISSION_DEMO") {
    runMissionDemo();
    rx = buildPacket("response", "NODE_00_MASTER", "MISSION_DEMO", "OK", { message: "Mission demo started" }, { state: appState.master });
  } else if (command === "STOP") {
    appState.master = "SAFE_MODE";
    appState.safety = "SAFE_MODE";
    setNodeState("NODE_00_MASTER", "SAFE_MODE", true, { virtualOutput: "SAFE_ROUTER", evidence: "mock" });
    plannedNodes().forEach((node) => setNodeState(node.id, "SAFE_MODE", true, {
      virtualOutput: "SAFE_OUTPUT",
      evidence: "pre-hardware"
    }));
    rx = buildPacket("response", "NODE_00_MASTER", "STOP", "OK", { message: "All nodes entered SAFE_MODE", safe: true }, { state: "SAFE_MODE" });
  } else if (command === "EMERGENCY_STOP") {
    appState.master = "EMERGENCY";
    appState.safety = "EMERGENCY";
    appState.errors += 1;
    setNodeState("NODE_00_MASTER", "EMERGENCY", true, { virtualOutput: "EMERGENCY_ROUTER", evidence: "mock" });
    plannedNodes().forEach((node) => setNodeState(node.id, "SAFE_MODE", true, {
      virtualOutput: "SAFE_OUTPUT",
      evidence: "pre-hardware"
    }));
    rx = buildPacket("response", "NODE_00_MASTER", "EMERGENCY_STOP", "OK", { message: "Emergency stop active across simulated six-node field", safe: true }, { state: "EMERGENCY" });
  } else if (command === "RESET") {
    resetMockState();
    rx = buildPacket("response", "NODE_00_MASTER", "RESET", "OK", { message: "Dashboard mock reset to READY" }, { state: "READY", virtualOutput: "ROUTER_READY" });
  } else if (command.startsWith("NODE_")) {
    rx = handleManualNodeCommand(command);
    if (!rx) {
      appState.errors += 1;
      rx = buildPacket("error", "NODE_00_MASTER", command, "ERROR", { error_code: "UNKNOWN_NODE_COMMAND", message: "Unsupported node command" }, { state: appState.master });
    }
  } else {
    appState.errors += 1;
    rx = buildPacket("error", "NODE_00_MASTER", command, "ERROR", {
      error_code: "UNKNOWN_COMMAND",
      message: "Unsupported dashboard command"
    }, { state: appState.master });
  }

  if (rx) applyIncomingPacket(rx, "[RX-MOCK]");
}

function handleManualNodeCommand(command) {
  const parts = command.trim().split(/\s+/);
  const nodeToken = parts[0];
  const actionToken = parts[1] || "ROLE_ACTION";

  let node = nodeById(nodeToken);

  if (!node && /^NODE_0?[1-6]$/.test(nodeToken)) {
    const number = nodeToken.replace("NODE_", "").padStart(2, "0");
    node = plannedNodes().find((item) => item.id.startsWith(`NODE_${number}_`));
  }

  if (!node || node.id === "NODE_00_MASTER") return null;

  return executeNodeAction(node.id, actionToken);
}

function mapDashboardCommandToSerial(command) {
  const map = {
    ALL_ACTIVE: "ALL_ACTIVE",
    ALL_IDLE: "ALL_IDLE",
    SWARM_SWEEP: "SCAN_NODES",
    MISSION_DEMO: "STATUS"
  };
  return map[command] || command;
}

async function sendCommandToSerial(command) {
  const serialCommand = mapDashboardCommandToSerial(command);

  const tx = {
    version: "v0.3-six-node-dashboard",
    type: "command",
    source: "PC_CONTROLLER",
    target: "NODE_00_MASTER_OR_SELECTED_NODE",
    command: serialCommand,
    dashboard_command: command,
    timestamp_ms: Date.now()
  };

  logPacket("[TX-SERIAL]", tx);

  const sent = await serialAdapter.sendLine(serialCommand);

  if (!sent) {
    appState.errors += 1;
    renderAll();
  }
}

function normalizePacket(packet) {
  if (window.MicroBotProtocolParser) {
    return window.MicroBotProtocolParser.normalizePacket(packet);
  }
  return packet;
}

function applyIncomingPacket(packet, prefix = "[RX]") {
  const normalized = normalizePacket(packet);
  appState.packetCount += 1;
  appState.lastPacketType = normalized.type || "unknown";

  if (normalized.validation_mode) setEvidenceMode(normalized.validation_mode);

  if (normalized.source === "NODE_00_MASTER") {
    const nextMaster = normalized.state || normalized.payload?.master_state;
    if (nextMaster) {
      appState.master = nextMaster;
      setNodeState("NODE_00_MASTER", nextMaster, true, { evidence: normalized.validation_mode ? "pre-hardware" : "mock" });
    }

    if (normalized.payload?.safety_state) appState.safety = normalized.payload.safety_state;
    if (normalized.command === "STOP") appState.safety = "SAFE_MODE";
    if (normalized.command === "RESET") {
      appState.master = "READY";
      appState.safety = "NORMAL";
    }
  }

  if (normalized.source && normalized.source !== "NODE_00_MASTER" && nodeById(normalized.source)) {
    const node = nodeById(normalized.source);
    const nextState = normalized.state || normalized.payload?.state || "ACTIVE";
    const output = normalized.virtual_output || normalized.payload?.virtual_output || outputForNodeState(node, nextState, normalized.command);
    setNodeState(normalized.source, nextState, true, {
      virtualOutput: output,
      evidence: normalized.validation_mode ? "pre-hardware" : "mock"
    });

    if (nextState === "WARNING") appState.warnings += 1;
    if (nextState === "ERROR") appState.errors += 1;
  }

  if (normalized.type === "error" && normalized.source === "NODE_00_MASTER") appState.errors += 1;
  updateSafetyFromNodes();

  logPacket(prefix, normalized);
  renderAll();
}

function parseJsonlWrapperLine(line) {
  const wrapper = JSON.parse(line);
  if (wrapper && typeof wrapper.content === "string") {
    return JSON.parse(wrapper.content);
  }
  return wrapper;
}

async function loadNode00Fixture() {
  setEvidenceMode("PRE_HARDWARE_SIMULATED");
  appState.mode = "FIXTURE PLAYBACK";
  appState.transport = "fixture";
  appState.connected = true;

  try {
    const response = await fetch("test_fixtures/pre_hardware_node00_master_sample.jsonl", { cache: "no-store" });
    if (!response.ok) throw new Error(`Fixture request failed: ${response.status}`);

    const text = await response.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    logText("[FIXTURE]", `Loading NODE_00 fixture with ${lines.length} JSONL lines.`);

    for (const line of lines) {
      const wrapper = JSON.parse(line);
      if (wrapper.direction && wrapper.direction !== "SIM_RX") continue;
      const packet = parseJsonlWrapperLine(line);
      applyIncomingPacket(packet, "[RX-FIXTURE]");
    }

    logText("[FIXTURE]", "NODE_00 fixture playback completed.");
  } catch (error) {
    appState.errors += 1;
    logPacket("[FIXTURE-ERROR]", {
      type: "error",
      source: "DASHBOARD",
      error_code: "FIXTURE_LOAD_FAILED",
      message: error.message,
      hint: "Run via python3 -m http.server 8000, not directly as file://"
    });
  }

  renderAll();
}

function handleSerialLine(line) {
  if (!window.MicroBotProtocolParser) {
    logPacket("[RX-RAW]", { raw: line });
    return;
  }

  const parsed = window.MicroBotProtocolParser.safeParseLine(line);

  if (!parsed.ok) {
    appState.errors += 1;
    logPacket("[PARSE-ERROR]", parsed);
    renderAll();
    return;
  }

  setEvidenceMode("HARDWARE_CAPTURED_PENDING_REVIEW");
  applyIncomingPacket(parsed.packet, "[RX-SERIAL]");
}

function handleSerialEvent(event) {
  logPacket("[SERIAL]", event);
}

function handleSerialError(error) {
  appState.errors += 1;
  logPacket("[SERIAL-ERROR]", error);

  if (error.code === "WEB_SERIAL_UNAVAILABLE") {
    appState.mode = "WEB SERIAL UNAVAILABLE";
    appState.transport = "mock";
  }

  renderAll();
}

async function connectWebSerial() {
  appState.mode = "WEB SERIAL READY";
  setEvidenceMode("WEB_SERIAL_READY");
  renderAll();

  if (!window.MicroBotSerialAdapter) {
    handleSerialError({
      code: "SERIAL_ADAPTER_MISSING",
      message: "Serial adapter module is not loaded."
    });
    return;
  }

  if (!serialAdapter) {
    serialAdapter = new window.MicroBotSerialAdapter.SerialAdapter({
      baudRate: 115200,
      onLine: handleSerialLine,
      onEvent: handleSerialEvent,
      onError: handleSerialError
    });
  }

  const connected = await serialAdapter.connect();

  if (connected) {
    appState.connected = true;
    appState.transport = "serial";
    appState.mode = "WEB SERIAL CONNECTED";
    appState.master = "READY";
    appState.safety = "NORMAL";
    setEvidenceMode("HARDWARE_CAPTURED_PENDING_REVIEW");
    setNodeState("NODE_00_MASTER", "READY", true, { evidence: "hardware-pending-review" });
    renderAll();
  } else {
    appState.transport = "mock";
    appState.mode = "OFFLINE MOCK";
    setEvidenceMode("PRE_HARDWARE_SIMULATED");
    renderAll();
  }
}

function startOfflineMock() {
  resetMockState();

  const rx = buildPacket("event", "NODE_00_MASTER", "MOCK_CONNECT", "OK", {
    event: "DASHBOARD_SIX_NODE_MOCK_CONNECTED",
    message: "Six-node offline mock data source connected",
    simulated: true
  }, { state: "READY", virtualOutput: "ROUTER_READY" });

  applyIncomingPacket(rx, "[RX-MOCK]");
}

function clearTerminal() {
  $("terminal").textContent = "";
  appState.terminalLines = 0;
  $("terminalCount").textContent = "0 lines";
}

function exportLog() {
  const blob = new Blob([$("terminal").textContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  a.href = url;
  a.download = `microbot_six_node_dashboard_log_${stamp}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function sendManualCommand() {
  const input = $("manualCommand");
  const command = input.value.trim();
  if (!command) return;
  handleCommand(command.toUpperCase());
}

function sendSelectedNodeAction() {
  const nodeId = $("nodeSelect").value;
  const action = $("nodeActionSelect").value;
  executeNodeAction(nodeId, action);
}

function runSelectedRoleAction() {
  const node = nodeById($("nodeSelect").value);
  if (!node) return;
  executeNodeAction(node.id, node.roleAction || "ACTIVE");
}

document.addEventListener("DOMContentLoaded", () => {
  renderNodeSelect();
  renderNodeControlGrid();

  document.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => handleCommand(button.dataset.command));
  });

  $("btnMockConnect").addEventListener("click", startOfflineMock);
  $("btnCombinedDemo").addEventListener("click", () => handleCommand("MISSION_DEMO"));
  $("btnSwarmSweep").addEventListener("click", () => handleCommand("SWARM_SWEEP"));
  $("btnAllActive").addEventListener("click", () => handleCommand("ALL_ACTIVE"));
  $("btnAllIdle").addEventListener("click", () => handleCommand("ALL_IDLE"));
  $("btnLoadFixture").addEventListener("click", loadNode00Fixture);
  $("btnWebSerial").addEventListener("click", connectWebSerial);
  $("btnClear").addEventListener("click", clearTerminal);
  $("btnExportLog").addEventListener("click", exportLog);
  $("btnSendManual").addEventListener("click", sendManualCommand);
  $("btnSendNodeAction").addEventListener("click", sendSelectedNodeAction);
  $("btnRoleAction").addEventListener("click", runSelectedRoleAction);
  $("btnWarningAll").addEventListener("click", () => executeAllNodes("WARNING"));
  $("btnErrorAll").addEventListener("click", () => executeAllNodes("ERROR"));

  $("manualCommand").addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendManualCommand();
  });

  $("nodeSelect").addEventListener("change", (event) => {
    appState.selectedNodeId = event.target.value;
    $("nodeInspector").textContent = stringify(nodeById(appState.selectedNodeId));
    pulseMicrobot(appState.selectedNodeId);
  });

  $("packetInspector").textContent = "{}";
  $("nodeInspector").textContent = stringify(nodes);

  renderAll();
  startOfflineMock();
});

/* -------------------------------------------------------------------------- */
/* v0.3 Monochrome Data + Telemetry Upgrade                                   */
/* -------------------------------------------------------------------------- */

const telemetryState = {
  mode: "GOOD",
  signalDbm: -54,
  responseMs: 42,
  packetLoss: 0.8,
  throughputKbps: 18.4,
  jitterMs: 5,
  packetsMinute: 240,
  battery: 86,
  temperature: 29.4,
  transport: "mock/jsonl",
  quality: 94
};

function clampTelemetry(value, min, max) { return Math.max(min, Math.min(max, value)); }
function signalToPercent(dbm) { return clampTelemetry(Math.round(((dbm + 95) / 55) * 100), 0, 100); }
function inverseTelemetryPercent(value, max) { return clampTelemetry(Math.round(100 - (value / max) * 100), 0, 100); }

function calculateTelemetryQuality() {
  const signalScore = signalToPercent(telemetryState.signalDbm);
  const latencyScore = inverseTelemetryPercent(telemetryState.responseMs, 260);
  const lossScore = inverseTelemetryPercent(telemetryState.packetLoss, 18);
  const jitterScore = inverseTelemetryPercent(telemetryState.jitterMs, 80);
  telemetryState.quality = clampTelemetry(Math.round(signalScore * 0.35 + latencyScore * 0.25 + lossScore * 0.25 + jitterScore * 0.15), 0, 100);
  return telemetryState.quality;
}

function telemetryHealthLabel() {
  const q = telemetryState.quality;
  if (q >= 82) return "STABLE LINK";
  if (q >= 58) return "REVIEW LINK";
  return "CRITICAL LINK";
}

function telemetryHealthClass() {
  const q = telemetryState.quality;
  if (q >= 82) return "ready";
  if (q >= 58) return "warning";
  return "simulated";
}

function setTelemetryScenario(mode) {
  telemetryState.mode = mode;
  const profiles = {
    GOOD: [-54, 42, 0.8, 18.4, 5, 240, 86, 29.4, "mock/jsonl"],
    WEAK: [-82, 126, 6.4, 7.8, 21, 122, 72, 32.8, "weak-sim"],
    CONGESTED: [-67, 188, 9.6, 5.2, 38, 90, 69, 37.1, "congested-sim"],
    STRESS: [-88, 244, 14.8, 2.1, 63, 48, 51, 44.6, "stress-sim"]
  };
  const p = profiles[mode] || profiles.GOOD;
  [telemetryState.signalDbm, telemetryState.responseMs, telemetryState.packetLoss, telemetryState.throughputKbps, telemetryState.jitterMs, telemetryState.packetsMinute, telemetryState.battery, telemetryState.temperature, telemetryState.transport] = p;
  calculateTelemetryQuality();
  updateTelemetryFromNodes();
  renderTelemetry();
  logTelemetryEvent(mode);
}

function updateTelemetryFromNodes() {
  if (typeof nodes === "undefined") return;
  const activeCount = nodes.filter((node) => node.id !== "NODE_00_MASTER" && node.state === "ACTIVE").length;
  const warningCount = nodes.filter((node) => node.state === "WARNING").length;
  const errorCount = nodes.filter((node) => node.state === "ERROR" || node.state === "EMERGENCY").length;
  telemetryState.responseMs = clampTelemetry(telemetryState.responseMs + activeCount * 3 + warningCount * 12 + errorCount * 26, 20, 320);
  telemetryState.packetLoss = clampTelemetry(telemetryState.packetLoss + warningCount * 0.7 + errorCount * 1.8, 0, 25);
  telemetryState.jitterMs = clampTelemetry(telemetryState.jitterMs + warningCount * 3 + errorCount * 7, 1, 120);
  telemetryState.temperature = clampTelemetry(telemetryState.temperature + activeCount * 0.35 + errorCount * 1.5, 20, 65);
  telemetryState.packetsMinute = clampTelemetry(telemetryState.packetsMinute + activeCount * 18 - errorCount * 16, 20, 420);
  telemetryState.throughputKbps = clampTelemetry(telemetryState.throughputKbps + activeCount * 1.2 - errorCount * 2.1, 1, 48);
  telemetryState.battery = clampTelemetry(telemetryState.battery - activeCount * 0.15 - errorCount * 0.4, 0, 100);
  calculateTelemetryQuality();
}

function nodeTelemetryRow(node, index) {
  const baseSignal = telemetryState.signalDbm - index * 2 - (node.state === "ERROR" ? 10 : 0) - (node.state === "WARNING" ? 5 : 0);
  const latency = clampTelemetry(telemetryState.responseMs + index * 4 + (node.state === "ERROR" ? 80 : 0), 15, 500);
  const loss = clampTelemetry(telemetryState.packetLoss + index * 0.35 + (node.state === "ERROR" ? 5 : 0), 0, 40);
  const packets = clampTelemetry(Math.round(telemetryState.packetsMinute / 6 + (node.state === "ACTIVE" ? 22 : 0) - (node.state === "ERROR" ? 18 : 0)), 0, 140);
  const battery = clampTelemetry(Math.round(telemetryState.battery - index * 2 - (node.state === "ACTIVE" ? 3 : 0)), 0, 100);
  const quality = clampTelemetry(Math.round(signalToPercent(baseSignal) * 0.4 + inverseTelemetryPercent(latency, 500) * 0.3 + inverseTelemetryPercent(loss, 40) * 0.3), 0, 100);
  let health = "GOOD";
  let healthClass = "telemetry-health-good";
  if (quality < 70) { health = "REVIEW"; healthClass = "telemetry-health-review"; }
  if (quality < 45 || node.state === "ERROR") { health = "CRITICAL"; healthClass = "telemetry-health-critical"; }
  return `<tr><td><strong>${node.short || node.id}</strong><br><span class="label">${node.id}</span></td><td>${baseSignal} dBm</td><td>${latency} ms</td><td>${loss.toFixed(1)}%</td><td>${packets}</td><td>${battery}%</td><td class="${healthClass}">${health}</td></tr>`;
}

function assignTelemetryText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
function assignTelemetryWidth(id, percent) { const el = document.getElementById(id); if (el) el.style.width = `${clampTelemetry(percent, 0, 100)}%`; }

function renderTelemetry() {
  calculateTelemetryQuality();
  const q = telemetryState.quality;
  assignTelemetryText("telemetrySignal", `${telemetryState.signalDbm} dBm`);
  assignTelemetryText("telemetryResponseTime", `${Math.round(telemetryState.responseMs)} ms`);
  assignTelemetryText("telemetryPacketLoss", `${telemetryState.packetLoss.toFixed(1)}%`);
  assignTelemetryText("telemetryQuality", `${q} / 100`);
  assignTelemetryText("telemetryThroughput", `${telemetryState.throughputKbps.toFixed(1)} kb/s`);
  assignTelemetryText("telemetryJitter", `${Math.round(telemetryState.jitterMs)} ms`);
  assignTelemetryText("telemetryPacketsMinute", `${Math.round(telemetryState.packetsMinute)}`);
  assignTelemetryText("telemetryBattery", `${Math.round(telemetryState.battery)}%`);
  assignTelemetryText("telemetryTemperature", `${telemetryState.temperature.toFixed(1)} °C`);
  assignTelemetryText("telemetryTransport", telemetryState.transport);
  assignTelemetryWidth("telemetrySignalBar", signalToPercent(telemetryState.signalDbm));
  assignTelemetryWidth("telemetryResponseBar", inverseTelemetryPercent(telemetryState.responseMs, 260));
  assignTelemetryWidth("telemetryLossBar", inverseTelemetryPercent(telemetryState.packetLoss, 18));
  assignTelemetryWidth("telemetryQualityBar", q);
  const badge = document.getElementById("telemetryHealthBadge");
  if (badge) { badge.textContent = telemetryHealthLabel(); badge.className = `status-pill ${telemetryHealthClass()}`; }
  const body = document.getElementById("telemetryTableBody");
  if (body && typeof nodes !== "undefined") body.innerHTML = nodes.filter((node) => node.id !== "NODE_00_MASTER").map((node, index) => nodeTelemetryRow(node, index)).join("");
}

function logTelemetryEvent(mode) {
  if (typeof logPacket !== "function") return;
  logPacket("[TELEMETRY]", {
    version: "v0.3-telemetry-model",
    validation_mode: "PRE_HARDWARE_SIMULATED",
    type: "telemetry",
    source: "DASHBOARD_TELEMETRY_MODEL",
    target: "PC_CONTROLLER",
    mode,
    signal_dbm: telemetryState.signalDbm,
    response_ms: telemetryState.responseMs,
    packet_loss_percent: telemetryState.packetLoss,
    throughput_kbps: telemetryState.throughputKbps,
    jitter_ms: telemetryState.jitterMs,
    packets_minute: telemetryState.packetsMinute,
    battery_percent: telemetryState.battery,
    temperature_c: telemetryState.temperature,
    link_quality: telemetryState.quality,
    interpretation: "simulated telemetry model, not real ESP32 telemetry"
  });
}

function bindTelemetryButtons() {
  const bind = (id, mode) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => setTelemetryScenario(mode));
  };
  bind("btnTelemetryGood", "GOOD");
  bind("btnTelemetryWeak", "WEAK");
  bind("btnTelemetryCongested", "CONGESTED");
  bind("btnTelemetryStress", "STRESS");
  bind("btnTelemetryReset", "GOOD");
}

document.addEventListener("DOMContentLoaded", () => {
  bindTelemetryButtons();
  setTelemetryScenario("GOOD");
  ["btnAllActive", "btnAllIdle", "btnSwarmSweep", "btnCombinedDemo", "btnWarningAll", "btnErrorAll"].forEach((id) => {
    const button = document.getElementById(id);
    if (button) button.addEventListener("click", () => setTimeout(() => { updateTelemetryFromNodes(); renderTelemetry(); }, 420));
  });
});
