# MicroBot Labs — Current Evidence v0.3

Status: canonical evidence page  
Created: 2026-05-16  
Current phase: v0.3 pre-hardware and hardware-integration preparation  
Hardware validation status: not yet hardware-validated

## 1. Purpose

This document summarizes the current evidence available inside `microbot-labs`.

Its purpose is to make the project understandable to an external reader without forcing them to inspect every folder, issue, script and report manually.

This page separates:

- released documentation;
- canonical repository status;
- offline/mock validation;
- pre-hardware simulated evidence;
- hardware-ready plans;
- purchase/setup readiness;
- real hardware evidence still missing.

The central rule is simple: MicroBot Labs must never confuse simulated evidence with hardware validation.

## 2. Current truth-state

MicroBot Labs currently has a strong documentation and pre-hardware validation base.

The repository contains:

- v0.1 documentation/public foundation baseline;
- v0.2 offline/mock validation material;
- v0.3 canonical repository map and status;
- v0.3 NODE_00_MASTER hardware-ready serial validation pack;
- v0.3 pre-hardware setup and purchase readiness pack;
- v0.3 pre-hardware simulated NODE_00_MASTER mock responder workflow;
- generated simulated logs and reports marked `PRE_HARDWARE_SIMULATED`.

The repository does not yet contain:

- real ESP32 upload evidence;
- real NODE_00_MASTER serial hardware log;
- real NODE_01 LED state hardware evidence;
- real Web Serial dashboard-to-ESP32 evidence;
- real sensor, actuator, magnetic docking, battery or wireless swarm evidence.

## 3. Evidence maturity table

| Evidence area | Current state | Evidence type | Hardware claim allowed? |
|---|---|---|---|
| v0.1 documentation baseline | complete | documentation | no |
| v0.2 offline protocol/dashboard work | complete baseline | offline/mock | no |
| v0.3 repository map | complete | audit/canonical documentation | no |
| v0.3 canonical status | complete | audit/canonical documentation | no |
| NODE_00_MASTER serial validation pack | complete | hardware-ready plan + tool | not yet |
| Pre-hardware setup and BOM | complete | purchase/setup preparation | no |
| Pre-hardware mock responder | complete | simulated software evidence | no |
| Pre-hardware simulated report | generated and committed | PRE_HARDWARE_SIMULATED | no |
| Real ESP32 NODE_00_MASTER upload | not done | future hardware evidence | yes, after real test |
| Real NODE_01 LED state test | not done | future hardware evidence | yes, after real test |
| Dashboard Web Serial to real ESP32 | not done | future integration evidence | yes, after real test |
| Sensors, magnetics, movement, wireless swarm | not done | future hardware phases | no current claim |

## 4. Released and canonical documentation evidence

The repository includes a canonical documentation layer that defines the project direction and prevents uncontrolled expansion.

Important files:

- `README.md`
- `docs/current_status.md`
- `docs/external_repository_map_v0_3.md`
- `docs/repository_audit_and_canonical_status_v0_3.md`
- `docs/v0_2_completion_summary.md`
- `docs/v0_3_planning.md`
- `docs/github_issues_v0_3_plan.md`
- `docs/github_milestone_status_v0_3.md`

Interpretation:

This evidence proves that the repository has a structured project direction, a mapped repository ecosystem and clear maturity language. It does not prove physical hardware validation.

## 5. Hardware-ready NODE_00_MASTER evidence

The repository includes a hardware-ready validation path for the first ESP32 Master test.

Important files:

- `firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino`
- `firmware/esp32/NODE_00_MASTER/README.md`
- `tools/serial/capture_node00_master_validation.py`
- `docs/node_00_master_real_serial_validation_v0_3.md`
- `demos/demo_v0_3/node_00_master_serial/README.md`
- `demos/demo_v0_3/node_00_master_serial/logs/README.md`
- `demos/demo_v0_3/node_00_master_serial/reports/README.md`

Interpretation:

This evidence means the NODE_00_MASTER hardware test is prepared. It does not mean that an ESP32 has already been flashed and validated.

Correct claim:

    NODE_00_MASTER hardware validation workflow is ready.

Incorrect claim:

    NODE_00_MASTER has been validated on real hardware.

## 6. Pre-hardware setup and purchase evidence

The repository includes pre-hardware setup and purchase preparation.

Important files:

- `docs/setup/arduino_ide_esp32_setup_guide_v0_3.md`
- `docs/setup/esp32_serial_port_selection_guide_v0_3.md`
- `docs/troubleshooting/esp32_pre_hardware_troubleshooting_v0_3.md`
- `docs/purchase/hardware_purchase_readiness_checklist_v0_3.md`
- `docs/purchase/minimum_bom_amazon_search_list_v0_3.md`
- `docs/issues/hardware_purchase_ready_issue_v0_3.md`

Related GitHub issue:

- `#8 Hardware purchase readiness v0.3`

Interpretation:

This evidence shows that the first hardware purchase and setup path has been prepared. It does not prove that the hardware has been purchased, received or tested.

## 7. Pre-hardware simulated NODE_00_MASTER evidence

The repository includes a simulated NODE_00_MASTER responder and generated simulated evidence.

Important files:

- `tools/offline/mock_node00_master_responder.py`
- `docs/pre_hardware_simulation_bridge_v0_3.md`
- `docs/node_00_master_expected_output_spec_v0_3.md`
- `docs/issues/pre_hardware_mock_responder_issue_v0_3.md`
- `demos/demo_v0_3/pre_hardware_mock_node00_master/README.md`
- `demos/demo_v0_3/pre_hardware_mock_node00_master/logs/`
- `demos/demo_v0_3/pre_hardware_mock_node00_master/reports/`
- `demos/demo_v0_3/pre_hardware_mock_node00_master/expected_outputs/`

Related GitHub issue:

- `#9 Pre-hardware NODE_00_MASTER mock responder v0.3`

The simulated report currently demonstrates:

- `PING` -> `PONG`;
- `STATUS` response;
- `GET_NODE_TABLE` response;
- `SCAN_NODES` response;
- `STOP` -> `SAFE_MODE`;
- `RESET` -> `READY`;
- JSON-structured output;
- simulated raw log generation;
- simulated JSONL log generation;
- Markdown report generation.

Interpretation:

This is useful software evidence. It is explicitly marked `PRE_HARDWARE_SIMULATED`. It is not ESP32 hardware evidence.

## 8. Offline/mock dashboard and protocol evidence

The repository also contains previous offline/mock evidence from v0.2.

Important areas:

- `demos/demo_v0_1/`
- `tools/offline_protocol_lab/`
- `web/dashboard/`
- dashboard screenshots and logs where present;
- dashboard checklist and test notes.

Interpretation:

This layer proves that the project has mock/offline command flow, visual evidence and dashboard preparation. It does not prove real ESP32 hardware communication.

## 9. GitHub issue evidence

Relevant current issues:

- `#4 Upload NODE_00_MASTER firmware to ESP32`
- `#8 Hardware purchase readiness v0.3`
- `#9 Pre-hardware NODE_00_MASTER mock responder v0.3`

Interpretation:

These issues show the milestone path. Hardware-related issues must not be closed until their acceptance criteria are met with real evidence.

## 10. What can be shown to a professor or collaborator now

The project can honestly be described as:

    MicroBot Labs is a structured experimental robotics ecosystem with a completed documentation baseline, offline/mock validation, a mapped repository system, a hardware-ready ESP32 Master validation workflow, pre-hardware setup documentation and a simulated NODE_00_MASTER responder used as expected-output baseline.

The project should not be described as:

    A finished robot.
    A validated swarm.
    A completed ESP32 hardware system.
    A validated magnetic docking system.
    A physical programmable-matter platform.

## 11. What is missing for the first hardware claim

The first hardware claim requires:

1. ESP32 board available.
2. NODE_00_MASTER firmware uploaded.
3. Serial port detected.
4. Real capture script executed.
5. Raw hardware log generated.
6. Hardware report generated.
7. Report reviewed.
8. Evidence committed.
9. Current status updated.

Only after these steps can the repository claim:

    NODE_00_MASTER serial command/response validated on real ESP32 hardware.

## 12. Next recommended actions without hardware

If no hardware is available yet, the next useful actions are:

1. Add dashboard/mock-output integration notes.
2. Create a dashboard parser test against the simulated JSONL output.
3. Prepare a professor/collaborator message.
4. Prepare NODE_01_LED_STATE pre-hardware simulation.
5. Review and refine the minimum BOM.
6. Keep the hardware issues open.

## 13. Next recommended actions with hardware

When hardware becomes available:

1. Upload `NODE_00_MASTER.ino`.
2. Run the real serial capture script.
3. Commit real hardware log and report.
4. Update this evidence page.
5. Update `docs/current_status.md`.
6. Move to NODE_01_LED_STATE test.

<!-- MICROBOT_CURRENT_EVIDENCE_V03_NODE01_PRE_HARDWARE_SIM_START -->
## NODE_01_LED_STATE pre-hardware simulated evidence

MicroBot Labs now includes simulated pre-hardware evidence for `NODE_01_LED_STATE`.

Important files:

- `tools/offline/mock_node01_led_state_responder.py`
- `docs/node_01_led_state_pre_hardware_simulation_v0_3.md`
- `docs/node_01_led_state_expected_output_spec_v0_3.md`
- `docs/issues/node01_led_state_pre_hardware_simulation_issue_v0_3.md`
- `demos/demo_v0_3/pre_hardware_mock_node01_led_state/README.md`
- `demos/demo_v0_3/pre_hardware_mock_node01_led_state/logs/`
- `demos/demo_v0_3/pre_hardware_mock_node01_led_state/reports/`
- `demos/demo_v0_3/pre_hardware_mock_node01_led_state/expected_outputs/`

The simulated report demonstrates command/state behavior for:

- `PING` -> `PONG`;
- `STATUS`;
- `ACTIVE` -> virtual LED `ON`;
- `IDLE` -> virtual LED `OFF`;
- `WARNING` -> virtual LED `BLINK_SLOW`;
- `ERROR` -> virtual LED `BLINK_FAST`;
- `STOP` -> `SAFE_MODE` with virtual LED `BLINK_SAFETY`;
- `RESET` -> `READY`.

Interpretation:

This is useful pre-hardware software evidence. It is explicitly marked `PRE_HARDWARE_SIMULATED`. It is not ESP32 hardware evidence and does not prove that a real LED changed state.
<!-- MICROBOT_CURRENT_EVIDENCE_V03_NODE01_PRE_HARDWARE_SIM_END -->

<!-- MICROBOT_CURRENT_EVIDENCE_V03_COMBINED_PRE_HW_DEMO_START -->
## Combined NODE_00 + NODE_01 pre-hardware demo

Main file:

- `docs/combined_node00_node01_pre_hardware_demo_report_v0_3.md`

This is the current reviewer-facing pre-hardware demo summary.
<!-- MICROBOT_CURRENT_EVIDENCE_V03_COMBINED_PRE_HW_DEMO_END -->
