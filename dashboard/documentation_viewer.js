(function () {
  "use strict";

  const BASE_DOCS = [
    {
      title: "Current Evidence v0.3",
      category: "Evidence",
      status: "local",
      path: "../docs/current_evidence_v0_3.md",
      summary: "Canonical evidence page for the current pre-hardware state, simulated validation, parser readiness and limits."
    },
    {
      title: "Andrea Onboarding Map",
      category: "Onboarding",
      status: "local",
      path: "../docs/andrea_onboarding/README.md",
      summary: "Entry point for Andrea: project overview, what to open first, how to run without hardware and what each document means."
    },
    {
      title: "Combined NODE_00 + NODE_01 Demo Report",
      category: "Evidence",
      status: "local",
      path: "../docs/combined_node00_node01_pre_hardware_demo_report_v0_3.md",
      summary: "Combined pre-hardware demonstration report for Master and LED-state node simulation."
    },
    {
      title: "Dashboard Parser Validation Notes",
      category: "Dashboard",
      status: "local",
      path: "../docs/dashboard_parser_validation_notes_v0_3.md",
      summary: "Notes on offline dashboard parser validation, JSONL handling and simulated telemetry parsing."
    },
    {
      title: "NODE_00 Master Real Serial Validation Plan",
      category: "Hardware",
      status: "local",
      path: "../docs/node_00_master_real_serial_validation_v0_3.md",
      summary: "Plan for validating real ESP32 serial communication once hardware is available."
    },
    {
      title: "NODE_01 LED State Pre-Hardware Simulation",
      category: "Hardware",
      status: "local",
      path: "../docs/node_01_led_state_pre_hardware_simulation_v0_3.md",
      summary: "Pre-hardware simulation plan and behavior for the first visible LED state node."
    },
    {
      title: "Dashboard Data Telemetry Upgrade",
      category: "Telemetry",
      status: "local",
      path: "../docs/web_dashboard_data_telemetry_upgrade_v0_3.md",
      summary: "Telemetry/data-management layer: signal strength, latency, packet loss, throughput, jitter and link quality."
    },
    {
      title: "Browser Hand Gesture Control Upgrade",
      category: "Gesture",
      status: "local",
      path: "../docs/web_dashboard_gesture_control_upgrade_v0_3.md",
      summary: "Browser-side gesture control using hand landmarks and mapped simulated MicroBot commands."
    },
    {
      title: "Six-Node Dashboard Visual Upgrade",
      category: "Dashboard",
      status: "local",
      path: "../docs/web_dashboard_six_node_visual_upgrade_v0_3.md",
      summary: "Six-node simulated controls, visual MicroBot swarm and state transitions."
    },
    {
      title: "Web App Shell / Sidebar Upgrade",
      category: "Dashboard",
      status: "local",
      path: "../docs/web_dashboard_app_shell_upgrade_v0_3.md",
      summary: "Sidebar, section routing, Data Center and web-app organization."
    },
    {
      title: "Minimum BOM / Amazon Search List",
      category: "BOM",
      status: "local",
      path: "../docs/purchase/minimum_bom_amazon_search_list_v0_3.md",
      summary: "Minimum shopping/search list for first ESP32 and pre-hardware-to-hardware transition."
    }
  ];

  const REFERENCE_DOCS = [
    {
      title: "MicroBot_Documento_01_Executive_Summary.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Strategic and technical executive summary for professors, collaborators, portfolio and pitch."
    },
    {
      title: "MicroBot_Documento_02_BOM_Piano_Acquisti.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Bill of materials and purchase plan for Master ESP32, six nodes, PC controller, simulation and mockup."
    },
    {
      title: "MicroBot_Documento_03_Hardware_Architecture.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Hardware architecture v0.1: Master/Node structure, power, pinout, ESP32, sensors, OLED, servo, docking and camera."
    },
    {
      title: "MicroBot_Documento_04_Firmware_Communication_Protocol.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Firmware and JSON protocol specification: states, commands, heartbeat, telemetry, error handling and transports."
    },
    {
      title: "MicroBot_Documento_05_PC_Controller_Dashboard_Specification.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "PC dashboard specification connecting user, Master ESP32, nodes, telemetry, camera, terminal and dimensional simulation."
    },
    {
      title: "MicroBot_Documento_06_Simulation_Dimensional_Engine_Specification.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Simulation/dimensional engine specification for 3D/4D/5D/6D as defensible computational state models."
    },
    {
      title: "MicroBot_Documento_07_Testing_Validation_Plan.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Testing and validation plan for Master, six nodes, dashboard, protocol, telemetry, safety and demo."
    },
    {
      title: "MicroBot_Documento_08_Physical_Design_CAD_Specification.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Physical/CAD specification for shell, mockup, functional prototype, nodes and miniaturization path."
    },
    {
      title: "MicroBot_Documento_09_Risk_Safety_Document.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Risk and safety document: electronics, power, coils, magnets, camera/privacy, firmware watchdog, timeout and emergency stop."
    },
    {
      title: "MicroBot_Documento_10_Demo_Script_Runbook.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Runbook for recording and presenting the v0.1 demo with Master ESP32, nodes, controller, simulation and fallback."
    },
    {
      title: "MicroBot_Documento_11_Pitch_Deck_Content_Strategy.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "Pitch strategy for professors, collaborators, technical community, portfolio and investors."
    },
    {
      title: "MicroBot_Documento_12_GitHub_Portfolio_Publication_Plan.pdf",
      category: "Operational Series 01-12",
      status: "reference",
      summary: "GitHub/portfolio publication plan: what to publish, repo architecture, README, releases, privacy and checklist."
    },
    {
      title: "MicroBot_Roadmap_6_Mesi_Prototipi_Reali.pdf",
      category: "Roadmap",
      status: "reference",
      summary: "Six-month roadmap from theory/documentation to physical and software demonstrator: PC→Master ESP32→Node→Dashboard."
    },
    {
      title: "MicroBot_Ecosystem_Indice_Finale_Libro.pdf",
      category: "Book / Thesis",
      status: "reference",
      summary: "Final editorial index for a unified technical MicroBot book: foundations, architecture, hardware, simulation, OS, AI and publication."
    },
    {
      title: "Documentazione_microbot.pdf",
      category: "Mother Documentation",
      status: "private",
      summary: "Large mother document of the MicroBot ecosystem, exported from Pages, with the complete index and narrative architecture."
    },
    {
      title: "Documentazione_Microbot_OS.pdf",
      category: "MicroBot OS",
      status: "private",
      summary: "Technical MicroBot OS Lab documentation: QEMU, ESP32/FreeRTOS, boot, kernel, drivers, framebuffer, shell and event log."
    },
    {
      title: "prototipo_fisico e fondamento teorico del sistema.pdf",
      category: "Prototype / Theory",
      status: "private",
      summary: "MicroBot physical prototype and theoretical foundation: roadmap, architecture, hardware, firmware, states and safety."
    },
    {
      title: "piano di acquisto e organizzazione microbot.pdf",
      category: "BOM",
      status: "private",
      summary: "MicroBot Home Lab purchase and organization guide: tools, ESP32, sensors, power, soldering, budget and folders."
    },
    {
      title: "Senza nome.pdf — Dalla quarta alla sedicesima dimensione",
      category: "Dimension Engine",
      status: "private",
      summary: "Thesis/reference on dimensions from 4D to 16D, geometry, theoretical physics, information spaces and visualization cautions."
    },
    {
      title: "tesi microbot.pdf / tesi microbot (1)(2).pdf",
      category: "Book / Thesis",
      status: "private",
      summary: "Extended thesis on MicroBot as modular swarm robotics with magnetic aggregation, ESP32, geometry, Boids, VR/BCI and roadmap."
    },
    {
      title: "tutto insieme.pdf / tutto insieme 2.pdf",
      category: "Mother Documentation",
      status: "private",
      summary: "Large structural and architectural compilation of the MicroBot workspace, folders, documentation and integrations."
    },
    {
      title: "DOCUMENT 1.pdf — Electromagnetism in MicroBot Systems",
      category: "Magnetism / Physics",
      status: "private",
      summary: "Electromagnetism, magnetic coupling and physical modeling references for MicroBot modules."
    },
    {
      title: "Misure microbot.pdf",
      category: "Physical Design",
      status: "private",
      summary: "Preliminary dimensional measurements and sizing considerations for the MicroBot module."
    },
    {
      title: "Relazione Telemetria.pdf",
      category: "Telemetry",
      status: "private",
      summary: "Telemetry module reference: web app, gesture input, neural motion engine and operational terminal concepts."
    },
    {
      title: "MicroBot OS — Evoluzione progressiva v0.1-v2.0.pdf",
      category: "MicroBot OS",
      status: "private",
      summary: "Progressive operating-system evolution: bootloader, kernel, framebuffer, shell, diagnostics, events and modular architecture."
    },
    {
      title: "Neural Networks.pdf",
      category: "AI / ML",
      status: "private",
      summary: "Neural network, XAI and interactive visualization material connected to the broader MicroBot ecosystem."
    },
    {
      title: "fotocamera biometrica.pdf / codice spiegazione fotocamera.pdf",
      category: "Vision / Security",
      status: "private",
      summary: "Camera, biometric/facial recognition, landmarks, similarity thresholds, Java/JavaFX/OpenCV and access control."
    },
    {
      title: "tesi altri progetti.pdf / description of all the projects.pdf",
      category: "Portfolio",
      status: "private",
      summary: "General project ecosystem: AI, games, data science, computer vision, gesture recognition, telemetry, security and design patterns."
    },
    {
      title: "MICROBOT_ECOSYSTEM.zip",
      category: "Workspace / Repo",
      status: "private",
      summary: "Large ecosystem workspace skeleton with sections 00_META through 15_RELEASES and extensive modular architecture."
    },
    {
      title: "web.zip",
      category: "Web Platform",
      status: "private",
      summary: "Real web/demo material: MicroBot dashboard, face auth, AR lab, simulations, network, viewer3D, energy, swarm mesh and sensors."
    },
    {
      title: "DOCUMENTAZIONE 2.zip",
      category: "Mother Documentation",
      status: "private",
      summary: "Additional documentation base for MicroBot, dimension engine, simulations and Pages materials."
    },
    {
      title: "Micro drone / GLB / Blender asset library",
      category: "Drone / 3D Assets",
      status: "private",
      summary: "Drone complete models, exploded/assembled GLB assets, sensor arrays, carrier rails, dashboard and telemetry visuals."
    },
    {
      title: "Google Cybersecurity Certificate notes",
      category: "Cybersecurity",
      status: "private",
      summary: "Cybersecurity study materials to be used defensively: Linux, SQL, networks, risk, assets, threats, vulnerabilities and incident response."
    },
    {
      title: "Appunti-Fondamenti-Informatica.pdf",
      category: "University / CS",
      status: "private",
      summary: "Foundations of Computer Science notes: sets, relations, induction, graphs, combinatorics and exam preparation base."
    }
  ];

  const ALL_DOCS = [...BASE_DOCS, ...REFERENCE_DOCS];

  const $ = (id) => document.getElementById(id);

  function uniqueCategories() {
    return [...new Set(ALL_DOCS.map((doc) => doc.category))].sort();
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function matches(doc, query, category, status) {
    const q = normalize(query);
    const full = normalize(`${doc.title} ${doc.category} ${doc.status} ${doc.summary} ${doc.path || ""}`);

    if (q && !full.includes(q)) return false;
    if (category !== "all" && doc.category !== category) return false;
    if (status !== "all" && doc.status !== status) return false;
    return true;
  }

  function statusLabel(status) {
    const map = {
      local: "LOCAL REPO DOC",
      reference: "REFERENCE BASE",
      private: "PRIVATE SOURCE",
      planned: "PLANNED"
    };
    return map[status] || status.toUpperCase();
  }

  function renderCategoryFilters() {
    const select = $("docCategoryFilter");
    const pills = $("docCategoryPills");
    if (!select || !pills) return;

    const cats = uniqueCategories();

    select.innerHTML = `<option value="all">All categories</option>` + cats.map((cat) => `<option value="${cat}">${cat}</option>`).join("");

    pills.innerHTML = [`<button class="doc-pill active" data-doc-category="all">All</button>`]
      .concat(cats.map((cat) => `<button class="doc-pill" data-doc-category="${cat}">${cat}</button>`))
      .join("");

    pills.querySelectorAll("[data-doc-category]").forEach((button) => {
      button.addEventListener("click", () => {
        select.value = button.dataset.docCategory;
        renderDocs();
      });
    });
  }

  function docCard(doc) {
    const statusClass = `doc-status-${doc.status}`;
    const link = doc.path
      ? `<a class="doc-open-link" href="${doc.path}">Open local doc</a>`
      : `<span class="doc-open-link disabled">Catalog only</span>`;

    return `
      <article class="doc-card ${statusClass}">
        <div class="doc-card-top">
          <span class="doc-category">${doc.category}</span>
          <span class="doc-status">${statusLabel(doc.status)}</span>
        </div>
        <h3>${doc.title}</h3>
        <p>${doc.summary}</p>
        <div class="doc-card-actions">
          ${link}
          <button class="secondary doc-copy-btn" data-doc-title="${encodeURIComponent(doc.title)}">Copy title</button>
        </div>
      </article>
    `;
  }

  function updateStats(visible) {
    const local = ALL_DOCS.filter((doc) => doc.status === "local").length;
    if ($("docVisibleCount")) $("docVisibleCount").textContent = String(visible.length);
    if ($("docTotalCount")) $("docTotalCount").textContent = String(ALL_DOCS.length);
    if ($("docLocalCount")) $("docLocalCount").textContent = String(local);
  }

  function renderDocs() {
    const grid = $("docViewerGrid");
    if (!grid) return;

    const query = $("docSearchInput") ? $("docSearchInput").value : "";
    const category = $("docCategoryFilter") ? $("docCategoryFilter").value : "all";
    const status = $("docStatusFilter") ? $("docStatusFilter").value : "all";

    const visible = ALL_DOCS.filter((doc) => matches(doc, query, category, status));
    grid.innerHTML = visible.map(docCard).join("") || `<div class="doc-empty">No documents match the current filters.</div>`;

    document.querySelectorAll(".doc-pill").forEach((pill) => {
      pill.classList.toggle("active", pill.dataset.docCategory === category);
    });

    document.querySelectorAll(".doc-copy-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const title = decodeURIComponent(button.dataset.docTitle || "");
        try { await navigator.clipboard.writeText(title); } catch (_) {}
      });
    });

    updateStats(visible);
  }

  function exportCatalog() {
    const payload = {
      generated_at: new Date().toISOString(),
      evidence_mode: "PRE_HARDWARE_DOCUMENTATION_VIEWER",
      hardware_validation_status: "not hardware-validated",
      total_documents: ALL_DOCS.length,
      local_documents: ALL_DOCS.filter((doc) => doc.status === "local").length,
      catalog: ALL_DOCS
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `microbot_documentation_catalog_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function bindControls() {
    $("docSearchInput")?.addEventListener("input", renderDocs);
    $("docCategoryFilter")?.addEventListener("change", renderDocs);
    $("docStatusFilter")?.addEventListener("change", renderDocs);
    $("btnDocReset")?.addEventListener("click", () => {
      if ($("docSearchInput")) $("docSearchInput").value = "";
      if ($("docCategoryFilter")) $("docCategoryFilter").value = "all";
      if ($("docStatusFilter")) $("docStatusFilter").value = "all";
      renderDocs();
    });
    $("btnDocExport")?.addEventListener("click", exportCatalog);
  }

  function patchShellIfPresent() {
    if (!window.MicroBotDashboardShell || !window.MicroBotDashboardShell.setActiveSection) return;
    // The shell script classifies this section via data-app-section="documentation".
    // If the sidebar was already built before this script loaded, add a soft link to Docs.
    const nav = document.querySelector(".shell-nav");
    if (nav && !nav.querySelector('[data-shell-target="documentation"]')) {
      const button = document.createElement("button");
      button.className = "shell-nav-item";
      button.dataset.shellTarget = "documentation";
      button.innerHTML = `<span>10</span><strong>Docs Viewer</strong><small>reference library</small>`;
      button.addEventListener("click", () => {
        window.MicroBotDashboardShell.setActiveSection("documentation");
        document.body.classList.remove("shell-nav-open");
      });
      nav.appendChild(button);
    }
  }

  function init() {
    renderCategoryFilters();
    bindControls();
    renderDocs();
    setTimeout(patchShellIfPresent, 80);
    setTimeout(patchShellIfPresent, 600);

    window.MicroBotDocumentationViewer = {
      catalog: ALL_DOCS,
      renderDocs,
      exportCatalog
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
