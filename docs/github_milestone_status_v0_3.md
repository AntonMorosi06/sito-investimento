# MicroBot Labs — GitHub Milestone Status v0.3

## 1. Purpose

This document records the current GitHub issue and milestone status for MicroBot Labs during the transition from v0.2 to v0.3.

The goal is to keep the repository operationally clear.

MicroBot Labs is no longer only a documentation repository. It now contains documentation, firmware skeletons, dashboard code, offline protocol tools, mock evidence, structured logs, screenshots, test checklists and a GitHub roadmap.

This file explains which work belongs to the completed v0.2 baseline and which work belongs to the active v0.3 hardware-integration phase.

## 2. Status Metadata

| Field | Value |
|---|---|
| Project | MicroBot Labs |
| Repository | microbot-labs |
| GitHub owner/repo | AntonMorosi06/microbot-labs |
| Document | GitHub Milestone Status v0.3 |
| Generated | 2026-05-15 09:26 |
| Current strategic phase | transition from v0.2 baseline to v0.3 hardware integration |
| Main active milestone | v0.3 — Dashboard-to-Hardware Integration |
| Current validated mode | OFFLINE MOCK |
| Next target mode | WEB SERIAL CONNECTED |
| Hardware required for next major validation | yes |
| ESP32 required for next major validation | yes |

## 3. Current Interpretation

The current project state should be interpreted in this way:

| Layer | Status |
|---|---|
| v0.1.0 documentation baseline | complete |
| GitHub release v0.1.0 | created |
| v0.2 offline/mock layer | working |
| PC Controller Dashboard mock | working |
| Offline Protocol Lab | working |
| Dashboard screenshot evidence | added |
| Dashboard mock structured log | added |
| Firmware skeletons | created |
| Hardware test plans | created |
| v0.3 planning | created |
| v0.3 GitHub issues plan | created |
| v0.3 milestone | created |
| Real ESP32 Master validation | not yet completed |
| Real NODE_01 LED validation | not yet completed |
| Dashboard Web Serial with real hardware | not yet completed |

The important distinction is:

v0.2 validates the software/mock/control layer.

v0.3 must validate the first real hardware-connected chain.

## 4. v0.2 Baseline Status

The v0.2 baseline can be considered complete for the following categories:

| Category | Evidence |
|---|---|
| Firmware skeleton | NODE_00_MASTER and NODE_01_LED_STATE firmware files exist |
| Offline protocol | Offline Protocol Lab works |
| Dashboard mock | PC Controller Dashboard works in OFFLINE MOCK mode |
| Mode clarification | Dashboard distinguishes OFFLINE MOCK from Web Serial modes |
| Visual evidence | Offline lab and dashboard screenshots exist |
| Structured evidence | Dashboard mock JSONL log exists |
| Testing documents | Dashboard and hardware checklists exist |
| v0.2 summary | v0.2 completion summary exists |

Relevant files:

| File | Role |
|---|---|
| firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino | Master firmware skeleton |
| firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino | LED node firmware skeleton |
| tools/offline_protocol_lab/index.html | Offline Protocol Lab |
| web/dashboard/index.html | PC Controller Dashboard |
| demos/demo_v0_1/screenshots/offline_protocol_lab_v0_2.png | Offline lab evidence |
| demos/demo_v0_1/screenshots/pc_controller_dashboard_v0_2.png | Dashboard evidence |
| demos/demo_v0_1/logs/dashboard_mock_test_log_v0_2.jsonl | Structured dashboard mock log |
| docs/v0_2_completion_summary.md | v0.2 completion summary |

## 5. v0.3 Active Milestone

The active v0.3 milestone is:

v0.3 — Dashboard-to-Hardware Integration

Purpose:

Validate the first real hardware-connected MicroBot Labs chain.

Target chain:

PC Controller Dashboard -> Web Serial -> NODE_00_MASTER ESP32 -> real protocol response -> dashboard state -> simulation placeholder

Secondary target:

PC or Serial Monitor -> NODE_01_LED_STATE -> visible LED state -> evidence photo/log/report

## 6. v0.3 Open Work

The v0.3 work should remain focused on five core tasks:

| Task | Meaning |
|---|---|
| Verify dashboard OFFLINE MOCK baseline | Confirm software baseline still works before hardware |
| Upload NODE_00_MASTER firmware | Put Master firmware on real ESP32 |
| Validate PING/STATUS | Confirm real serial command/response |
| Validate STOP/RESET | Confirm real safety-state behavior |
| Test dashboard Web Serial | Connect dashboard to real ESP32 packets |

Only after these tasks are clear should the project move toward NODE_01 real LED evidence and v0.3 completion notes.

## 7. Issue Closing Policy

Issues should be closed only when there is committed evidence.

Correct closure evidence:

| Evidence Type | Example |
|---|---|
| Code file | firmware or dashboard file committed |
| Screenshot | dashboard or serial monitor screenshot |
| Log | TXT or JSONL log committed |
| Report | Markdown report committed |
| Checklist | completed checklist or summary committed |

Incorrect closure evidence:

| Problem | Reason |
|---|---|
| Closing hardware issue from mock screenshot | Misleading |
| Closing Web Serial issue without real serial connection | Not validated |
| Closing LED issue without visible LED evidence | Not physically validated |
| Closing safety issue without STOP/RESET test | Safety not proven |

## 8. Mock vs Hardware Rule

The repository must always distinguish these states:

| Term | Meaning |
|---|---|
| OFFLINE MOCK | Simulated packets generated in browser |
| WEB SERIAL READY | Dashboard is preparing for browser serial connection |
| WEB SERIAL CONNECTED | Browser serial port is connected |
| Hardware validated | Real ESP32 response observed and documented |
| Physical node validated | Real visible or measured node behavior observed |

This rule protects the credibility of the project.

## 9. Current GitHub Milestones Snapshot

The following snapshot was captured from GitHub CLI.

{"closed_issues":2,"number":1,"open_issues":0,"state":"open","title":"v0.2.0 — Master Connection and NODE_01 Validation"}
{"closed_issues":1,"number":2,"open_issues":4,"state":"open","title":"v0.3 — Dashboard-to-Hardware Integration"}

## 10. Current Open Issues Snapshot

The following open issues were captured from GitHub CLI.

7	OPEN	Test dashboard Web Serial with ESP32 Master	hardware, dashboard, priority-high, v0.3, protocol, web-serial, blocked-hardware	2026-05-15T06:51:18Z
6	OPEN	Validate STOP and RESET on real NODE_00_MASTER	hardware, firmware, safety, priority-high, v0.3, blocked-hardware	2026-05-15T06:51:15Z
5	OPEN	Validate NODE_00_MASTER PING and STATUS through Serial Monitor	hardware, firmware, priority-high, v0.3, protocol, blocked-hardware	2026-05-15T06:51:13Z
4	OPEN	Upload NODE_00_MASTER firmware to ESP32	hardware, firmware, priority-high, v0.3, blocked-hardware	2026-05-15T06:51:11Z

## 11. Recent Closed Issues Snapshot

The following closed issues were captured from GitHub CLI.

3	CLOSED	Verify dashboard OFFLINE MOCK baseline before hardware testing	dashboard, safety, demo, priority-high, v0.3	2026-05-15T06:53:39Z
2	CLOSED	Build NODE_01_LED_STATE firmware prototype	hardware, firmware, good-first-task, priority-high, v0.2	2026-05-15T06:55:06Z
1	CLOSED	Build NODE_00_MASTER firmware skeleton	hardware, firmware, safety, priority-high, v0.2	2026-05-15T06:55:02Z

## 12. Recommended Immediate Next Action

The next practical action depends on hardware availability.

If ESP32 is not available:

Work only on documentation cleanup, GitHub status, and dashboard mock stability. Do not pretend to complete hardware issues.

If ESP32 is available:

Start with the issue:

Upload NODE_00_MASTER firmware to ESP32

Then proceed to:

Validate NODE_00_MASTER PING and STATUS through Serial Monitor

Then proceed to:

Validate STOP and RESET on real NODE_00_MASTER

Only after those are working should Web Serial be tested from the dashboard.

## 13. Recommended GitHub View

For the next work session, use this order:

| GitHub Area | Purpose |
|---|---|
| Issues | See active v0.3 work |
| Milestones | Track v0.3 completion |
| README | Public-facing status |
| docs/v0_3_planning.md | Technical plan |
| docs/github_issues_v0_3_plan.md | Issue logic |
| docs/hardware_serial_test_checklist_v0_2.md | ESP32 Master test procedure |
| docs/node_01_led_state_hardware_test_checklist_v0_2.md | LED node test procedure |

## 14. Suggested Next Repository Step

The next repository document should be created only after actual hardware testing begins.

Suggested next hardware evidence files:

| File | When To Create |
|---|---|
| demos/demo_v0_1/logs/node_00_master_hardware_serial_log_v0_3.txt | After real Serial Monitor test |
| demos/demo_v0_1/notes/node_00_master_hardware_test_report_v0_3.md | After real Master test |
| demos/demo_v0_1/screenshots/node_00_master_serial_monitor_v0_3.png | After real serial screenshot |
| demos/demo_v0_1/photos/node_00_master_esp32_v0_3.jpg | After ESP32 photo |
| demos/demo_v0_1/screenshots/dashboard_web_serial_connected_v0_3.png | After real Web Serial dashboard test |

## 15. Current State in One Sentence

MicroBot Labs has completed the v0.2 mock/dashboard/firmware-baseline layer and is now organized around the v0.3 milestone for real ESP32 Master validation and dashboard-to-hardware integration.

## 16. Version Notes

Version: v0.3 status  
Repository: microbot-labs  
Document role: GitHub issue and milestone status snapshot  
Main scope: v0.2 closure state, v0.3 active milestone, open hardware issues, evidence policy and next action  
Hardware required to read this file: no  
Hardware required to complete v0.3: yes
