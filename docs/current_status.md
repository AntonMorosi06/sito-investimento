# MicroBot Labs — Current Status

MicroBot Labs is currently in the public foundation phase.

The project has a first public repository structure, a main README, an initial project overview, an architecture overview, a roadmap, a prototype v0.1 description, a one-page pitch, a short pitch, a changelog, a license, and basic folders for demos, references, images, diagrams, and screenshots.

At this stage, MicroBot Labs should not yet be considered a finished company or a finished robotics product. It is a structured experimental technology project in pre-startup phase.

The current priority is clarity.

Before adding more complexity, the project must become understandable to an external reader. A professor, collaborator, maker, student, or international contact should be able to open the repository and understand what MicroBot Labs is, what it is trying to build, what the first prototype will demonstrate, and what the next milestones are.

The current public foundation includes:

- Main repository structure.
- README.md.
- Project overview.
- Architecture overview.
- Roadmap.
- Prototype v0.1 description.
- Business and education direction.
- Glossary.
- One-page pitch.
- Short pitch.
- Demos folder.
- References folder.
- Assets folders.
- MIT License.
- Changelog.
- Git ignore rules.

The next missing elements are:

- Architecture diagram.
- Prototype block diagram.
- Dashboard screenshot or mockup.
- First visual render or MicroBot concept image.
- Hardware bill of materials. Created as docs/hardware_bill_of_materials_v0_1.md.
- Firmware repository or firmware folder.
- Dashboard repository or dashboard folder.
- First demo script.
- First short demo video.
- Public GitHub repository creation.
- GitHub profile optimization.
- Portfolio connection.
- LinkedIn announcement draft.

The immediate technical objective is to prepare MicroBot v0.1 as a clear demonstrator.

The first demonstrator should validate the following chain:

Computer -> Master ESP32 -> Nodes -> Telemetry -> Dashboard -> Simulation

The project should not move too quickly into advanced claims before this chain is demonstrated clearly.

Current phase: v0.1 public foundation  
Main objective: make the project understandable, presentable, and ready for public GitHub publication  
Next phase: create visual diagrams, improve README, and prepare prototype repository

- Public dashboard and PC Controller specification for MicroBot v0.1.
- Public testing and validation checklist for MicroBot v0.1.
- Public simulation and dimensional engine context for MicroBot v0.1.
- Public risk and safety summary for MicroBot v0.1.
- Public demo runbook for MicroBot v0.1.
- Public GitHub publication readiness checklist for MicroBot v0.1.

- Release notes v0.1.0 created for the public documentation baseline.
- Broader ecosystem context added: MicroBot, micro-drone, GLB/Blender, dimension engine, telemetry, safety, MicroBot OS, study materials and portfolio direction.

- Offline Protocol Lab screenshot added as first visual demo evidence: demos/demo_v0_1/screenshots/offline_protocol_lab_v0_2.png

- PC Controller Dashboard screenshot added as visual demo evidence: demos/demo_v0_1/screenshots/pc_controller_dashboard_v0_2.png

- PC Controller Dashboard evidence updated after mode clarification: OFFLINE MOCK is now visually distinguished from Web Serial hardware mode.

- Dashboard test checklist v0.2 added for OFFLINE MOCK mode, command flow, safety state and screenshot evidence.

- Dashboard mock structured test log v0.2 added: demos/demo_v0_1/logs/dashboard_mock_test_log_v0_2.jsonl

- Hardware serial test checklist v0.2 added for future ESP32 NODE_00_MASTER validation.

- NODE_01_LED_STATE hardware test checklist v0.2 added for future ESP32 LED node validation.

- v0.2 completion summary added: docs/v0_2_completion_summary.md

- v0.3 planning added: docs/v0_3_planning.md

- GitHub Issues plan for v0.3 added: docs/github_issues_v0_3_plan.md

- GitHub milestone status v0.3 added: docs/github_milestone_status_v0_3.md

<!-- MICROBOT_CURRENT_STATUS_V03_CANONICAL_AUDIT_START -->
## v0.3 canonical audit and repository map

Updated: 2026-05-16

The repository ecosystem has now been audited and mapped. `microbot-labs` is confirmed as the central curated MicroBot repository, while the other repositories under `AntonMorosi06` are treated as satellite repositories, source archives, asset repositories, portfolio repositories, simulation branches, or rebuild workspaces.

New canonical documents:

- `docs/external_repository_map_v0_3.md`
- `docs/repository_audit_and_canonical_status_v0_3.md`

Current truth-state:

| Area | Canonical status |
|---|---|
| `microbot-labs` | central curated MicroBot baseline |
| v0.1 | documentation/public foundation baseline |
| v0.2 | offline/mock validation baseline |
| v0.3 | hardware-integration preparation |
| dashboard | offline/mock validated, Web Serial prepared |
| firmware | NODE_00_MASTER and NODE_01_LED_STATE skeletons prepared |
| hardware | not yet hardware-validated |
| satellite repositories | mapped, not blindly merged |
| large legacy workspace | `finefine`, private/source archive, requires review |
| asset repositories | `drone` and `glb_totali_micro_drone`, separate from core |
| portfolio/certificates | `certificate`, requires privacy review |

The next narrow engineering milestone is to validate a real PC-to-ESP32 chain with NODE_00_MASTER: upload firmware, send PING/STATUS, capture logs, document results, and only then mark that specific behavior as hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_CANONICAL_AUDIT_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_NODE00_SERIAL_VALIDATION_START -->
## v0.3 NODE_00_MASTER serial validation pack

Updated: 2026-05-16

A dedicated v0.3 validation pack has been added for the first real ESP32 Master test.

The target validation chain is:

`PC -> USB Serial -> ESP32 NODE_00_MASTER -> structured response -> log -> report`

New files:

- `docs/node_00_master_real_serial_validation_v0_3.md`
- `tools/serial/capture_node00_master_validation.py`
- `demos/demo_v0_3/node_00_master_serial/README.md`
- `demos/demo_v0_3/node_00_master_serial/logs/README.md`
- `demos/demo_v0_3/node_00_master_serial/reports/README.md`

Current status: hardware-ready, not yet hardware-validated.

The next step is to upload `firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino` to a real ESP32 board, run the capture script, review the generated report, and then commit the resulting evidence only if the test was actually performed.
<!-- MICROBOT_CURRENT_STATUS_V03_NODE00_SERIAL_VALIDATION_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_PRE_HARDWARE_PREP_START -->
## v0.3 pre-hardware preparation pack

Updated: 2026-05-16

A pre-hardware preparation pack has been added.

Current status: hardware-purchase-ready preparation, not hardware-validated.

The pack includes Arduino IDE setup guidance, serial port selection guidance, ESP32 troubleshooting, a purchase-readiness checklist, a minimum BOM and Amazon search list, and a GitHub issue body for hardware purchase readiness.

The next practical step is to review the BOM, buy the minimum kit, then run the NODE_00_MASTER real serial validation workflow once the ESP32 is available.
<!-- MICROBOT_CURRENT_STATUS_V03_PRE_HARDWARE_PREP_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_PRE_HARDWARE_MOCK_RESPONDER_START -->
## v0.3 pre-hardware mock responder

Updated: 2026-05-16

A pre-hardware mock responder has been added for NODE_00_MASTER.

This lets the project continue while no physical ESP32 board is available yet. The responder simulates the expected NODE_00_MASTER command/response behavior and generates simulated logs, JSONL logs, reports and expected-output examples.

Current status: pre-hardware simulated, not hardware-validated.

New files:

- `docs/pre_hardware_simulation_bridge_v0_3.md`
- `docs/node_00_master_expected_output_spec_v0_3.md`
- `tools/offline/mock_node00_master_responder.py`
- `demos/demo_v0_3/pre_hardware_mock_node00_master/`

The next hardware step remains unchanged: upload `NODE_00_MASTER.ino` to a real ESP32 and run the real serial capture script when hardware is available.
<!-- MICROBOT_CURRENT_STATUS_V03_PRE_HARDWARE_MOCK_RESPONDER_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_CURRENT_EVIDENCE_START -->
## v0.3 current evidence page

Updated: 2026-05-16

A canonical Current Evidence page has been added.

New file:

- `docs/current_evidence_v0_3.md`

The page summarizes what exists now, what is simulated, what is hardware-ready, what still requires physical ESP32 testing, and which claims are allowed or not allowed.

Current hardware status remains unchanged: not yet hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_CURRENT_EVIDENCE_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_DASHBOARD_MOCK_OUTPUT_INTEGRATION_START -->
## v0.3 dashboard/mock-output integration

Updated: 2026-05-16

Dashboard/mock-output integration notes have been added.

Current status: dashboard parser and mock-output integration are documented; real Web Serial hardware validation is still pending.

New files:

- `docs/dashboard_mock_output_integration_notes_v0_3.md`
- `docs/dashboard_mock_output_test_plan_v0_3.md`

The documented path is:

`mock_node00_master_responder.py -> simulated JSONL/raw log -> protocol parser -> dashboard state mapping`

The future hardware path remains:

`ESP32 NODE_00_MASTER -> Web Serial -> serial_adapter.js -> protocol_parser.js -> dashboard state mapping`.
<!-- MICROBOT_CURRENT_STATUS_V03_DASHBOARD_MOCK_OUTPUT_INTEGRATION_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_OFFLINE_DASHBOARD_PARSER_VALIDATION_START -->
## v0.3 offline dashboard parser validation

Updated: 2026-05-16

An offline dashboard parser validation step has been added.

Current status: simulated NODE_00_MASTER JSONL can be validated against the dashboard-facing parser model offline.

New files:

- `tools/offline/validate_dashboard_mock_output.py`
- `docs/dashboard_parser_validation_notes_v0_3.md`
- `demos/demo_v0_3/dashboard_mock_output_validation/`
- `web/dashboard/test_fixtures/pre_hardware_node00_master_sample.jsonl`

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_OFFLINE_DASHBOARD_PARSER_VALIDATION_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_NODE01_PRE_HARDWARE_SIM_START -->
## v0.3 NODE_01_LED_STATE pre-hardware simulation

Updated: 2026-05-16

A pre-hardware simulation workflow has been added for NODE_01_LED_STATE.

Current status: NODE_01 command/state behavior is simulated pre-hardware; real LED hardware validation is still pending.

New files:

- `docs/node_01_led_state_pre_hardware_simulation_v0_3.md`
- `docs/node_01_led_state_expected_output_spec_v0_3.md`
- `tools/offline/mock_node01_led_state_responder.py`
- `demos/demo_v0_3/pre_hardware_mock_node01_led_state/`

The next hardware step remains: upload NODE_01_LED_STATE firmware to a real ESP32 and capture serial + visible LED evidence.
<!-- MICROBOT_CURRENT_STATUS_V03_NODE01_PRE_HARDWARE_SIM_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_COMBINED_PRE_HW_DEMO_START -->
## v0.3 combined pre-hardware demo report

Updated: 2026-05-16

A combined NODE_00 + NODE_01 pre-hardware demo report has been added. Hardware status remains not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_COMBINED_PRE_HW_DEMO_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_README_TOP_REFINEMENT_START -->
## v0.3 README top refinement

Updated: 2026-05-16

The README top section has been refined to point readers immediately to Current Evidence, the combined pre-hardware demo report, parser validation and hardware readiness.

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_README_TOP_REFINEMENT_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_OUTREACH_MESSAGE_START -->
## v0.3 professor/collaborator message

Updated: 2026-05-16

Outreach drafts have been added for professor or collaborator review.

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_OUTREACH_MESSAGE_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_ANDREA_ONBOARDING_START -->
## v0.3 Andrea onboarding map

Updated: 2026-05-16

A dedicated Andrea onboarding folder has been added.

New folder:

- `docs/andrea_onboarding/`

The folder explains the repository map, document index, no-hardware run workflow, evidence status, hardware path and review checklist.

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_ANDREA_ONBOARDING_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_WEB_DASHBOARD_UPGRADE_START -->
## v0.3 web dashboard upgrade

Updated: 2026-05-16

The web dashboard has been upgraded.

Updated files:

- `web/dashboard/index.html`
- `web/dashboard/style.css`
- `web/dashboard/app.js`

New file:

- `docs/web_dashboard_upgrade_v0_3.md`

The dashboard is now more useful for pre-hardware presentation and review. Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_WEB_DASHBOARD_UPGRADE_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_SIX_NODE_DASHBOARD_VISUAL_UPGRADE_START -->
## v0.3 six-node dashboard visual upgrade

Updated: 2026-05-16

The dashboard has been upgraded so all six planned nodes can be controlled in pre-hardware simulation mode.

Updated files:

- `web/dashboard/index.html`
- `web/dashboard/style.css`
- `web/dashboard/app.js`

New file:

- `docs/web_dashboard_six_node_visual_upgrade_v0_3.md`

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_SIX_NODE_DASHBOARD_VISUAL_UPGRADE_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_DASHBOARD_DATA_TELEMETRY_UPGRADE_START -->
## v0.3 dashboard data telemetry upgrade

Updated: 2026-05-17

A telemetry/data-management section has been added to the dashboard.

Updated files:

- `web/dashboard/index.html`
- `web/dashboard/style.css`
- `web/dashboard/app.js`

New file:

- `docs/web_dashboard_data_telemetry_upgrade_v0_3.md`

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_DASHBOARD_DATA_TELEMETRY_UPGRADE_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_DASHBOARD_GESTURE_CONTROL_START -->
## v0.3 browser hand gesture control

Updated: 2026-05-17

A browser-side hand gesture control section has been added to the dashboard.

Updated files:

- `web/dashboard/index.html`
- `web/dashboard/style.css`
- `web/dashboard/gesture_control.js`

New file:

- `docs/web_dashboard_gesture_control_upgrade_v0_3.md`

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_DASHBOARD_GESTURE_CONTROL_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_WEB_APP_SHELL_START -->
## v0.3 web app shell / sidebar upgrade

Updated: 2026-05-17

The dashboard has been upgraded into a section-based web app shell.

Updated files:

- `web/dashboard/index.html`
- `web/dashboard/style.css`

New files:

- `web/dashboard/dashboard_shell.js`
- `docs/web_dashboard_app_shell_upgrade_v0_3.md`

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_WEB_APP_SHELL_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_DOCUMENTATION_VIEWER_START -->
## v0.3 documentation viewer / reference library

Updated: 2026-05-17

A Documentation Viewer has been added to the dashboard.

Updated files:

- `web/dashboard/index.html`
- `web/dashboard/style.css`
- `web/dashboard/dashboard_shell.js`

New files:

- `web/dashboard/documentation_viewer.js`
- `docs/web_dashboard_documentation_viewer_upgrade_v0_3.md`

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_DOCUMENTATION_VIEWER_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_OS_CONSOLE_START -->
## v0.3 MicroBot OS Console

Updated: 2026-05-17

A browser-side MicroBot OS Console has been added to the dashboard.

Updated files:

- `web/dashboard/index.html`
- `web/dashboard/style.css`
- `web/dashboard/dashboard_shell.js`

New files:

- `web/dashboard/microbot_os_console.js`
- `docs/web_dashboard_microbot_os_console_upgrade_v0_3.md`

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_OS_CONSOLE_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_DRONE_PERIMETER_START -->
## v0.3 Drone Perimeter Preview

Updated: 2026-05-17

A simulated Drone Perimeter Preview section has been added to the dashboard.

Updated files:

- `web/dashboard/index.html`
- `web/dashboard/style.css`
- `web/dashboard/dashboard_shell.js`

New files:

- `web/dashboard/drone_perimeter_preview.js`
- `docs/web_dashboard_drone_perimeter_preview_upgrade_v0_3.md`

Hardware status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V03_DRONE_PERIMETER_END -->

<!-- MICROBOT_CURRENT_STATUS_V03_INTEGRATION_AUDIT_START -->
## v0.3 dashboard integration audit

Updated: 2026-05-18

The v0.3 dashboard and offline evidence phase has been documented through a formal integration audit.

New documents:

- `docs/audits/dashboard_integration_audit_v0_3.md`
- `docs/release_notes/v0_3_dashboard_baseline_closure.md`
- `docs/roadmap/v0_4_real_esp32_validation_readiness.md`

Current status: v0.3 is a strong pre-hardware baseline.

Next recommended milestone: v0.4 real ESP32 NODE_00_MASTER serial validation.
<!-- MICROBOT_CURRENT_STATUS_V03_INTEGRATION_AUDIT_END -->

<!-- MICROBOT_CURRENT_STATUS_V04_REAL_ESP32_SCAFFOLD_START -->
## v0.4 real ESP32 validation scaffold

Updated: 2026-05-18

The repository now contains the tools and folder structure needed for the first real ESP32 NODE_00_MASTER serial validation.

Current status:

- v0.3 remains a closed pre-hardware baseline.
- v0.4 is prepared but not hardware-validated.
- Real logs are still required before any hardware-validation claim can be made.
<!-- MICROBOT_CURRENT_STATUS_V04_REAL_ESP32_SCAFFOLD_END -->

<!-- MICROBOT_CURRENT_STATUS_V04_MINIMUM_BOM_START -->
## v0.4 definitive minimum purchase BOM

Updated: 2026-05-18

The v0.4 minimum hardware purchase plan is now documented.

Current state:

- v0.3 is closed as a pre-hardware baseline.
- v0.4 validation scaffold exists.
- v0.4 minimum purchase BOM exists.
- Hardware has not yet been validated.

Next physical action: purchase the minimum kit and run real ESP32 NODE_00_MASTER serial validation.
<!-- MICROBOT_CURRENT_STATUS_V04_MINIMUM_BOM_END -->

<!-- MICROBOT_CURRENT_STATUS_V04_BADGE_UPDATE_START -->
## v0.4 README badge/status update

Updated: 2026-05-18

The README badge block has been updated to match the current repository truth state.

Current badge truth:

- v0.3 is closed as a pre-hardware baseline.
- v0.4 is hardware-ready as a scaffold.
- v0.4 has a minimum purchase BOM.
- v0.3 offline evidence passed.
- real hardware validation is still pending.

The repository remains not hardware-validated until real ESP32 serial logs are captured and committed.
<!-- MICROBOT_CURRENT_STATUS_V04_BADGE_UPDATE_END -->

<!-- MICROBOT_CURRENT_STATUS_V04_VISUAL_ASSETS_START -->
## v0.4 visual documentation assets

Updated: 2026-05-18

The README items previously marked as incomplete have been completed:

- Architecture diagram;
- Prototype block diagram;
- Dashboard mockup.

New files:

- `docs/diagrams/microbot_v0_4_architecture_diagram.md`
- `docs/diagrams/microbot_v0_4_architecture_diagram.mmd`
- `assets/diagrams/microbot_v0_4_architecture_diagram.svg`
- `docs/diagrams/microbot_v0_4_prototype_block_diagram.md`
- `docs/diagrams/microbot_v0_4_prototype_block_diagram.mmd`
- `assets/diagrams/microbot_v0_4_prototype_block_diagram.svg`
- `docs/mockups/dashboard_mockup_v0_4.md`
- `assets/mockups/dashboard_mockup_v0_4.svg`
- `docs/status/v0_4_visual_assets_completion_status.md`

Hardware validation status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V04_VISUAL_ASSETS_END -->

<!-- MICROBOT_CURRENT_STATUS_V04_BUSINESS_ANALYSIS_START -->
## v0.4 business analysis package

Updated: 2026-05-18

A new business analysis package has been added under `docs/business/`.

It includes:

- company/project analysis;
- Business Model Canvas;
- Lean Canvas;
- customer segments and value proposition;
- go-to-market strategy;
- revenue and cost model;
- business risk and validation plan;
- business diagrams and visual assets.

Business status remains: pre-company / pre-revenue / not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V04_BUSINESS_ANALYSIS_END -->

<!-- MICROBOT_CURRENT_STATUS_V04_BLENDER_ASSET_START -->
## v0.4 Blender MicroBot asset

Updated: 2026-05-18

A first Blender/GLB MicroBot visual asset has been added under `blender/`.

Current interpretation:

- visual concept asset;
- useful for portfolio, documentation and future web/3D integration;
- not a validated CAD design;
- not hardware-validated.

The hardware validation status remains unchanged: real ESP32 validation is still pending.
<!-- MICROBOT_CURRENT_STATUS_V04_BLENDER_ASSET_END -->

<!-- MICROBOT_CURRENT_STATUS_V04_BLENDER_V02_SKELETON_START -->
## v0.4 Blender MicroBot v0.2 skeleton reference

Updated: 2026-05-18

A second Blender/GLB MicroBot asset has been added under `blender/v0_2_skeleton_reference/`.

Current interpretation:

- reference-image-inspired visual model;
- central spherical core;
- side collar joints;
- long tapered pod geometry;
- internal skeleton and ribs;
- AutoCAD-style labels and dimensions;
- not validated CAD;
- not hardware-validated.

The hardware validation status remains unchanged: real ESP32 validation is still pending.
<!-- MICROBOT_CURRENT_STATUS_V04_BLENDER_V02_SKELETON_END -->

<!-- MICROBOT_CURRENT_STATUS_V04_BLENDER_V03_MULTI_CAD_START -->
## v0.4 Blender MicroBot v0.3 multi-microbot CAD

Updated: 2026-05-18

A new Blender package has been added under `blender/v0_3_multi_microbot_cad/`.

Current interpretation:

- multi-variant technical scene;
- assembled MicroBot;
- cutaway / skeleton MicroBot;
- exploded MicroBot;
- blueprint / AutoCAD style;
- richer explanatory GLB export;
- not validated CAD;
- not hardware-validated.

The hardware validation status remains unchanged: real ESP32 validation is still pending.
<!-- MICROBOT_CURRENT_STATUS_V04_BLENDER_V03_MULTI_CAD_END -->

<!-- MICROBOT_CURRENT_STATUS_V04_WOKWI_NODE00_START -->
## v0.4 Wokwi ESP32 NODE_00_MASTER simulation

Updated: 2026-05-19

A Wokwi ESP32 simulation bridge has been added under:

`demos/demo_v0_4/wokwi_esp32_node00_master/`

Current interpretation:

- ESP32 simulation path exists;
- `NODE_00_MASTER` protocol behavior can be tested in Wokwi;
- serial packets include boot, heartbeat, status, scan nodes, ping/pong, LED state, safe stop and reset ready;
- real ESP32 hardware validation is still pending.

Hardware validation status remains unchanged: not hardware-validated.
<!-- MICROBOT_CURRENT_STATUS_V04_WOKWI_NODE00_END -->
