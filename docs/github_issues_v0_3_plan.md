# MicroBot Labs — GitHub Issues Plan v0.3

## 1. Purpose

This document defines the GitHub Issues plan for MicroBot Labs v0.3.

The goal is to turn the v0.3 planning phase into a practical, trackable roadmap inside GitHub.

The repository already contains a strong v0.1 and v0.2 foundation: documentation baseline, release v0.1.0, offline protocol lab, PC Controller Dashboard, firmware skeletons, Web Serial preparation, dashboard screenshots, structured mock logs, hardware checklists and v0.3 planning.

The next step is to organize the real implementation work into issues that can be opened, assigned, closed and referenced later.

This file does not create the issues automatically. It defines them cleanly first, so the GitHub tracker does not become chaotic.

## 2. Planning Metadata

| Field | Value |
|---|---|
| Project | MicroBot Labs |
| Repository | microbot-labs |
| Document | GitHub Issues Plan v0.3 |
| Created | 2026-05-15 08:48 |
| Previous phase | v0.2 offline/mock baseline |
| Current target | v0.3 dashboard-to-hardware integration |
| Main milestone | v0.3 — Dashboard-to-Hardware Integration |
| Hardware required for full completion | yes |
| ESP32 required for full completion | yes |

## 3. Source Alignment

This issue plan is aligned with the current MicroBot Labs repository and the broader MicroBot documentation base.

| Source | Role |
|---|---|
| docs/v0_2_completion_summary.md | Defines what is complete in v0.2 and what remains |
| docs/v0_3_planning.md | Defines the target direction for v0.3 |
| docs/hardware_serial_test_checklist_v0_2.md | Defines Master ESP32 hardware serial validation |
| docs/node_01_led_state_hardware_test_checklist_v0_2.md | Defines NODE_01 LED hardware validation |
| docs/dashboard_test_checklist_v0_2.md | Defines dashboard mock validation |
| docs/dashboard_state_modes_v0_2.md | Defines OFFLINE MOCK, WEB SERIAL READY and WEB SERIAL CONNECTED modes |
| docs/web_serial_integration_notes_v0_2.md | Defines Web Serial preparation |
| docs/risk_safety_summary_v0_1.md | Safety and risk reference |
| docs/demo_runbook_v0_1.md | Demo and evidence reference |
| firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino | Master firmware skeleton |
| firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino | LED node firmware skeleton |
| web/dashboard/ | PC Controller Dashboard implementation |
| demos/demo_v0_1/ | Evidence, screenshots, logs, notes and reports |

The broader MicroBot ecosystem is also considered: MicroBot OS, firmware, telemetry, simulation, 3D/GLB, micro-drone, cybersecurity/safety, physics and portfolio. However, v0.3 must stay focused. It should not attempt to pull every branch of the ecosystem into one milestone.

## 4. v0.3 Issue Strategy

The v0.3 GitHub issue strategy is simple:

1. Keep the milestone small enough to finish.
2. Separate hardware validation from dashboard validation.
3. Separate mock evidence from hardware evidence.
4. Keep safety visible.
5. Avoid opening issues for speculative future features too early.
6. Use issues to produce evidence, not just code.
7. Close an issue only when there is a file, screenshot, log, report or committed implementation proving completion.

The main v0.3 target is:

PC Controller Dashboard -> Web Serial -> NODE_00_MASTER ESP32 -> real response -> dashboard terminal -> evidence

The secondary v0.3 target is:

NODE_01_LED_STATE -> visible LED state -> photo/log/report evidence

## 5. Suggested Milestone

Milestone title:

v0.3 — Dashboard-to-Hardware Integration

Milestone description:

Validate the first real hardware-connected MicroBot Labs chain. The milestone focuses on NODE_00_MASTER ESP32 serial validation, PC Controller Dashboard Web Serial connection, NODE_01_LED_STATE visible output validation, evidence capture and v0.3 completion documentation.

Milestone completion condition:

v0.3 is complete when NODE_00_MASTER has been uploaded to ESP32, PING/STATUS/STOP/RESET have been validated through USB Serial, evidence has been committed, and the repository clearly distinguishes hardware evidence from mock evidence.

Strong completion condition:

Dashboard Web Serial receives real ESP32 packets and NODE_01_LED_STATE also produces visible LED output evidence.

## 6. Labels To Use

Recommended labels:

| Label | Meaning |
|---|---|
| v0.3 | Belongs to the v0.3 milestone |
| firmware | ESP32 firmware or embedded code |
| hardware | Physical board, LED, wiring, upload or serial test |
| dashboard | PC Controller Dashboard |
| web-serial | Browser serial connection |
| protocol | Packet format, parser and command/response handling |
| safety | STOP, SAFE_MODE, EMERGENCY_STOP, electrical caution |
| demo | Screenshots, photos, logs and public evidence |
| documentation | Markdown docs, reports and checklists |
| priority-high | Required for v0.3 completion |
| good-first-task | Small contained task |
| blocked-hardware | Requires ESP32 or physical setup |
| mock-vs-hardware | Requires explicit distinction between simulated and physical validation |

If the label set becomes too large, keep only:

v0.3, firmware, hardware, dashboard, web-serial, safety, demo, documentation, priority-high.

## 7. Issue Dependency Map

The v0.3 issues should be worked in this order:

| Order | Issue | Dependency |
|---:|---|---|
| 1 | Verify dashboard still passes OFFLINE MOCK checklist | none |
| 2 | Upload NODE_00_MASTER firmware to ESP32 | ESP32 available |
| 3 | Capture NODE_00_MASTER Serial Monitor log | issue 2 |
| 4 | Test STOP and RESET on real Master | issue 2 |
| 5 | Test dashboard Web Serial with NODE_00_MASTER | issues 2 and 3 |
| 6 | Capture dashboard Web Serial evidence | issue 5 |
| 7 | Upload NODE_01_LED_STATE firmware | ESP32 available |
| 8 | Validate NODE_01 LED states | issue 7 |
| 9 | Capture NODE_01 photo/log/report | issue 8 |
| 10 | Create v0.3 completion summary | issues 2-9 as available |

If hardware is not available, only issues that do not require ESP32 should be worked.

## 8. Issue 1 — Verify dashboard OFFLINE MOCK baseline before hardware

Title:

Verify dashboard OFFLINE MOCK baseline before hardware testing

Labels:

v0.3, dashboard, safety, demo, priority-high

Purpose:

Before testing real ESP32 hardware, confirm that the existing dashboard mock layer still works. This prevents debugging dashboard bugs and hardware bugs at the same time.

Checklist:

| Step | Expected Result |
|---|---|
| Open web/dashboard/index.html | Dashboard loads |
| Press Start Offline Mock | Mode shows OFFLINE MOCK |
| Press PING | Mock response appears |
| Press STATUS | Status appears |
| Press SET NODE_01 ACTIVE | NODE_01 becomes ACTIVE |
| Press STOP | Safety becomes SAFE_MODE |
| Press RESET | System returns READY/NORMAL |

Acceptance criteria:

| Criterion | Required |
|---|---|
| Dashboard loads | yes |
| Mode is OFFLINE MOCK | yes |
| Raw terminal shows mock packets | yes |
| STOP and RESET work | yes |
| Screenshot not required if already current | no |

Evidence:

Reference existing files:

demos/demo_v0_1/screenshots/pc_controller_dashboard_v0_2.png

demos/demo_v0_1/logs/dashboard_mock_test_log_v0_2.jsonl

## 9. Issue 2 — Upload NODE_00_MASTER firmware to ESP32

Title:

Upload NODE_00_MASTER firmware to ESP32

Labels:

v0.3, firmware, hardware, priority-high, blocked-hardware

Purpose:

Validate that the Master firmware can compile and upload to a real ESP32.

Checklist:

| Step | Expected Result |
|---|---|
| Open firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino | File loads |
| Select ESP32 board | Board selected |
| Select correct serial port | ESP32 port selected |
| Compile firmware | Build succeeds |
| Upload firmware | Upload completes |
| Open Serial Monitor at 115200 | Monitor opens |
| Reset board if needed | Boot message appears |

Acceptance criteria:

| Criterion | Required |
|---|---|
| Firmware compiles | yes |
| Firmware uploads | yes |
| Boot message appears | yes |
| No overheating or unsafe behavior | yes |

Evidence to add:

demos/demo_v0_1/screenshots/node_00_master_serial_monitor_v0_3.png

demos/demo_v0_1/photos/node_00_master_esp32_v0_3.jpg

## 10. Issue 3 — Validate NODE_00_MASTER PING and STATUS through Serial Monitor

Title:

Validate NODE_00_MASTER PING and STATUS through Serial Monitor

Labels:

v0.3, firmware, hardware, protocol, priority-high, blocked-hardware

Purpose:

Confirm the first real hardware command/response loop.

Target chain:

PC Serial Monitor -> ESP32 NODE_00_MASTER -> PING/PONG and STATUS response

Commands:

| Command | Expected |
|---|---|
| PING | response with PONG |
| STATUS | response with role ESP32_MASTER and current state |
| GET_NODE_TABLE | expected node list |
| SCAN_NODES | placeholder scan response |

Acceptance criteria:

| Criterion | Required |
|---|---|
| PING returns PONG | yes |
| STATUS returns structured state | yes |
| GET_NODE_TABLE returns expected nodes | recommended |
| Log is copied into repository | yes |

Evidence to add:

demos/demo_v0_1/logs/node_00_master_hardware_serial_log_v0_3.txt

demos/demo_v0_1/notes/node_00_master_hardware_test_report_v0_3.md

## 11. Issue 4 — Validate STOP and RESET on real NODE_00_MASTER

Title:

Validate STOP and RESET on real NODE_00_MASTER

Labels:

v0.3, firmware, hardware, safety, priority-high, blocked-hardware

Purpose:

Confirm that the real Master firmware can enter and leave safe states.

Commands:

| Command | Expected |
|---|---|
| STOP | Master enters SAFE_MODE |
| STATUS | State remains SAFE_MODE |
| RESET | Master returns READY |
| EMERGENCY_STOP | Master enters EMERGENCY |
| RESET | Master returns READY |

Acceptance criteria:

| Criterion | Required |
|---|---|
| STOP changes state | yes |
| EMERGENCY_STOP changes state | yes |
| RESET restores READY | yes |
| Structured responses appear | yes |
| No unsafe electrical behavior | yes |

Evidence to add:

Append to:

demos/demo_v0_1/logs/node_00_master_hardware_serial_log_v0_3.txt

demos/demo_v0_1/notes/node_00_master_hardware_test_report_v0_3.md

## 12. Issue 5 — Test dashboard Web Serial with ESP32 Master

Title:

Test dashboard Web Serial with ESP32 Master

Labels:

v0.3, dashboard, web-serial, protocol, hardware, priority-high, blocked-hardware

Purpose:

Validate the first dashboard-to-hardware path.

Target chain:

Dashboard -> Web Serial -> NODE_00_MASTER ESP32 -> real response -> dashboard raw terminal

Checklist:

| Step | Expected |
|---|---|
| Open web/dashboard/index.html | Dashboard loads |
| Press Web Serial Hardware Only | Browser requests serial port |
| Select ESP32 port | Port opens |
| Confirm mode | WEB SERIAL CONNECTED |
| Press PING | Real response appears |
| Press STATUS | Real status appears |
| Press STOP | Real safe response appears |
| Press RESET | Real ready response appears |

Acceptance criteria:

| Criterion | Required |
|---|---|
| Browser opens ESP32 port | yes |
| Dashboard shows WEB SERIAL CONNECTED | yes |
| Real PING response appears | yes |
| Real STATUS response appears | yes |
| STOP and RESET responses appear | recommended |
| Screenshot is captured | yes |

Evidence to add:

demos/demo_v0_1/screenshots/dashboard_web_serial_connected_v0_3.png

demos/demo_v0_1/logs/dashboard_web_serial_hardware_log_v0_3.jsonl

demos/demo_v0_1/notes/dashboard_web_serial_hardware_test_report_v0_3.md

## 13. Issue 6 — Improve dashboard parser from first real hardware packets

Title:

Improve dashboard parser from first real hardware packets

Labels:

v0.3, dashboard, protocol, web-serial

Purpose:

After receiving real packets, check whether protocol_parser.js correctly parses them.

This issue should not be done before real packet examples exist.

Checklist:

| Step | Expected |
|---|---|
| Collect raw packets | Hardware log exists |
| Compare packet shape | Fields match parser expectations |
| Test valid packet | Parser accepts |
| Test malformed line | Parser rejects safely |
| Update parser if needed | app remains stable |

Acceptance criteria:

| Criterion | Required |
|---|---|
| Real packet examples reviewed | yes |
| Parser handles real packets | yes |
| Parse errors are logged clearly | yes |
| Dashboard does not crash | yes |

Evidence:

web/dashboard/protocol_parser.js

demos/demo_v0_1/logs/dashboard_web_serial_hardware_log_v0_3.jsonl

## 14. Issue 7 — Upload NODE_01_LED_STATE firmware to ESP32

Title:

Upload NODE_01_LED_STATE firmware to ESP32

Labels:

v0.3, firmware, hardware, good-first-task, blocked-hardware

Purpose:

Validate firmware upload for the first visible physical output node.

Checklist:

| Step | Expected |
|---|---|
| Open firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino | File loads |
| Select ESP32 board | Board selected |
| Select serial port | ESP32 port selected |
| Compile firmware | Build succeeds |
| Upload firmware | Upload completes |
| Open Serial Monitor | Boot message appears |

Acceptance criteria:

| Criterion | Required |
|---|---|
| Firmware compiles | yes |
| Firmware uploads | yes |
| Boot message appears | yes |
| No unsafe behavior | yes |

Evidence to add:

demos/demo_v0_1/screenshots/node_01_led_state_serial_monitor_v0_3.png

demos/demo_v0_1/photos/node_01_led_state_board_v0_3.jpg

## 15. Issue 8 — Validate NODE_01 LED states

Title:

Validate NODE_01 LED states

Labels:

v0.3, firmware, hardware, safety, demo, blocked-hardware

Purpose:

Confirm visible physical LED behavior.

Commands:

| Command | Expected Physical Result |
|---|---|
| PING | PONG response |
| STATUS | state response |
| ACTIVE | LED turns on |
| WARNING | LED blinks slowly |
| ERROR | LED blinks quickly |
| STOP | LED enters SAFE_MODE blink |
| RESET | LED returns idle/off |

Acceptance criteria:

| Criterion | Required |
|---|---|
| ACTIVE visibly changes LED | yes |
| WARNING blink visible | yes |
| ERROR blink visible | yes |
| STOP safe behavior visible | yes |
| RESET restores ready/idle | yes |
| Serial responses appear | yes |

Evidence to add:

demos/demo_v0_1/photos/node_01_led_active_v0_3.jpg

demos/demo_v0_1/photos/node_01_led_warning_v0_3.jpg

demos/demo_v0_1/logs/node_01_led_state_hardware_log_v0_3.txt

demos/demo_v0_1/notes/node_01_led_state_hardware_test_report_v0_3.md

## 16. Issue 9 — Add v0.3 hardware evidence to README

Title:

Add v0.3 hardware evidence to README

Labels:

v0.3, documentation, demo

Purpose:

After hardware evidence exists, link it clearly in README without overstating the result.

Checklist:

| Step | Expected |
|---|---|
| Add Master evidence section | Link logs/screenshots |
| Add dashboard Web Serial evidence if available | Link screenshot/log |
| Add NODE_01 evidence if available | Link LED photo/report |
| Keep mock/hardware distinction | Explicit wording |
| Update current status | Accurate phase status |

Acceptance criteria:

| Criterion | Required |
|---|---|
| README links hardware evidence | yes |
| README does not imply full swarm completion | yes |
| Known limitations remain visible | yes |
| Hardware evidence paths work | yes |

## 17. Issue 10 — Create v0.3 completion summary

Title:

Create v0.3 completion summary

Labels:

v0.3, documentation, demo, priority-high

Purpose:

Close v0.3 with a clear summary of what was validated.

Suggested file:

docs/v0_3_completion_summary.md

Required sections:

| Section | Purpose |
|---|---|
| v0.3 goal | State original target |
| What passed | Real hardware or mock results |
| What failed | Honest engineering record |
| Evidence | Screenshots/logs/photos/reports |
| Safety | STOP/RESET status |
| Dashboard | Web Serial status |
| NODE_01 | LED validation status |
| Next phase | v0.4 direction |

Acceptance criteria:

| Criterion | Required |
|---|---|
| Summary file exists | yes |
| Evidence is linked | yes |
| Hardware status is honest | yes |
| v0.4 direction is proposed | yes |

## 18. Optional Issue — Prepare v0.3 release notes

Title:

Prepare v0.3 release notes

Labels:

v0.3, documentation, release

Purpose:

Only create formal v0.3 release notes after hardware evidence exists.

Suggested file:

docs/release_notes_v0_3_0.md

Do not create v0.3 release too early.

A v0.3 release should happen only when at least NODE_00_MASTER hardware validation has been completed.

## 19. What Not To Open As v0.3 Issues Yet

Avoid these issues for now:

| Issue Idea | Reason |
|---|---|
| Build all six physical nodes | Too large for v0.3 |
| Add wireless swarm | Belongs to later phase |
| Add micro-drone integration | Separate branch |
| Publish GLB asset repository | Separate curated repository |
| Add full MicroBot OS | Separate future repository/module |
| Add camera/biometric system | Requires privacy/security filtering |
| Add full dimension engine | Later simulation phase |
| Add AI/BCI control | Too early for hardware v0.3 |
| Add battery power system | Later after USB safety validation |

This prevents v0.3 from becoming ingestibile.

## 20. Recommended GitHub Issue Creation Order

Create the issues in this order:

| Order | Title |
|---:|---|
| 1 | Verify dashboard OFFLINE MOCK baseline before hardware testing |
| 2 | Upload NODE_00_MASTER firmware to ESP32 |
| 3 | Validate NODE_00_MASTER PING and STATUS through Serial Monitor |
| 4 | Validate STOP and RESET on real NODE_00_MASTER |
| 5 | Test dashboard Web Serial with ESP32 Master |
| 6 | Improve dashboard parser from first real hardware packets |
| 7 | Upload NODE_01_LED_STATE firmware to ESP32 |
| 8 | Validate NODE_01 LED states |
| 9 | Add v0.3 hardware evidence to README |
| 10 | Create v0.3 completion summary |

If hardware is not available, create only issues 1, 9 and 10 as planning placeholders, and keep hardware-dependent issues open with the blocked-hardware label.

## 21. Suggested Issue Body Template

Use this template when creating each GitHub issue:

Title:

Issue title here

Objective:

Explain the exact goal in one or two paragraphs.

Context:

Reference the relevant file or checklist.

Tasks:

- task 1
- task 2
- task 3

Acceptance criteria:

- criterion 1
- criterion 2
- criterion 3

Evidence to commit:

- file path 1
- file path 2

Notes:

Clarify whether this is OFFLINE MOCK, WEB SERIAL, or real ESP32 hardware.

## 22. Public Communication Rule

For every v0.3 issue, keep this distinction explicit:

| Term | Meaning |
|---|---|
| OFFLINE MOCK | simulated packets |
| WEB SERIAL CONNECTED | browser serial connection active |
| Hardware validated | real ESP32 response observed |
| Physical node validated | visible LED or sensor/actuator behavior observed |

Never close a hardware issue based only on mock evidence.

## 23. Relationship With Broader MicroBot Ecosystem

The broader MicroBot ecosystem includes MicroBot OS, simulation engines, 3D/GLB assets, micro-drone work, cybersecurity material, physics/math study, telemetry analytics and portfolio assets.

v0.3 should not absorb all of that.

The correct role of v0.3 is narrower:

Create the first trustworthy bridge between the dashboard and real ESP32 hardware.

Once that bridge exists, later phases can connect simulation, telemetry, 3D visualization, multi-node routing, physical shell and portfolio publication.

## 24. v0.3 Done Definition

v0.3 is done when:

| Requirement | Minimum |
|---|---|
| NODE_00_MASTER uploaded to ESP32 | yes |
| Real PING/PONG validated | yes |
| Real STATUS validated | yes |
| STOP/RESET validated | yes |
| Evidence committed | yes |
| v0.3 completion summary created | yes |

v0.3 is strong when:

| Requirement | Strong Completion |
|---|---|
| Dashboard Web Serial connected | yes |
| Real packet visible in dashboard | yes |
| NODE_01 LED behavior validated | yes |
| README updated with hardware evidence | yes |
| v0.3 release notes prepared | yes |

## 25. Next Step

The next practical step is to create the GitHub milestone and issues from this plan.

This can be done manually from the GitHub interface or later with GitHub CLI.

Manual approach:

1. Open GitHub Issues.
2. Create milestone: v0.3 — Dashboard-to-Hardware Integration.
3. Create issues from this document.
4. Apply labels.
5. Link each issue to the milestone.
6. Close only when evidence is committed.

Recommended first issue to create:

Verify dashboard OFFLINE MOCK baseline before hardware testing

## 26. Version Notes

Version: v0.3 planning  
Repository: microbot-labs  
Document role: GitHub Issues plan  
Main scope: v0.3 issues, milestone, labels, dependencies, acceptance criteria and evidence policy  
Hardware required to create this document: no  
Hardware required to complete v0.3 issues: yes
