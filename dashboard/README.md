# MicroBot Labs — Dashboard v0.2

This folder contains the first public PC Controller Dashboard baseline for MicroBot Labs.

## Purpose

The dashboard is the operational cockpit of the MicroBot system.

It is designed to show:

- connection state;
- Master state;
- node cards;
- command panel;
- telemetry and event summary;
- raw protocol terminal;
- safety state;
- simulation placeholder.

## Current Mode

The current version runs in offline/mock mode.

It does not yet connect to a physical ESP32.

This is intentional: the dashboard state model, command flow and visual layout can be validated before hardware is available.

## How to Open

From the repository root, run:

open web/dashboard/index.html

## What This Validates

The dashboard validates:

- basic PC Controller layout;
- command-to-log flow;
- Master state visualization;
- NODE_01 state visualization;
- STOP and EMERGENCY_STOP behavior;
- simulation placeholder mapping;
- future Web Serial integration direction.

## What This Does Not Validate Yet

This dashboard does not yet validate:

- real ESP32 serial connection;
- real firmware response;
- real GPIO/LED behavior;
- real sensor telemetry;
- real actuator behavior;
- real hardware safety.

## Next Step

The next dashboard step is to add a Web Serial adapter or a local serial bridge so the dashboard can read actual messages from NODE_00_MASTER firmware.


## Web Serial Preparation

The dashboard now includes two preparation modules:

- protocol_parser.js
- serial_adapter.js

These files prepare the future transition from offline/mock packets to real USB Serial packets from NODE_00_MASTER.

The dashboard still works without hardware. When ESP32 hardware is available, the Web Serial button will be used to request a serial port and receive line-based JSON-like packets from the Master firmware.

For local file usage, Web Serial may not be available depending on browser and context. In that case, the offline/mock mode remains the fallback.


## Dashboard Modes

The dashboard now distinguishes between several modes:

| Mode | Meaning |
|---|---|
| OFFLINE MOCK | Simulated packets, no ESP32 required |
| WEB SERIAL READY | Browser is preparing the serial request |
| WEB SERIAL CONNECTED | Browser serial port is connected |
| WEB SERIAL UNAVAILABLE | Current browser/context does not support Web Serial |

Use Start Offline Mock when the ESP32 is not connected.

Use Web Serial Hardware Only only when the ESP32 is connected and running compatible firmware.

<!-- MICROBOT_DASHBOARD_V03_MOCK_OUTPUT_INTEGRATION_START -->
## v0.3 Dashboard and Mock Output Integration

The dashboard now has dedicated v0.3 integration notes for using the pre-hardware NODE_00_MASTER mock output as a parser and state-mapping preparation layer.

Relevant files:

- `docs/dashboard_mock_output_integration_notes_v0_3.md`
- `docs/dashboard_mock_output_test_plan_v0_3.md`
- `tools/offline/mock_node00_master_responder.py`
- `demos/demo_v0_3/pre_hardware_mock_node00_master/logs/`

The simulated packet path is:

`mock_node00_master_responder.py -> simulated JSONL/raw log -> dashboard parser/state mapping`

The future hardware packet path is:

`ESP32 NODE_00_MASTER -> Web Serial -> serial_adapter.js -> protocol_parser.js -> dashboard state mapping`

The two paths should converge at the parser boundary, while preserving the distinction between `PRE_HARDWARE_SIMULATED` and real hardware-captured packets.
<!-- MICROBOT_DASHBOARD_V03_MOCK_OUTPUT_INTEGRATION_END -->

<!-- MICROBOT_DASHBOARD_V03_UI_UPGRADE_START -->
## v0.3 upgraded dashboard behavior

The dashboard has been upgraded for v0.3.

It now supports:

- offline mock mode;
- NODE_00 fixture loading from `web/dashboard/test_fixtures/pre_hardware_node00_master_sample.jsonl`;
- NODE_01 LED state demo;
- combined NODE_00 + NODE_01 demo;
- evidence badges;
- current-truth panel;
- direct links to project evidence documents;
- packet inspector;
- node inspector;
- exportable terminal log;
- future Web Serial path.

Run from repository root:

`python3 -m http.server 8000`

Open:

`http://localhost:8000/web/dashboard/index.html`

The dashboard remains pre-hardware unless connected to real ESP32 hardware through Web Serial and reviewed with real evidence.
<!-- MICROBOT_DASHBOARD_V03_UI_UPGRADE_END -->

<!-- MICROBOT_DASHBOARD_V03_SIX_NODE_VISUAL_UPGRADE_START -->
## v0.3 six-node dashboard visual upgrade

The dashboard now supports all six planned nodes in pre-hardware simulation mode:

- `NODE_01_LED_STATE`
- `NODE_02_PROXIMITY_SAFETY`
- `NODE_03_MAGNETIC_DOCKING`
- `NODE_04_MOTION_ACTUATOR`
- `NODE_05_TELEMETRY_SENSOR`
- `NODE_06_VISION_CAMERA`

New interaction features:

- per-node command matrix;
- selected-node action controls;
- global commands;
- role-specific actions;
- stylized MicroBot swarm visualizer;
- clickable MicroBots and node cards;
- richer packet and node inspectors.

Run from repository root:

`python3 -m http.server 8000`

Open:

`http://localhost:8000/web/dashboard/index.html`

The dashboard remains pre-hardware unless connected to real ESP32 hardware through Web Serial and reviewed with real evidence.
<!-- MICROBOT_DASHBOARD_V03_SIX_NODE_VISUAL_UPGRADE_END -->

<!-- MICROBOT_DASHBOARD_V03_DATA_TELEMETRY_UPGRADE_START -->
## v0.3 data telemetry dashboard upgrade

The dashboard now includes a telemetry/data-management section.

New telemetry metrics:

- signal strength;
- estimated response time;
- packet loss;
- throughput;
- jitter;
- packets per minute;
- battery estimate;
- temperature estimate;
- transport mode;
- link quality score;
- per-node telemetry health table.

The visual style is now more monochrome: black, white and gray.

This is a pre-hardware telemetry model, not real ESP32 telemetry validation.
<!-- MICROBOT_DASHBOARD_V03_DATA_TELEMETRY_UPGRADE_END -->

<!-- MICROBOT_DASHBOARD_V03_GESTURE_CONTROL_START -->
## v0.3 browser hand gesture control

The dashboard now includes a browser-side hand gesture section.

Gestures include:

- Open Palm: scan nodes.
- Closed Fist: stop / safe mode.
- Index Point: activate selected node.
- Pinch: selected node role action.
- Peace / V: swarm sweep.
- Three Fingers: mission demo.
- Thumbs Up: all active.
- Thumbs Down: all idle.
- Swipe Right: select next node.
- Swipe Left: select previous node.
- Palm Up: selected node warning.
- Palm Down: selected node idle.
- Two Hands Open: reset.
- Two Fists: emergency stop.

Gesture control is pre-hardware browser input unless explicitly connected to reviewed real hardware later.
<!-- MICROBOT_DASHBOARD_V03_GESTURE_CONTROL_END -->

<!-- MICROBOT_DASHBOARD_V03_WEB_APP_SHELL_START -->
## v0.3 web app shell / sidebar upgrade

The dashboard now behaves more like a web application.

Sections:

- Overview
- Nodes
- Visual Swarm
- Gesture Lab
- Telemetry
- Data Center
- Inspectors
- Terminal
- Evidence

The Data Center supports event filtering and local JSON snapshot export.

This remains a pre-hardware dashboard until real ESP32 evidence is captured and reviewed.
<!-- MICROBOT_DASHBOARD_V03_WEB_APP_SHELL_END -->

<!-- MICROBOT_DASHBOARD_V03_DOCUMENTATION_VIEWER_START -->
## v0.3 documentation viewer / reference library

The dashboard now includes a Documentation Viewer.

It organizes:

- local repo docs;
- evidence and onboarding;
- dashboard, telemetry and gesture docs;
- hardware validation plans;
- BOM and purchase references;
- MicroBot operational document series 01-12;
- mother documentation;
- MicroBot OS;
- Dimension Engine;
- drone/3D assets;
- cybersecurity and portfolio references.

Private/source documents are cataloged as references and are not automatically published.
<!-- MICROBOT_DASHBOARD_V03_DOCUMENTATION_VIEWER_END -->

<!-- MICROBOT_DASHBOARD_V03_OS_CONSOLE_START -->
## v0.3 MicroBot OS Console

The dashboard now includes a browser-side MicroBot OS Console.

Commands:

- `help`
- `boot`
- `status`
- `kernel`
- `drivers`
- `modules`
- `nodes`
- `telemetry`
- `gesture`
- `docs`
- `evidence`
- `safety`
- `demo`
- `clear`
- `reset`

This is a simulated OS interface, not real embedded OS validation.
<!-- MICROBOT_DASHBOARD_V03_OS_CONSOLE_END -->

<!-- MICROBOT_DASHBOARD_V03_DRONE_PERIMETER_START -->
## v0.3 Drone Perimeter Preview

The dashboard now includes a simulated Drone Perimeter Preview.

It contains:

- 2D room map;
- stylized drone;
- perimeter path;
- scan points;
- obstacles;
- MicroBot markers;
- mission controls;
- event log;
- JSON export.

This is a pre-hardware simulation, not real drone validation.
<!-- MICROBOT_DASHBOARD_V03_DRONE_PERIMETER_END -->

<!-- MICROBOT_DASHBOARD_V03_INTEGRATION_AUDIT_START -->
## v0.3 dashboard integration audit

The dashboard now has a formal integration audit.

See:

- `../docs/audits/dashboard_integration_audit_v0_3.md`
- `../docs/release_notes/v0_3_dashboard_baseline_closure.md`
- `../docs/roadmap/v0_4_real_esp32_validation_readiness.md`

The audit explains the dashboard sections, evidence artifacts, validation boundary and next real hardware milestone.
<!-- MICROBOT_DASHBOARD_V03_INTEGRATION_AUDIT_END -->

<!-- MICROBOT_DASHBOARD_V04_REAL_ESP32_SCAFFOLD_START -->
## v0.4 real ESP32 validation scaffold

The dashboard remains pre-hardware until real ESP32 serial logs are captured.

The v0.4 hardware validation scaffold lives in:

- `../../tools/serial/capture_real_esp32_node00_master_v0_4.py`
- `../../tools/serial/validate_real_esp32_node00_master_v0_4.py`
- `../docs/hardware/v0_4_real_esp32_node00_master_validation.md`
- `../../demos/demo_v0_4/real_esp32_node00_master/`

Once real hardware evidence exists, the dashboard evidence state can be updated carefully.
<!-- MICROBOT_DASHBOARD_V04_REAL_ESP32_SCAFFOLD_END -->

<!-- MICROBOT_DASHBOARD_V04_MINIMUM_BOM_START -->
## v0.4 definitive minimum purchase BOM

The dashboard remains pre-hardware until real logs are captured.

The v0.4 purchase BOM is documented in:

- `../docs/purchase/v0_4_minimum_bom_definitive.md`
- `../docs/purchase/v0_4_purchase_checklist_definitive.md`
- `../docs/purchase/v0_4_minimum_bom_definitive.json`
- `../docs/hardware/v0_4_hardware_purchase_and_setup_notes.md`

This prepares the project for real ESP32 validation but does not validate hardware by itself.
<!-- MICROBOT_DASHBOARD_V04_MINIMUM_BOM_END -->

<!-- MICROBOT_DASHBOARD_V04_BADGE_UPDATE_START -->
## v0.4 README badge/status update

The main README badges now reflect the current project state:

- v0.3 closed pre-hardware baseline;
- v0.4 hardware-ready scaffold;
- offline evidence PASS;
- real hardware pending;
- next milestone: real ESP32 serial validation.

The dashboard remains pre-hardware until real ESP32 logs are captured.
<!-- MICROBOT_DASHBOARD_V04_BADGE_UPDATE_END -->

<!-- MICROBOT_DASHBOARD_V04_VISUAL_ASSETS_START -->
## v0.4 visual documentation assets

The public visual items are now documented:

- architecture diagram;
- prototype block diagram;
- dashboard mockup.

These files explain the dashboard and v0.4 hardware-validation path but do not validate hardware.
<!-- MICROBOT_DASHBOARD_V04_VISUAL_ASSETS_END -->

<!-- MICROBOT_DASHBOARD_V04_BUSINESS_ANALYSIS_START -->
## v0.4 business analysis package

The repository now includes business analysis and Business Model Canvas documentation.

See:

- `../docs/business/README.md`
- `../docs/business/company_analysis_v0_4.md`
- `../docs/business/canvas/business_model_canvas_v0_4.md`
- `../../assets/business/business_model_canvas_v0_4.svg`

This business package interprets MicroBot Labs as an early-stage robotics education/prototyping ecosystem, not as a hardware-validated company.
<!-- MICROBOT_DASHBOARD_V04_BUSINESS_ANALYSIS_END -->

<!-- MICROBOT_DASHBOARD_V04_WOKWI_NODE00_START -->
## v0.4 Wokwi ESP32 NODE_00_MASTER simulation

The repository now includes a Wokwi ESP32 simulation path for `NODE_00_MASTER`.

See:

- `../../demos/demo_v0_4/wokwi_esp32_node00_master/`

This is useful for checking serial packet shape before real hardware validation.

The dashboard remains pre-hardware until real ESP32 logs are captured.
<!-- MICROBOT_DASHBOARD_V04_WOKWI_NODE00_END -->
