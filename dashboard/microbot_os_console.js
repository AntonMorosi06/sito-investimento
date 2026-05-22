(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const osState = {
    booted: false,
    bootCount: 0,
    commandHistory: [],
    historyIndex: -1,
    kernelState: "MOCK_READY",
    drivers: [
      { name: "serial_adapter", status: "prepared", description: "future Web Serial / USB serial interface" },
      { name: "protocol_parser", status: "active", description: "JSON line command and telemetry parser" },
      { name: "dashboard_shell", status: "active", description: "web app shell, sidebar and sections" },
      { name: "telemetry_model", status: "simulated", description: "signal, latency, packet loss and quality model" },
      { name: "gesture_input", status: "browser-side", description: "camera/hand gesture control when enabled" },
      { name: "visual_swarm", status: "simulated", description: "stylized MicroBot response field" },
      { name: "documentation_viewer", status: "active", description: "local/reference document catalog" }
    ],
    modules: [
      { name: "NODE_00_MASTER", layer: "coordination", status: "mock-ready" },
      { name: "NODE_01_LED_STATE", layer: "visible-output", status: "simulated" },
      { name: "NODE_02_PROXIMITY_SAFETY", layer: "safety-sensing", status: "simulated" },
      { name: "NODE_03_MAGNETIC_DOCKING", layer: "docking", status: "simulated" },
      { name: "NODE_04_MOTION_ACTUATOR", layer: "motion", status: "simulated" },
      { name: "NODE_05_TELEMETRY_SENSOR", layer: "telemetry", status: "simulated" },
      { name: "NODE_06_VISION_CAMERA", layer: "vision", status: "simulated" }
    ]
  };

  function nowTime() {
    return new Date().toLocaleTimeString();
  }

  function line(text = "") {
    const out = $("osConsoleOutput");
    if (!out) return;
    out.textContent += text + "\n";
    out.scrollTop = out.scrollHeight;
  }

  function block(title, rows) {
    line("");
    line(`[${title}]`);
    rows.forEach((row) => line(`  ${row}`));
  }

  function setBadge(text, mode = "simulated") {
    const badge = $("osConsoleBadge");
    if (!badge) return;
    badge.textContent = text;
    badge.className = `status-pill ${mode}`;
  }

  function updateOsCards() {
    const assign = (id, value) => {
      const el = $(id);
      if (el) el.textContent = String(value);
    };

    const safety = typeof appState !== "undefined" ? appState.safety : "NORMAL";

    assign("osKernelState", osState.kernelState);
    assign("osModuleCount", osState.modules.length);
    assign("osDriverCount", osState.drivers.length);
    assign("osSafetyState", safety || "NORMAL");

    const clock = $("osClock");
    if (clock) clock.textContent = nowTime();
  }

  function dashboardSnapshot() {
    return {
      appState: typeof appState !== "undefined" ? appState : null,
      nodes: typeof nodes !== "undefined" ? nodes : [],
      telemetryState: typeof telemetryState !== "undefined" ? telemetryState : null,
      documentationCatalogSize: window.MicroBotDocumentationViewer?.catalog?.length || 0,
      evidenceMode: typeof appState !== "undefined" ? appState.evidenceMode : "PRE_HARDWARE_SIMULATED"
    };
  }

  function printHeader() {
    line("MicroBot OS Console v0.3");
    line("Browser-side MicroBot OS interface mock.");
    line("Evidence mode: PRE_HARDWARE_SIMULATED / NOT HARDWARE-VALIDATED");
    line("Type 'help' to list commands.");
  }

  function cmdHelp() {
    block("COMMANDS", [
      "help       show command list",
      "boot       run simulated MicroBot OS boot sequence",
      "status     print kernel/dashboard status",
      "kernel     inspect kernel/runtime layer",
      "drivers    list simulated hardware abstraction drivers",
      "modules    list OS service modules",
      "nodes      list six-node MicroBot state",
      "telemetry  print telemetry/data-link model",
      "gesture    print gesture-control status and mappings",
      "docs       print documentation viewer summary",
      "evidence   print evidence and validation boundary",
      "safety     print safety layer status",
      "demo       run a short OS console demo",
      "clear      clear OS console output",
      "reset      reset simulated dashboard state if available"
    ]);
  }

  function cmdBoot() {
    osState.booted = true;
    osState.bootCount += 1;
    osState.kernelState = "BOOTED_MOCK";
    setBadge("OS BOOTED", "ready");

    line("");
    line("[BOOT]");
    const rows = [
      "bootloader: browser runtime detected",
      "config: loading dashboard state registry",
      "kernel: initializing command router",
      "drivers: protocol_parser loaded",
      "drivers: dashboard_shell loaded",
      "drivers: telemetry_model prepared",
      "drivers: gesture_input optional",
      "drivers: serial_adapter prepared, no hardware validation yet",
      "services: diagnostics online",
      "services: safety layer online",
      "services: evidence guard online",
      "modules: NODE_00_MASTER + NODE_01..NODE_06 registered",
      "status: MicroBot OS mock boot complete"
    ];

    rows.forEach((row, index) => {
      setTimeout(() => {
        line(`  ${row}`);
        if (index === rows.length - 1) updateOsCards();
      }, index * 70);
    });
  }

  function cmdStatus() {
    const snap = dashboardSnapshot();
    block("STATUS", [
      `kernel_state: ${osState.kernelState}`,
      `booted: ${osState.booted}`,
      `boot_count: ${osState.bootCount}`,
      `evidence_mode: ${snap.evidenceMode}`,
      `hardware_validation: not hardware-validated`,
      `packet_count: ${snap.appState?.packetCount ?? 0}`,
      `warnings: ${snap.appState?.warnings ?? 0}`,
      `errors: ${snap.appState?.errors ?? 0}`,
      `safety: ${snap.appState?.safety ?? "NORMAL"}`,
      `nodes_registered: ${snap.nodes.length}`,
      `documentation_catalog_entries: ${snap.documentationCatalogSize}`
    ]);
  }

  function cmdKernel() {
    block("KERNEL LAYER", [
      "kernel_type: browser-side MicroBot OS mock",
      "responsibility: route commands, inspect modules, expose system status",
      "state_registry: dashboard appState + nodes + telemetry model",
      "event_bus: simulated through terminal/logPacket",
      "safety_guard: STOP / EMERGENCY_STOP / Gesture Safety Lock",
      "future_target: ESP32/FreeRTOS or custom embedded runtime layer"
    ]);
  }

  function cmdDrivers() {
    block("DRIVER LAYER", osState.drivers.map((d) => `${d.name.padEnd(22)} ${d.status.padEnd(14)} ${d.description}`));
  }

  function cmdModules() {
    block("MODULE TABLE", osState.modules.map((m) => `${m.name.padEnd(30)} ${m.layer.padEnd(18)} ${m.status}`));
  }

  function cmdNodes() {
    const snap = dashboardSnapshot();
    if (!snap.nodes.length) {
      line("[NODES] no node table available");
      return;
    }

    block("NODE STATES", snap.nodes.map((n) => {
      const id = String(n.id || "unknown").padEnd(30);
      const state = String(n.state || "UNKNOWN").padEnd(12);
      const online = n.online ? "ONLINE " : "OFFLINE";
      const out = n.virtualOutput || n.virtualLed || "N/A";
      return `${id} ${state} ${online} output=${out}`;
    }));
  }

  function cmdTelemetry() {
    const snap = dashboardSnapshot();
    const t = snap.telemetryState;

    if (!t) {
      block("TELEMETRY", [
        "telemetry model not found in global state",
        "open the Telemetry section or run telemetry upgrade first"
      ]);
      return;
    }

    block("TELEMETRY MODEL", [
      `mode: ${t.mode}`,
      `signal_dbm: ${t.signalDbm}`,
      `response_ms: ${Math.round(t.responseMs)}`,
      `packet_loss_percent: ${Number(t.packetLoss).toFixed(1)}`,
      `throughput_kbps: ${Number(t.throughputKbps).toFixed(1)}`,
      `jitter_ms: ${Math.round(t.jitterMs)}`,
      `packets_minute: ${Math.round(t.packetsMinute)}`,
      `battery_percent: ${Math.round(t.battery)}`,
      `temperature_c: ${Number(t.temperature).toFixed(1)}`,
      `quality: ${t.quality}/100`,
      "interpretation: simulated data-link model, not real ESP32 telemetry"
    ]);
  }

  function cmdGesture() {
    block("GESTURE INPUT", [
      "input_type: browser camera / hand landmarks",
      "status: optional browser-side control layer",
      "open_palm: SCAN_NODES",
      "closed_fist: STOP",
      "index_point: selected node ACTIVE",
      "pinch: selected node role action",
      "peace_v: SWARM_SWEEP",
      "three_fingers: MISSION_DEMO",
      "thumbs_up: ALL_ACTIVE",
      "thumbs_down: ALL_IDLE",
      "two_fists: EMERGENCY_STOP",
      "boundary: gesture input controls simulated dashboard unless hardware mode is explicitly connected and reviewed"
    ]);
  }

  function cmdDocs() {
    const count = window.MicroBotDocumentationViewer?.catalog?.length || 0;
    block("DOCUMENTATION VIEWER", [
      `catalog_entries: ${count}`,
      "local_docs: current evidence, onboarding, parser, telemetry, gesture, app shell",
      "reference_base: MicroBot_Documento_01-12, roadmap, BOM, OS, dimension engine, drone, safety, pitch, GitHub plan",
      "privacy: private PDFs are cataloged as reference entries, not automatically published",
      "command: open the Docs Viewer section from the sidebar"
    ]);
  }

  function cmdEvidence() {
    const snap = dashboardSnapshot();
    block("EVIDENCE GUARD", [
      `current_mode: ${snap.evidenceMode}`,
      "hardware_validation_status: not hardware-validated",
      "allowed_claim: dashboard/mock/pre-hardware simulation is prepared",
      "not_allowed_claim: ESP32 physical system validated",
      "next_real_step: upload firmware to real ESP32 and capture serial logs",
      "repository_rule: update README, changelog, current_status and evidence docs after real tests"
    ]);
  }

  function cmdSafety() {
    const snap = dashboardSnapshot();
    block("SAFETY LAYER", [
      `dashboard_safety_state: ${snap.appState?.safety ?? "NORMAL"}`,
      "safe_mode_command: STOP",
      "emergency_command: EMERGENCY_STOP",
      "gesture_safety: Gesture Safety Lock exists in browser gesture section",
      "hardware_boundary: real actuators/magnets/coils require physical safety validation",
      "current_scope: simulated dashboard safety behavior"
    ]);
  }

  function cmdDemo() {
    line("[DEMO] running MicroBot OS console demo...");
    const sequence = ["boot", "status", "drivers", "nodes", "telemetry", "evidence"];
    let delay = 0;
    sequence.forEach((cmd) => {
      delay += 500;
      setTimeout(() => runCommand(cmd, false), delay);
    });
  }

  function cmdReset() {
    if (typeof handleCommand === "function") {
      handleCommand("RESET");
      line("[RESET] dashboard RESET command sent.");
    } else {
      line("[RESET] handleCommand not available.");
    }
  }

  function runCommand(raw, echo = true) {
    const command = String(raw || "").trim().toLowerCase();
    if (!command) return;

    osState.commandHistory.push(command);
    osState.historyIndex = osState.commandHistory.length;

    if (echo) line(`microbot-os> ${command}`);

    if (command === "clear") {
      const out = $("osConsoleOutput");
      if (out) out.textContent = "";
      printHeader();
      return;
    }

    if (command === "help") cmdHelp();
    else if (command === "boot") cmdBoot();
    else if (command === "status") cmdStatus();
    else if (command === "kernel") cmdKernel();
    else if (command === "drivers") cmdDrivers();
    else if (command === "modules") cmdModules();
    else if (command === "nodes") cmdNodes();
    else if (command === "telemetry") cmdTelemetry();
    else if (command === "gesture") cmdGesture();
    else if (command === "docs") cmdDocs();
    else if (command === "evidence") cmdEvidence();
    else if (command === "safety") cmdSafety();
    else if (command === "demo") cmdDemo();
    else if (command === "reset") cmdReset();
    else {
      line(`[ERROR] unknown command: ${command}`);
      line("        type 'help' to list available commands");
    }

    updateOsCards();

    if (typeof logPacket === "function") {
      logPacket("[OS-CONSOLE]", {
        version: "v0.3-microbot-os-console",
        validation_mode: "PRE_HARDWARE_SIMULATED",
        type: "os_console_command",
        source: "MICROBOT_OS_CONSOLE",
        command,
        kernel_state: osState.kernelState,
        interpretation: "browser-side MicroBot OS console mock, not embedded boot evidence"
      });
    }
  }

  function bindConsole() {
    const input = $("osCommandInput");
    const run = $("btnOsRun");

    if (run) {
      run.addEventListener("click", () => {
        runCommand(input ? input.value : "help");
        if (input) {
          input.value = "";
          input.focus();
        }
      });
    }

    if (input) {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          runCommand(input.value);
          input.value = "";
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          osState.historyIndex = Math.max(0, osState.historyIndex - 1);
          input.value = osState.commandHistory[osState.historyIndex] || "";
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          osState.historyIndex = Math.min(osState.commandHistory.length, osState.historyIndex + 1);
          input.value = osState.commandHistory[osState.historyIndex] || "";
        }
      });
    }

    document.querySelectorAll("[data-os-command]").forEach((button) => {
      button.addEventListener("click", () => {
        const cmd = button.dataset.osCommand;
        runCommand(cmd);
      });
    });
  }

  function patchShellIfPresent() {
    if (!window.MicroBotDashboardShell || !window.MicroBotDashboardShell.setActiveSection) return;

    const nav = document.querySelector(".shell-nav");
    if (nav && !nav.querySelector('[data-shell-target="os-console"]')) {
      const button = document.createElement("button");
      button.className = "shell-nav-item";
      button.dataset.shellTarget = "os-console";
      button.innerHTML = `<span>11</span><strong>OS Console</strong><small>runtime shell</small>`;
      button.addEventListener("click", () => {
        window.MicroBotDashboardShell.setActiveSection("os-console");
        document.body.classList.remove("shell-nav-open");
      });
      nav.appendChild(button);
    }
  }

  function init() {
    bindConsole();
    updateOsCards();
    printHeader();
    setInterval(updateOsCards, 1000);
    setTimeout(patchShellIfPresent, 80);
    setTimeout(patchShellIfPresent, 650);

    window.MicroBotOSConsole = {
      runCommand,
      state: osState,
      snapshot: dashboardSnapshot
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
