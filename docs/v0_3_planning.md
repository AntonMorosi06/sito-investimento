# MicroBot Labs — v0.3 Planning

## 1. Purpose

This document defines the planning baseline for MicroBot Labs v0.3.

Version v0.2 established a strong offline/mock development layer: documentation baseline, release baseline, firmware skeletons, offline protocol lab, PC Controller Dashboard, dashboard screenshot evidence, structured dashboard mock logs, Web Serial preparation and hardware validation checklists.

Version v0.3 should move the project from simulated validation toward the first hardware-connected integration.

The central goal of v0.3 is:

PC Controller Dashboard -> Web Serial -> NODE_00_MASTER ESP32 -> real protocol response -> dashboard state -> simulation placeholder

The secondary goal is:

PC or Dashboard -> NODE_01_LED_STATE -> visible LED state -> evidence photo/log -> documented validation

This phase should stay small, controlled and realistic. It should not attempt to build the full swarm, all six nodes, full wireless communication or final MicroBot shell.

## 2. Planning Metadata

| Field | Value |
|---|---|
| Project | MicroBot Labs |
| Repository | microbot-labs |
| Planning document | v0.3 planning |
| Created | 2026-05-15 08:46 |
| Previous phase | v0.2 baseline |
| Next target | hardware-connected dashboard validation |
| Current validated mode | OFFLINE MOCK |
| v0.3 target mode | WEB SERIAL CONNECTED |
| Hardware required | yes |
| ESP32 required | yes |

## 3. v0.2 Starting Point

The current v0.2 state includes:

| Area | Current Status |
|---|---|
| Documentation baseline | complete |
| GitHub repository | active and synchronized |
| GitHub release v0.1.0 | created |
| Offline Protocol Lab | working |
| PC Controller Dashboard | working in OFFLINE MOCK mode |
| Dashboard mode clarification | complete |
| Dashboard screenshot evidence | added |
| Dashboard mock structured log | added |
| Web Serial preparation | added |
| NODE_00_MASTER firmware skeleton | added |
| NODE_01_LED_STATE firmware skeleton | added |
| Hardware serial checklist | added |
| NODE_01 LED hardware checklist | added |
| v0.2 completion summary | added |

The main limitation is:

Real ESP32 hardware communication has not yet been validated.

## 4. v0.3 Main Objective

The v0.3 main objective is to validate the first real hardware communication path.

Target chain:

PC Controller Dashboard -> Browser Web Serial -> ESP32 running NODE_00_MASTER -> JSON-like packet -> dashboard raw terminal -> dashboard state update

Minimum successful v0.3 result:

The dashboard reaches WEB SERIAL CONNECTED and receives a real PING/PONG response from NODE_00_MASTER firmware running on an ESP32.

## 5. v0.3 Secondary Objective

The secondary objective is to validate NODE_01_LED_STATE as the first visible physical output node.

Target chain:

PC or Serial Monitor -> ESP32 running NODE_01_LED_STATE -> ACTIVE command -> LED turns on -> WARNING blink -> ERROR blink -> STOP safe blink -> RESET ready state

Minimum successful NODE_01 result:

The ACTIVE command produces both a structured serial response and a visible LED state change.

## 6. v0.3 Scope

Version v0.3 includes:

| Area | Included |
|---|---|
| Real ESP32 Master upload | yes |
| Real USB Serial PING/STATUS | yes |
| Dashboard Web Serial connection | yes |
| Real packet parsing in dashboard | yes |
| Hardware screenshot/log evidence | yes |
| NODE_01 LED standalone validation | yes |
| Hardware test reports | yes |
| Simulation placeholder update from real packets | initial |
| README/status/changelog updates | yes |

Version v0.3 does not include:

| Area | Excluded |
|---|---|
| Full six-node physical swarm | not yet |
| Wireless ESP-NOW communication | future |
| Battery-powered operation | future |
| Final PCB design | future |
| Final CAD shell | future |
| Micro-drone integration | future |
| Camera/vision hardware validation | future |
| Full telemetry analytics system | future |
| Certified product safety | not applicable |
| Autonomous swarm behavior | future |

## 7. Required v0.3 Hardware

Minimum hardware:

| Hardware | Purpose |
|---|---|
| ESP32 development board | NODE_00_MASTER or NODE_01_LED_STATE firmware target |
| USB data cable | Serial communication and firmware upload |
| Mac / PC | Arduino IDE, browser dashboard and Git |
| Arduino IDE or Arduino CLI | Firmware upload |
| Onboard LED or external LED | NODE_01 visible output |
| 220-330 ohm resistor | Required for external LED |
| Breadboard and jumper wires | Optional for external LED |
| Phone/camera | Evidence photo or short video |

Recommended first order:

1. Test NODE_00_MASTER using USB Serial.
2. Test dashboard Web Serial with NODE_00_MASTER.
3. Test NODE_01_LED_STATE standalone.
4. Capture screenshot/photo/log evidence.
5. Update documentation.

## 8. Required v0.3 Software

Existing files to use:

| File | Role |
|---|---|
| firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino | Master firmware |
| firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino | LED node firmware |
| web/dashboard/index.html | Dashboard interface |
| web/dashboard/app.js | Dashboard state and command logic |
| web/dashboard/protocol_parser.js | Incoming packet parser |
| web/dashboard/serial_adapter.js | Web Serial adapter |
| docs/hardware_serial_test_checklist_v0_2.md | Master hardware checklist |
| docs/node_01_led_state_hardware_test_checklist_v0_2.md | NODE_01 hardware checklist |
| docs/dashboard_test_checklist_v0_2.md | Dashboard mock checklist |
| demos/demo_v0_1/ | Evidence folder |

New files likely needed during v0.3:

| Future File | Purpose |
|---|---|
| demos/demo_v0_1/logs/node_00_master_hardware_serial_log_v0_3.txt | Real Master serial evidence |
| demos/demo_v0_1/notes/node_00_master_hardware_test_report_v0_3.md | Real Master test report |
| demos/demo_v0_1/screenshots/dashboard_web_serial_connected_v0_3.png | Dashboard connected evidence |
| demos/demo_v0_1/photos/node_00_master_esp32_v0_3.jpg | ESP32 Master photo |
| demos/demo_v0_1/photos/node_01_led_active_v0_3.jpg | NODE_01 LED evidence |
| demos/demo_v0_1/logs/node_01_led_state_hardware_log_v0_3.txt | NODE_01 serial log |
| docs/v0_3_completion_summary.md | Summary after v0.3 work |

## 9. v0.3 Milestones

Suggested milestones:

| Milestone | Success Definition |
|---|---|
| M1 — Master Upload | NODE_00_MASTER firmware compiles and uploads |
| M2 — Serial Monitor Validation | PING, STATUS, STOP and RESET work in Arduino Serial Monitor |
| M3 — Dashboard Web Serial Connection | Dashboard reaches WEB SERIAL CONNECTED |
| M4 — Dashboard Real Packet Display | Real ESP32 packets appear in raw terminal |
| M5 — NODE_01 Upload | NODE_01_LED_STATE firmware compiles and uploads |
| M6 — LED State Validation | ACTIVE, WARNING, ERROR, STOP and RESET affect LED behavior |
| M7 — Evidence Package | screenshots, photos, logs and notes are committed |
| M8 — v0.3 Summary | v0.3 completion summary documents what passed and what remains |

## 10. Test Order

Recommended test order:

| Step | Test | Reason |
|---:|---|---|
| 1 | Open dashboard in OFFLINE MOCK mode | Confirm software still works before hardware |
| 2 | Upload NODE_00_MASTER firmware | Prepare real Master |
| 3 | Test PING/STATUS in Serial Monitor | Validate firmware before browser |
| 4 | Test STOP/RESET in Serial Monitor | Validate safety state |
| 5 | Open dashboard and press Web Serial Hardware Only | Attempt browser serial connection |
| 6 | Send PING from dashboard | Validate dashboard to ESP32 command |
| 7 | Send STATUS from dashboard | Validate real packet display |
| 8 | Capture dashboard screenshot | Save visual evidence |
| 9 | Upload NODE_01_LED_STATE firmware | Prepare visible node |
| 10 | Test ACTIVE/WARNING/ERROR/STOP/RESET | Validate physical LED behavior |
| 11 | Capture LED photo/log | Save hardware evidence |
| 12 | Update GitHub documentation | Keep repository aligned |

## 11. v0.3 Acceptance Criteria

v0.3 should be considered successful when:

| Criterion | Required |
|---|---|
| NODE_00_MASTER firmware compiles | yes |
| NODE_00_MASTER firmware uploads | yes |
| Real PING/PONG works in Serial Monitor | yes |
| Real STATUS works in Serial Monitor | yes |
| STOP and RESET work on Master | yes |
| Dashboard Web Serial connects to ESP32 | recommended for v0.3 |
| Real packets appear in dashboard terminal | recommended for v0.3 |
| NODE_01 firmware compiles | recommended |
| NODE_01 LED ACTIVE state works | recommended |
| Hardware evidence is saved | yes |
| Documentation is updated | yes |
| No unsafe electrical behavior | yes |

Minimum v0.3 pass:

Real NODE_00_MASTER PING/PONG and STATUS from ESP32 are validated and documented.

Strong v0.3 pass:

Dashboard Web Serial receives real ESP32 packets and NODE_01 LED state is also validated.

## 12. Evidence Requirements

v0.3 evidence should clearly distinguish between mock and hardware.

Required evidence for Master:

| Evidence | Suggested Path |
|---|---|
| Serial Monitor screenshot | demos/demo_v0_1/screenshots/node_00_master_serial_monitor_v0_3.png |
| Serial log text | demos/demo_v0_1/logs/node_00_master_hardware_serial_log_v0_3.txt |
| Hardware test report | demos/demo_v0_1/notes/node_00_master_hardware_test_report_v0_3.md |
| ESP32 photo | demos/demo_v0_1/photos/node_00_master_esp32_v0_3.jpg |

Required evidence for dashboard Web Serial:

| Evidence | Suggested Path |
|---|---|
| Dashboard connected screenshot | demos/demo_v0_1/screenshots/dashboard_web_serial_connected_v0_3.png |
| Dashboard hardware log | demos/demo_v0_1/logs/dashboard_web_serial_hardware_log_v0_3.jsonl |
| Dashboard hardware report | demos/demo_v0_1/notes/dashboard_web_serial_hardware_test_report_v0_3.md |

Required evidence for NODE_01:

| Evidence | Suggested Path |
|---|---|
| LED active photo | demos/demo_v0_1/photos/node_01_led_active_v0_3.jpg |
| LED warning photo/video | demos/demo_v0_1/photos/node_01_led_warning_v0_3.jpg |
| NODE_01 serial log | demos/demo_v0_1/logs/node_01_led_state_hardware_log_v0_3.txt |
| NODE_01 test report | demos/demo_v0_1/notes/node_01_led_state_hardware_test_report_v0_3.md |

## 13. Safety Rules for v0.3

v0.3 safety rules:

| Rule | Reason |
|---|---|
| USB-only first | Avoid power complexity |
| Master-only first | Reduce debugging variables |
| No motors/coils during first tests | Avoid current and heat risks |
| No battery during first tests | Keep power source predictable |
| External LED requires resistor | Protect GPIO |
| STOP must be tested | Safety behavior must be visible |
| EMERGENCY_STOP should be tested carefully | Confirms emergency state |
| Board temperature should be checked | Detect shorts or overload |
| Evidence must be honest | Avoid overstating progress |

If anything heats, smells, resets repeatedly, or behaves unpredictably, stop the test.

## 14. Dashboard State Requirements

During v0.3, dashboard mode wording must remain accurate.

| Mode | Meaning |
|---|---|
| OFFLINE MOCK | Simulated packets only |
| WEB SERIAL READY | Preparing to request serial port |
| WEB SERIAL CONNECTED | Real serial port connected |
| WEB SERIAL UNAVAILABLE | Browser/context cannot use Web Serial |

The dashboard must not show or imply hardware validation unless real packets are being received from the ESP32.

## 15. v0.3 GitHub Issues

Suggested GitHub issues for v0.3:

| Issue Title | Purpose |
|---|---|
| Upload NODE_00_MASTER firmware to ESP32 | First real Master validation |
| Capture NODE_00_MASTER PING/STATUS serial log | Evidence |
| Test dashboard Web Serial with ESP32 Master | Dashboard-to-hardware integration |
| Capture dashboard Web Serial connected screenshot | Evidence |
| Upload NODE_01_LED_STATE firmware to ESP32 | First visible physical node |
| Capture NODE_01 LED active/warning/error evidence | Evidence |
| Create v0.3 hardware validation summary | Close the phase |

## 16. Relationship With Broader MicroBot Ecosystem

v0.3 remains a controlled early phase.

It does not yet include the full MicroBot ecosystem, but it creates the first physical bridge needed by the broader vision.

Relationship to broader system:

| Broader Area | v0.3 Connection |
|---|---|
| MicroBot modular robotics | First Master and first node validation |
| PC Controller Dashboard | First hardware-connected command path |
| Telemetry | First real packet display |
| Simulation Engine | First future real-packet state mapping |
| Safety Layer | STOP and RESET validation |
| Hardware System | ESP32 and LED node start |
| GitHub/Portfolio | Evidence package and public credibility |
| 3D/GLB assets | Not part of v0.3 core |
| Micro-drone branch | Future branch, not v0.3 core |
| Dimension Engine | Future simulation mapping, not physical claim |

## 17. Risks

Main v0.3 risks:

| Risk | Mitigation |
|---|---|
| ESP32 not recognized | Try another cable, driver, port or board |
| Upload fails | Check board type, boot mode and port |
| Serial Monitor receives nothing | Check baud, reset board, line ending |
| Dashboard Web Serial unavailable | Use Chrome/Edge and local/secure context |
| Packet parsing fails | Capture raw packet and update parser |
| LED does not work | Check pin, onboard LED availability or external LED wiring |
| User overclaims result | Keep mock/hardware distinction explicit |
| Hardware overheats | Stop immediately and inspect wiring |

## 18. v0.3 Completion Definition

v0.3 can be considered complete when at least this is true:

NODE_00_MASTER has been uploaded to ESP32 and responds to PING, STATUS, STOP and RESET through USB Serial, with evidence committed to the repository.

v0.3 can be considered strong when this is also true:

The PC Controller Dashboard connects through Web Serial and receives real ESP32 packets, and NODE_01_LED_STATE produces visible LED state changes.

## 19. Next Phase After v0.3

The likely next phase is:

v0.4 — Simulation Sync from Real Packets

Expected v0.4 target:

Real or mock packet -> dashboard state -> simulation state object -> visual node update -> recorded log

Possible v0.4 files:

| File | Purpose |
|---|---|
| web/dashboard/state_store.js | Shared state model |
| web/dashboard/simulation_bridge.js | Connect dashboard state to simulation placeholder |
| docs/simulation_sync_plan_v0_4.md | Plan simulation synchronization |
| demos/demo_v0_1/logs/simulation_sync_test_log_v0_4.jsonl | Simulation sync evidence |

## 20. Current Planning Conclusion

v0.3 is the bridge between the current mock software layer and the first real hardware evidence.

The correct next practical action is not to add more speculative architecture.

The correct next practical action is to test NODE_00_MASTER on a real ESP32 when hardware is available.

Until then, this planning file keeps the next phase clear and ready.

## 21. Version Notes

Version: v0.3 planning  
Repository: microbot-labs  
Document role: next-phase implementation plan  
Main scope: dashboard-to-hardware integration, ESP32 Master validation, NODE_01 LED validation, Web Serial readiness and evidence capture  
Hardware required for completion: yes  
ESP32 required for completion: yes
