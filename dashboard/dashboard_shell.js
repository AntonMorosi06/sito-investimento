(function () {
  "use strict";

  const SECTIONS = [
    { id: "overview", label: "Overview", icon: "01", match: ["Live Control Surface", "System state"], description: "status and global commands" },
    { id: "nodes", label: "Nodes", icon: "02", match: ["Per-Node Command Matrix", "Node Grid"], description: "six-node controls" },
    { id: "visual-swarm", label: "Visual Swarm", icon: "03", match: ["MicroBot Visual Swarm", "Stylized MicroBot"], description: "visual MicroBot field" },
    { id: "gesture", label: "Gesture Lab", icon: "04", match: ["Hand Gesture MicroBot Control"], description: "camera hand commands" },
    { id: "telemetry", label: "Telemetry", icon: "05", match: ["Telemetry Link Analysis"], description: "signal and data link" },
    { id: "data-center", label: "Data Center", icon: "06", match: ["Data Center"], description: "logs and snapshots" },
    { id: "os-console", label: "OS Console", icon: "07", match: ["MicroBot OS Console"], description: "runtime shell" },
    { id: "documentation", label: "Docs Viewer", icon: "10", match: ["Documentation Viewer"], description: "project reference library" },
    { id: "inspectors", label: "Inspectors", icon: "07", match: ["Packet / Node Inspector"], description: "state inspection" },
    { id: "terminal", label: "Terminal", icon: "08", match: ["Raw Protocol Terminal"], description: "raw stream" },
    { id: "evidence", label: "Evidence", icon: "09", match: ["Current Truth", "Evidence discipline"], description: "truth and docs" }
  ];

  const DOCS = [
    ["Current Evidence", "../docs/current_evidence_v0_3.md"],
    ["Andrea Map", "../docs/andrea_onboarding/README.md"],
    ["Parser Notes", "../docs/dashboard_parser_validation_notes_v0_3.md"],
    ["Telemetry Notes", "../docs/web_dashboard_data_telemetry_upgrade_v0_3.md"],
    ["Gesture Notes", "../docs/web_dashboard_gesture_control_upgrade_v0_3.md"],
    ["Hardware Plan", "../docs/node_00_master_real_serial_validation_v0_3.md"]
  ];

  const $ = (id) => document.getElementById(id);

  function sectionText(section) {
    return (section.textContent || "").replace(/\s+/g, " ").trim();
  }

  function classify(section) {
    if (section.dataset.appSection) return section.dataset.appSection;
    const content = sectionText(section);
    const heading = section.querySelector("h2")?.textContent || "";
    for (const item of SECTIONS) {
      if (item.match.some((m) => content.includes(m) || heading.includes(m))) return item.id;
    }
    return "overview";
  }

  function prepareSections() {
    const main = document.querySelector("main.layout");
    if (!main) return;
    main.classList.add("app-shell-main");
    Array.from(main.querySelectorAll(":scope > section.panel")).forEach((section) => {
      section.dataset.appSection = classify(section);
      section.classList.add("app-section");
    });
  }

  function buildShell() {
    if (document.querySelector(".app-shell-sidebar")) return;

    const sidebar = document.createElement("aside");
    sidebar.className = "app-shell-sidebar";
    sidebar.innerHTML = `
      <div class="shell-logo">
        <span>MB</span>
        <div><strong>MicroBot Labs</strong><small>v0.3 app shell</small></div>
      </div>
      <nav class="shell-nav">
        ${SECTIONS.map((s) => `
          <button class="shell-nav-item" data-shell-target="${s.id}">
            <span>${s.icon}</span><strong>${s.label}</strong><small>${s.description}</small>
          </button>`).join("")}
      </nav>
      <div class="shell-docs">
        <strong>Docs</strong>
        ${DOCS.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
      </div>
    `;
    document.body.prepend(sidebar);

    const topstrip = document.createElement("div");
    topstrip.className = "app-shell-topstrip";
    topstrip.innerHTML = `
      <button id="btnShellToggle" class="secondary">Sections</button>
      <span id="shellActiveLabel">Overview</span>
      <span class="shell-truth">PRE-HARDWARE / NOT HARDWARE-VALIDATED</span>
    `;
    document.body.prepend(topstrip);

    document.querySelector(".topbar")?.classList.add("app-shell-offset");
    document.querySelector("main.layout")?.classList.add("app-shell-offset");

    document.querySelectorAll("[data-shell-target]").forEach((button) => {
      button.addEventListener("click", () => {
        setActiveSection(button.dataset.shellTarget);
        document.body.classList.remove("shell-nav-open");
      });
    });

    $("btnShellToggle")?.addEventListener("click", () => {
      document.body.classList.toggle("shell-nav-open");
    });
  }

  function setActiveSection(id) {
    const target = id || "overview";
    document.querySelectorAll(".app-section").forEach((section) => {
      const active = section.dataset.appSection === target;
      section.hidden = !active;
      section.classList.toggle("app-section-active", active);
    });

    document.querySelectorAll(".shell-nav-item").forEach((button) => {
      button.classList.toggle("active", button.dataset.shellTarget === target);
    });

    const item = SECTIONS.find((s) => s.id === target);
    if ($("shellActiveLabel")) $("shellActiveLabel").textContent = item ? item.label : target;

    try { localStorage.setItem("microbot_dashboard_active_section", target); } catch (_) {}
    refreshDataCenter();
  }

  function currentSnapshot() {
    const terminal = $("terminal");
    return {
      generated_at: new Date().toISOString(),
      evidence_mode: typeof appState !== "undefined" ? appState.evidenceMode : "PRE_HARDWARE_SIMULATED",
      hardware_validation_status: "not hardware-validated",
      app_state: typeof appState !== "undefined" ? appState : {},
      nodes: typeof nodes !== "undefined" ? nodes : [],
      terminal_line_count: terminal ? terminal.textContent.split(/\r?\n/).filter(Boolean).length : 0,
      note: "Local dashboard snapshot. Not hardware evidence."
    };
  }

  function refreshDataCenter() {
    const snapshot = currentSnapshot();
    const assign = (id, value) => { if ($(id)) $(id).textContent = String(value); };
    assign("dataCenterPackets", snapshot.app_state.packetCount || 0);
    assign("dataCenterErrors", snapshot.app_state.errors || 0);
    assign("dataCenterWarnings", snapshot.app_state.warnings || 0);
    assign("dataCenterLines", snapshot.terminal_line_count || 0);
    if ($("dataStateSnapshot")) $("dataStateSnapshot").textContent = JSON.stringify(snapshot, null, 2);
  }

  function applyFilter() {
    const terminal = $("terminal");
    const output = $("dataFilteredLog");
    const input = $("dataLogFilter");
    if (!output) return;

    if (!terminal) {
      output.textContent = "Terminal not available.";
      return;
    }

    const q = (input?.value || "").trim().toLowerCase();
    const lines = terminal.textContent.split(/\r?\n/).filter(Boolean);
    const result = q ? lines.filter((line) => line.toLowerCase().includes(q)) : lines.slice(-140);
    output.textContent = result.join("\n") || (q ? `No terminal lines match: ${q}` : "No terminal events yet.");
  }

  async function copySnapshot() {
    const text = JSON.stringify(currentSnapshot(), null, 2);
    try { await navigator.clipboard.writeText(text); } catch (_) {}
  }

  function downloadSnapshot() {
    const text = JSON.stringify(currentSnapshot(), null, 2);
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `microbot_dashboard_snapshot_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function bindDataCenter() {
    $("btnApplyDataFilter")?.addEventListener("click", applyFilter);
    $("btnClearDataFilter")?.addEventListener("click", () => { if ($("dataLogFilter")) $("dataLogFilter").value = ""; applyFilter(); });
    $("btnCopyDataSnapshot")?.addEventListener("click", copySnapshot);
    $("btnDownloadDataSnapshot")?.addEventListener("click", downloadSnapshot);
    $("dataLogFilter")?.addEventListener("keydown", (e) => { if (e.key === "Enter") applyFilter(); });
  }

  function init() {
    prepareSections();
    buildShell();
    bindDataCenter();
    refreshDataCenter();
    setInterval(refreshDataCenter, 1000);
    let stored = null;
    try { stored = localStorage.getItem("microbot_dashboard_active_section"); } catch (_) {}
    const exists = stored && document.querySelector(`.app-section[data-app-section="${stored}"]`);
    setActiveSection(exists ? stored : "overview");
    window.MicroBotDashboardShell = { setActiveSection, refreshDataCenter, currentSnapshot, applyFilter };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
