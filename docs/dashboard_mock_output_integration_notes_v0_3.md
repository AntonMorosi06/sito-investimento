# MicroBot Labs — Dashboard and Mock Output Integration Notes v0.3

Status: dashboard/mock-output integration notes  
Created: 2026-05-16  
Hardware validation status: not hardware-validated  
Related dashboard folder: `web/dashboard/`  
Related mock responder: `tools/offline/mock_node00_master_responder.py`  
Related simulated evidence: `demos/demo_v0_3/pre_hardware_mock_node00_master/`  
Related future hardware capture: `tools/serial/capture_node00_master_validation.py`

## 1. Purpose

This document explains how the MicroBot Labs dashboard should use the current pre-hardware NODE_00_MASTER mock output as a preparation layer for future real ESP32 Web Serial integration.

The dashboard already has a clear role: it is the PC Controller cockpit for connection state, Master state, node cards, command panel, telemetry/event summary, raw protocol terminal, safety state and simulation placeholder. Its current mode is offline/mock, and it does not yet connect to a physical ESP32. That is intentional.

The new pre-hardware mock responder produces simulated NODE_00_MASTER JSON lines labeled `PRE_HARDWARE_SIMULATED`. Those lines can be used as expected input for parser tests, dashboard state mapping and future Web Serial behavior.

## 2. Existing dashboard architecture

The dashboard layer currently includes:

- `web/dashboard/index.html`
- `web/dashboard/app.js`
- `web/dashboard/protocol_parser.js`
- `web/dashboard/serial_adapter.js`
- `web/dashboard/README.md`

The parser module reads one line at a time, attempts JSON parsing, validates required fields such as `type` and `source`, and accepts packet types such as `event`, `command`, `response`, `telemetry`, `heartbeat` and `error`.

The serial adapter module prepares a future Web Serial path. It checks for browser support, requests a serial port, opens it at a default baud rate of `115200`, reads newline-delimited data and forwards each complete line to the dashboard.

This means the current mock responder output is already conceptually compatible with the future serial pipeline because it emits line-based JSON objects.

## 3. Integration concept

The intended integration path is:

    mock_node00_master_responder.py
        -> simulated JSONL / raw log
        -> protocol_parser.js expected packet structure
        -> dashboard event/state mapping
        -> future Web Serial adapter input

The future real hardware path is:

    ESP32 NODE_00_MASTER
        -> USB Serial newline-delimited JSON
        -> serial_adapter.js onLine callback
        -> protocol_parser.js
        -> dashboard state mapping
        -> visible UI state / terminal log / safety indicators

The mock path and the hardware path should converge at the same parser boundary.

The goal is not to build two separate dashboards. The goal is to make the dashboard accept a consistent packet shape whether the packet comes from:

- offline mock code;
- simulated JSONL file;
- future Web Serial line;
- future serial bridge;
- real ESP32 output.

## 4. Current simulated packet shape

The pre-hardware mock responder emits packets with fields such as:

- `version`
- `validation_mode`
- `type`
- `source`
- `target`
- `seq`
- `uptime_ms`
- `state`
- `command`
- `status`
- `payload`

The current `protocol_parser.js` requires at least:

- `type`
- `source`

Therefore the simulated packets should be parseable by the dashboard parser as long as each JSON object is passed as one complete line.

## 5. Dashboard state mapping rules

The following mapping should be used by future dashboard tests.

| Packet condition | Dashboard effect |
|---|---|
| `type=event` and payload event contains boot | Add boot event to protocol terminal and mark Master as ready candidate |
| `type=heartbeat` | Update heartbeat indicator and Master state summary |
| `type=response`, `command=PING`, payload message `PONG` | Mark command path as responsive |
| `type=response`, `command=STATUS` | Update Master identity/state panel |
| `type=response`, `command=GET_NODE_TABLE` | Populate or update expected node cards |
| `type=response`, `command=SCAN_NODES` | Update scan status and online node count |
| `type=response`, `command=STOP`, `state=SAFE_MODE` | Update safety panel to safe/stop state |
| `type=response`, `command=RESET`, `state=READY` | Return Master state to ready |
| `type=error` | Add error event and preserve raw packet |
| `validation_mode=PRE_HARDWARE_SIMULATED` | Display simulated/pre-hardware badge if UI support is added later |

## 6. Correct validation interpretation

A successful dashboard parse of simulated output means:

    The dashboard parser and expected-output model can process simulated NODE_00_MASTER packets.

It does not mean:

    The dashboard has connected to a real ESP32.

A successful Web Serial session with real ESP32 output would mean:

    The dashboard received and parsed real NODE_00_MASTER serial output.

It still would not mean:

    The full MicroBot swarm is validated.

## 7. Recommended next implementation steps

The next implementation steps should be small and testable:

1. Add a dashboard test fixture file that points to the simulated JSONL output.
2. Add a local parser test script that feeds simulated JSONL lines into the dashboard parser logic or a mirrored parser.
3. Add a dashboard documentation note explaining how `PRE_HARDWARE_SIMULATED` packets differ from hardware-captured packets.
4. Add a future UI badge for `OFFLINE MOCK`, `PRE_HARDWARE_SIMULATED`, `WEB SERIAL READY` and `WEB SERIAL CONNECTED`.
5. When ESP32 hardware is available, compare real serial output against the expected simulated output.

## 8. Suggested future files

Possible future files:

- `tools/offline/validate_dashboard_mock_output.py`
- `web/dashboard/test_fixtures/pre_hardware_node00_master_sample.jsonl`
- `docs/dashboard_parser_test_report_v0_3.md`
- `docs/dashboard_web_serial_transition_plan_v0_3.md`

## 9. Safety and credibility rule

The dashboard may use simulated data for development, but the UI and documentation must not hide the source of the data.

Any simulated packet should remain traceable as simulated.

Any real hardware packet should be traceable to a real capture session.

This distinction is part of the credibility of MicroBot Labs.
