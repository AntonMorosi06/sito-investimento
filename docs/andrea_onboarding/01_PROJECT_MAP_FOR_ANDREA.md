# 01 — Project Map for Andrea

Status: project map  
Created: 2026-05-16

## Repository layers

MicroBot Labs is organized in layers.

## 1. Documentation layer

This layer explains the project, its status, its evidence and its limits.

Main files:

| `README.md` | Main public entry point of the repository. | present |
| `docs/current_status.md` | Current operational status and maturity summary. | present |
| `docs/current_evidence_v0_3.md` | Canonical evidence page: what exists, what is simulated, what is not yet hardware-validated. | present |
| `docs/external_repository_map_v0_3.md` | Map of the AntonMorosi06 repository ecosystem and satellite repositories. | present |
| `docs/repository_audit_and_canonical_status_v0_3.md` | Canonical repository audit and truth-state document. | present |
| `docs/node_00_master_real_serial_validation_v0_3.md` | Hardware-ready validation plan for the first ESP32 Master serial test. | present |
| `docs/pre_hardware_simulation_bridge_v0_3.md` | Explains why and how NODE_00 is simulated before hardware. | present |
| `docs/node_00_master_expected_output_spec_v0_3.md` | Expected output shape for NODE_00_MASTER. | present |
| `docs/dashboard_mock_output_integration_notes_v0_3.md` | Explains how simulated output prepares dashboard/parser/Web Serial flow. | present |
| `docs/dashboard_mock_output_test_plan_v0_3.md` | Test plan for dashboard/mock-output integration. | present |
| `docs/dashboard_parser_validation_notes_v0_3.md` | Notes for validating simulated JSONL against dashboard-facing parser logic. | present |
| `docs/node_01_led_state_pre_hardware_simulation_v0_3.md` | Pre-hardware simulation workflow for the first visible LED node. | present |
| `docs/node_01_led_state_expected_output_spec_v0_3.md` | Expected output and state behavior for NODE_01_LED_STATE. | present |
| `docs/combined_node00_node01_pre_hardware_demo_report_v0_3.md` | Optional combined pre-hardware report if created. | present |
| `docs/setup/arduino_ide_esp32_setup_guide_v0_3.md` | Arduino IDE and ESP32 setup guide. | present |
| `docs/setup/esp32_serial_port_selection_guide_v0_3.md` | Guide for finding the correct ESP32 serial port. | present |
| `docs/troubleshooting/esp32_pre_hardware_troubleshooting_v0_3.md` | Common ESP32 setup/upload/serial issues. | present |
| `docs/purchase/hardware_purchase_readiness_checklist_v0_3.md` | Checklist before buying hardware. | present |
| `docs/purchase/minimum_bom_amazon_search_list_v0_3.md` | Minimum BOM and Amazon search list. | present |
| `docs/outreach/professor_collaborator_message_v0_3.md` | Optional outreach message if created. | present |

## 2. Firmware layer

This layer contains firmware intended for future ESP32 tests.

| `firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino` | ESP32 Master firmware target for first hardware validation. | present |
| `firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino` | ESP32 LED state node firmware target for first visible output validation. | present |

## 3. Offline tools layer

This layer allows Anton to continue development before hardware is available.

| `tools/offline/mock_node00_master_responder.py` | Simulates NODE_00_MASTER command/response behavior. | present |
| `tools/offline/validate_dashboard_mock_output.py` | Validates NODE_00 simulated JSONL against dashboard-facing parser expectations. | present |
| `tools/offline/mock_node01_led_state_responder.py` | Simulates NODE_01_LED_STATE and virtual LED state behavior. | present |
| `tools/serial/capture_node00_master_validation.py` | Future real ESP32 serial capture tool for NODE_00_MASTER. | present |

## 4. Dashboard layer

The dashboard is the PC Controller cockpit. It is currently offline/mock and parser-ready.

Important paths:

| Path | Purpose | Status |
|---|---|---|
| `web/dashboard/README.md` | Dashboard explanation and current modes. | present |
| `web/dashboard/index.html` | Dashboard entry page. | present |
| `web/dashboard/app.js` | Dashboard runtime logic. | present |
| `web/dashboard/protocol_parser.js` | Parser for line-based JSON packets. | present |
| `web/dashboard/serial_adapter.js` | Future Web Serial adapter. | present |
| `web/dashboard/test_fixtures/pre_hardware_node00_master_sample.jsonl` | Fixture generated from simulated NODE_00 output. | present |

## 5. Evidence/demo layer

This layer stores simulated reports, parser validation reports and future hardware evidence folders.

| `demos/demo_v0_3/pre_hardware_mock_node00_master/` | Simulated NODE_00 logs, reports and expected outputs. | present |
| `demos/demo_v0_3/dashboard_mock_output_validation/` | Offline parser validation reports for dashboard-facing logic. | present |
| `demos/demo_v0_3/pre_hardware_mock_node01_led_state/` | Simulated NODE_01 logs, reports and expected outputs. | present |
| `demos/demo_v0_3/combined_pre_hardware_demo/` | Optional combined pre-hardware demo index if created. | present |
| `demos/demo_v0_3/node_00_master_serial/` | Reserved for future real NODE_00 hardware serial evidence. | present |

## 6. GitHub issue layer

GitHub issues are used as project control points.

Important current issue themes:

- hardware purchase readiness;
- NODE_00 real ESP32 upload;
- NODE_00 mock responder;
- dashboard/mock-output integration;
- offline parser validation;
- NODE_01 pre-hardware simulation;
- Andrea onboarding map.

## How to understand the project in one chain

Current chain:

    documentation
        -> pre-hardware NODE_00 simulation
        -> dashboard parser validation
        -> pre-hardware NODE_01 simulation
        -> current evidence page
        -> hardware-ready ESP32 plan

Future chain:

    ESP32 NODE_00_MASTER
        -> real serial evidence
        -> ESP32 NODE_01_LED_STATE
        -> real visible LED evidence
        -> dashboard Web Serial evidence
        -> later sensors/nodes/telemetry
