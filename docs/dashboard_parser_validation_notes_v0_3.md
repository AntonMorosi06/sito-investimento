# MicroBot Labs — Dashboard Parser Validation Notes v0.3

Status: offline parser validation notes  
Created: 2026-05-16  
Hardware validation status: not hardware-validated  
Input source: `demos/demo_v0_3/pre_hardware_mock_node00_master/logs/*.jsonl`  
Validation tool: `tools/offline/validate_dashboard_mock_output.py`  
Dashboard parser reference: `web/dashboard/protocol_parser.js`

## 1. Purpose

This document explains the v0.3 offline dashboard parser validation step.

The repository already contains a pre-hardware NODE_00_MASTER mock responder that generates simulated JSONL output labeled `PRE_HARDWARE_SIMULATED`. The dashboard already contains parser and Web Serial preparation files. The next useful step is to verify that the simulated JSONL output follows a structure compatible with the dashboard parser boundary.

This validation does not use ESP32 hardware. It validates the dashboard-facing packet model offline.

## 2. Validation chain

The offline validation chain is:

    mock_node00_master_responder.py
        -> simulated JSONL output
        -> validate_dashboard_mock_output.py
        -> parser compatibility checks
        -> report and JSON summary

The future real dashboard chain remains:

    ESP32 NODE_00_MASTER
        -> USB Serial / Web Serial
        -> serial_adapter.js
        -> protocol_parser.js
        -> dashboard state mapping

## 3. Parser compatibility model

The JavaScript dashboard parser accepts line-based JSON objects and requires, at minimum:

- `type`
- `source`

The allowed packet types are:

- `event`
- `command`
- `response`
- `telemetry`
- `heartbeat`
- `error`

The offline Python validation mirrors these core constraints, then applies MicroBot-specific checks for the simulated NODE_00_MASTER flow.

## 4. What is checked

The validation tool checks:

- JSONL file exists;
- each JSONL wrapper can be parsed;
- each wrapped packet content can be parsed;
- packet contains `type` and `source`;
- packet type is allowed;
- `validation_mode=PRE_HARDWARE_SIMULATED` is preserved;
- `NODE_00_MASTER` appears as the source;
- boot event is present;
- heartbeat packet is present;
- `PING` produces `PONG`;
- `STATUS` identifies `NODE_00_MASTER`;
- `GET_NODE_TABLE` lists expected future nodes;
- `SCAN_NODES` is present;
- `STOP` produces `SAFE_MODE`;
- `RESET` produces `READY`;
- sequence numbers are monotonic when present;
- no unknown command is present in the expected command sequence.

## 5. What this validates

This validates:

- parser-facing packet shape;
- mock responder JSONL usefulness;
- dashboard preparation logic;
- expected state mapping before real Web Serial hardware integration.

## 6. What this does not validate

This does not validate:

- ESP32 firmware upload;
- USB Serial;
- Web Serial hardware connection;
- GPIO output;
- real LED state;
- real sensors;
- real actuators;
- real wireless nodes;
- real magnetic docking;
- full MicroBot swarm behavior.

## 7. How to run

From the repository root:

    python3 tools/offline/validate_dashboard_mock_output.py

The script automatically finds the latest JSONL file in:

    demos/demo_v0_3/pre_hardware_mock_node00_master/logs/

If no JSONL exists, run the mock responder first:

    python3 tools/offline/mock_node00_master_responder.py

## 8. Evidence output

The validation tool creates:

- Markdown report under `demos/demo_v0_3/dashboard_mock_output_validation/reports/`;
- JSON summary under `demos/demo_v0_3/dashboard_mock_output_validation/summaries/`;
- optional dashboard fixture under `web/dashboard/test_fixtures/`.

## 9. Correct interpretation

A PASS result means:

    Simulated NODE_00_MASTER JSONL is compatible with the dashboard-facing parser model.

It does not mean:

    Dashboard Web Serial has been validated on real ESP32 hardware.
