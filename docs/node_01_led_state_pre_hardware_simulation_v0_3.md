# MicroBot Labs — NODE_01_LED_STATE Pre-Hardware Simulation v0.3

Status: pre-hardware simulated validation  
Created: 2026-05-16  
Hardware validation status: not hardware-validated  
Related firmware target: `firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino`  
Related future evidence folder: `demos/demo_v0_3/pre_hardware_mock_node01_led_state/`

## 1. Purpose

This document defines the pre-hardware simulation workflow for `NODE_01_LED_STATE`, the first visible output node in MicroBot Labs.

The real firmware target uses an ESP32 onboard LED as a visible MicroBot state indicator. It supports command/response behavior for `PING`, `STATUS`, `SET_LED`, `SET_STATE`, `ACTIVE`, `IDLE`, `WARNING`, `ERROR`, `STOP` and `RESET`.

Because physical hardware is not available yet, this simulation reproduces the expected command/state behavior without pretending that a real ESP32 or LED has been tested.

The simulated chain is:

    PC -> Python NODE_01 mock responder -> simulated LED state -> simulated log -> simulated report

The future real chain remains:

    PC or Master -> ESP32 NODE_01_LED_STATE -> onboard LED state -> serial response -> hardware log/report/photo evidence

## 2. Why this matters

NODE_00_MASTER prepares the command and coordination layer.

NODE_01_LED_STATE prepares the first physical observable output layer.

Even before hardware arrives, it is useful to define expected state transitions:

- READY;
- IDLE;
- ACTIVE;
- WARNING;
- ERROR;
- SAFE_MODE.

The simulation makes those transitions explicit and creates expected-output evidence for future comparison with a real ESP32 LED node.

## 3. Strict maturity language

The output of this simulation must always be labeled as:

    PRE_HARDWARE_SIMULATED

It must never be described as:

    HARDWARE_VALIDATED

A simulated PASS means the expected NODE_01 behavior model responded correctly. It does not mean an ESP32 board, GPIO pin or LED was tested.

## 4. Commands simulated

The mock responder simulates:

- `PING`
- `STATUS`
- `ACTIVE`
- `IDLE`
- `WARNING`
- `ERROR`
- `SET_LED ACTIVE`
- `SET_STATE ACTIVE`
- `STOP`
- `RESET`

The default validation sequence is:

1. boot event;
2. heartbeat/status output;
3. `PING`;
4. `STATUS`;
5. `ACTIVE`;
6. `STATUS`;
7. `WARNING`;
8. `ERROR`;
9. `IDLE`;
10. `SET_LED ACTIVE`;
11. `STOP`;
12. `STATUS`;
13. `RESET`;
14. `STATUS`.

## 5. Simulated LED model

The simulation records a virtual LED model.

| Node state | Virtual LED behavior |
|---|---|
| READY | OFF |
| IDLE | OFF |
| ACTIVE | ON |
| WARNING | BLINK_SLOW |
| ERROR | BLINK_FAST |
| SAFE_MODE | BLINK_SAFETY |

This model mirrors the intent of the firmware without requiring a real GPIO pin.

## 6. What this validates

This validates:

- expected NODE_01 command vocabulary;
- expected state transitions;
- expected JSON response shape;
- virtual LED behavior mapping;
- safety transition to SAFE_MODE;
- reset transition to READY;
- report generation;
- future comparison baseline for real LED hardware testing.

## 7. What this does not validate

This does not validate:

- ESP32 upload;
- real onboard LED pin;
- real GPIO output;
- real LED brightness;
- real timing;
- electrical safety;
- breadboard wiring;
- current limiting resistor;
- physical LED state;
- camera/photo evidence;
- Master-to-node physical communication.

## 8. How to run

From the repository root:

    python3 tools/offline/mock_node01_led_state_responder.py

The script creates:

- a simulated raw log under `demos/demo_v0_3/pre_hardware_mock_node01_led_state/logs/`;
- a simulated JSONL log under `demos/demo_v0_3/pre_hardware_mock_node01_led_state/logs/`;
- a simulated report under `demos/demo_v0_3/pre_hardware_mock_node01_led_state/reports/`;
- expected-output examples under `demos/demo_v0_3/pre_hardware_mock_node01_led_state/expected_outputs/`.

## 9. Correct interpretation

A PASS result proves that the pre-hardware software model for NODE_01_LED_STATE behaves according to the expected state map.

It does not prove that a real LED changed state.

The first real NODE_01 hardware claim will require:

1. ESP32 or compatible board available.
2. Firmware uploaded.
3. Correct LED pin confirmed.
4. Serial command sent.
5. Visible LED state observed.
6. Log/report/photo or video evidence saved.
7. Evidence reviewed and committed.
