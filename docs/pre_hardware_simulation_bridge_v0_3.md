# MicroBot Labs — Pre-Hardware Simulation Bridge v0.3

Status: pre-hardware simulated validation  
Created: 2026-05-16  
Hardware validation status: not hardware-validated  
Related firmware target: `firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino`  
Related real capture tool: `tools/serial/capture_node00_master_validation.py`

## 1. Purpose

This document defines what MicroBot Labs should do when no physical ESP32 hardware is available yet.

The correct answer is not to stop the project, and it is not to invent fake hardware evidence. The correct answer is to build a pre-hardware simulation bridge that reproduces the expected behavior of the NODE_00_MASTER firmware in a clearly labeled simulated environment.

The goal is to prepare the protocol, command sequence, expected responses, log structure and report structure before the first real ESP32 board is available.

The simulated chain is:

    PC -> Python mock responder -> simulated NODE_00_MASTER response -> simulated log -> simulated report

The future real chain remains:

    PC -> USB Serial -> ESP32 NODE_00_MASTER -> structured response -> hardware log -> hardware report

## 2. Why this exists

MicroBot Labs already has a v0.3 hardware-ready validation pack for NODE_00_MASTER. That pack prepares the real ESP32 test but cannot be completed without hardware.

The pre-hardware simulation bridge fills the gap. It allows development to continue honestly by testing the command sequence and report workflow without pretending that a physical board has been used.

## 3. Strict maturity language

The output of this bridge must always be labeled as:

    PRE_HARDWARE_SIMULATED

It must never be labeled as:

    HARDWARE_VALIDATED

A simulated PASS means that the expected NODE_00_MASTER behavior model responded correctly. It does not mean that an ESP32 board has been flashed, connected or tested.

## 4. Commands simulated

The mock responder simulates the same command family expected from NODE_00_MASTER:

- `PING`
- `STATUS`
- `GET_NODE_TABLE`
- `SCAN_NODES`
- `STOP`
- `EMERGENCY_STOP`
- `RESET`

The default simulation sequence is:

1. boot event;
2. heartbeat output;
3. `PING`;
4. `STATUS`;
5. `GET_NODE_TABLE`;
6. `SCAN_NODES`;
7. `STOP`;
8. `STATUS`;
9. `RESET`;
10. `STATUS`.

## 5. What this validates

This validates:

- command names;
- expected command sequence;
- JSON response structure;
- status transitions;
- SAFE_MODE behavior after STOP;
- READY behavior after RESET;
- log generation;
- report generation;
- future comparison baseline for real hardware output.

## 6. What this does not validate

This does not validate:

- ESP32 upload;
- USB serial communication;
- board reset behavior;
- real timing;
- real boot output;
- real serial driver behavior;
- electrical safety;
- node-to-node communication;
- wireless communication;
- sensors;
- actuators;
- battery behavior;
- magnetic docking;
- full MicroBot swarm behavior.

## 7. How to run

Run:

    python3 tools/offline/mock_node00_master_responder.py

The script creates:

- a simulated raw log under `demos/demo_v0_3/pre_hardware_mock_node00_master/logs/`;
- a simulated JSONL log under `demos/demo_v0_3/pre_hardware_mock_node00_master/logs/`;
- a simulated report under `demos/demo_v0_3/pre_hardware_mock_node00_master/reports/`;
- expected-output examples under `demos/demo_v0_3/pre_hardware_mock_node00_master/expected_outputs/`.

## 8. How to use the result

The simulated report can be committed as pre-hardware evidence. It should help define the expected behavior before the ESP32 arrives.

When the ESP32 is available, the real capture script should be run:

    python3 tools/serial/capture_node00_master_validation.py --port /dev/cu.usbserial-XXXX

Then the simulated report and the real hardware report can be compared.

## 9. Correct interpretation

The pre-hardware simulation bridge is a preparation layer.

It keeps the project moving while protecting the credibility of the repository. It is useful exactly because it does not lie about hardware status.
