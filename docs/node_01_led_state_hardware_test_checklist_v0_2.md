# MicroBot Labs — NODE_01_LED_STATE Hardware Test Checklist v0.2

## 1. Purpose

This document defines the hardware test checklist for NODE_01_LED_STATE, the first physical output node of MicroBot Labs v0.2.

NODE_01_LED_STATE is important because it validates the first visible physical behavior of the system.

The Master test proves that an ESP32 can receive commands and return structured responses.

The NODE_01 test proves that a MicroBot node can translate a command into a visible physical state.

The target chain is:

PC or Serial Monitor -> NODE_01_LED_STATE firmware -> LED output -> structured response -> STOP / SAFE_MODE -> RESET

This checklist must be followed before claiming that NODE_01 is physically validated.

## 2. Test Scope

This checklist covers the first standalone NODE_01_LED_STATE hardware validation.

It validates:

| Area | Included |
|---|---|
| ESP32 board connection | yes |
| NODE_01 firmware upload | yes |
| Serial Monitor command input | yes |
| PING response | yes |
| STATUS response | yes |
| ACTIVE state | yes |
| WARNING blink state | yes |
| ERROR blink state | yes |
| STOP / SAFE_MODE state | yes |
| RESET state | yes |
| Visual LED evidence | yes |

It does not yet validate:

| Area | Not Included Yet |
|---|---|
| Master-to-node routing | future |
| Wireless communication | future |
| Real multi-node swarm | future |
| Dashboard Web Serial direct routing | future |
| Physical MicroBot shell integration | future |
| External LED strip or NeoPixel integration | future |
| Sensor telemetry | future |
| Actuator behavior | future |
| Certified safety | not applicable to v0.2 |

## 3. Required Hardware

Minimum hardware:

| Item | Required | Notes |
|---|---|---|
| ESP32 development board | yes | DevKit-style board recommended |
| USB data cable | yes | Must support data, not charge-only |
| Mac / PC | yes | Runs Arduino IDE and Serial Monitor |
| Arduino IDE or Arduino CLI | yes | Used to upload firmware |
| Onboard LED | recommended | Many ESP32 boards use GPIO 2 |
| External LED | optional | Use only with resistor |
| 220-330 ohm resistor | required for external LED | Protects GPIO |
| Breadboard and jumpers | optional | Needed only for external LED |
| Phone/camera | recommended | Used for evidence photo/video |

Minimum first test:

Use the ESP32 onboard LED.

Do not start with external LED wiring unless the onboard LED is unavailable.

## 4. Required Software Files

Main firmware file:

firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino

Supporting repository files:

| File | Purpose |
|---|---|
| firmware/esp32/NODE_01_LED_STATE/README.md | Node usage notes |
| docs/communication_protocol_v0_1.md | Protocol reference |
| docs/hardware_serial_test_checklist_v0_2.md | Master hardware serial reference |
| docs/dashboard_test_checklist_v0_2.md | Dashboard test reference |
| docs/risk_safety_summary_v0_1.md | Safety reference |
| demos/demo_v0_1/ | Evidence folder |

## 5. Safety Pre-Check

Before connecting the board:

| Check | Expected Result | Status |
|---|---|---|
| ESP32 board inspected | No visible damage | To check |
| USB cable checked | Data-capable cable available | To check |
| No external loads connected | First test is onboard LED only | To check |
| No battery connected | USB-only test | To check |
| No motors/coils connected | Avoid unnecessary risk | To check |
| Board on non-conductive surface | Avoid shorts | To check |
| If using external LED, resistor present | 220-330 ohm resistor in series | To check |
| Correct firmware selected | NODE_01_LED_STATE.ino | To check |

Safety rule:

The first NODE_01 test must be low-power, USB-only and visually observable.

Do not connect motors, coils, batteries or external high-current loads.

## 6. Firmware Upload Checklist

Firmware file:

firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino

Upload steps:

| Step | Action | Expected Result | Status |
|---:|---|---|---|
| 1 | Open Arduino IDE | IDE starts correctly | To test |
| 2 | Open NODE_01_LED_STATE.ino | Firmware file loads | To test |
| 3 | Select ESP32 board | Correct board selected | To test |
| 4 | Connect ESP32 by USB | Port appears | To test |
| 5 | Select serial port | Correct ESP32 port selected | To test |
| 6 | Compile / Verify | Build succeeds | To test |
| 7 | Upload | Upload completes | To test |
| 8 | Open Serial Monitor | Monitor opens at 115200 baud | To test |
| 9 | Reset board if needed | Boot message appears | To test |

Expected boot message:

A JSON-like event packet containing:

| Field | Expected |
|---|---|
| version | v0.2.0-baseline |
| type | event |
| source | NODE_01_LED_STATE |
| event | BOOT_COMPLETE |
| state | READY |

## 7. Serial Monitor Settings

Recommended settings:

| Setting | Value |
|---|---|
| Baud rate | 115200 |
| Line ending | Newline or Both NL and CR |
| Input method | Manual commands |
| Test mode | Standalone NODE_01 |

Test commands should be typed one at a time.

Wait for each response before sending the next command.

## 8. Command Test Sequence

Use this sequence in Serial Monitor.

| Step | Command | Expected Serial Response | Expected Physical LED Behavior | Status |
|---:|---|---|---|---|
| 1 | PING | PONG-like response | No required LED change | To test |
| 2 | STATUS | NODE_01 status response | LED remains ready/idle | To test |
| 3 | ACTIVE | State becomes ACTIVE | LED turns on | To test |
| 4 | STATUS | State reports ACTIVE | LED remains on | To test |
| 5 | WARNING | State becomes WARNING | LED blinks slowly | To test |
| 6 | STATUS | State reports WARNING | Slow blink continues | To test |
| 7 | ERROR | State becomes ERROR | LED blinks quickly | To test |
| 8 | STATUS | State reports ERROR | Fast blink continues | To test |
| 9 | STOP | State becomes SAFE_MODE | LED enters safe-mode blink | To test |
| 10 | STATUS | State reports SAFE_MODE | Safe-mode blink continues | To test |
| 11 | RESET | State becomes READY | LED returns idle/off | To test |
| 12 | STATUS | State reports READY | LED remains idle/off | To test |

The first PASS condition is:

ACTIVE command produces a structured response and a visible LED state change.

## 9. Expected Response Patterns

PING response should include:

| Field | Expected |
|---|---|
| version | v0.2.0-baseline |
| type | response |
| source | NODE_01_LED_STATE |
| command | PING |
| status | OK |
| payload.message | PONG |

STATUS response should include:

| Field | Expected |
|---|---|
| source | NODE_01_LED_STATE |
| command | STATUS |
| status | OK |
| state | READY, ACTIVE, WARNING, ERROR or SAFE_MODE |
| payload.role | LED_STATE_NODE |
| payload.led_pin | LED pin number |

ACTIVE response should include:

| Field | Expected |
|---|---|
| command | ACTIVE, SET_LED or SET_STATE |
| status | OK |
| state | ACTIVE |
| physical behavior | LED on |

WARNING response should include:

| Field | Expected |
|---|---|
| command | WARNING |
| status | OK |
| state | WARNING |
| physical behavior | slow blink |

ERROR response should include:

| Field | Expected |
|---|---|
| command | ERROR |
| status | OK |
| state | ERROR |
| physical behavior | fast blink |

STOP response should include:

| Field | Expected |
|---|---|
| command | STOP |
| status | OK |
| state | SAFE_MODE |
| physical behavior | safe-mode blink |

RESET response should include:

| Field | Expected |
|---|---|
| command | RESET |
| status | OK |
| state | READY |
| physical behavior | LED idle/off |

## 10. LED Pin Troubleshooting

Many ESP32 development boards use GPIO 2 as onboard LED.

Some boards use another pin or do not expose an onboard LED.

Current firmware behavior:

| Definition | Meaning |
|---|---|
| LED_BUILTIN | Used if board defines it |
| fallback GPIO 2 | Used if LED_BUILTIN is not defined |

If the firmware responds correctly but the LED does not light:

| Possible Cause | Fix |
|---|---|
| Board has no onboard LED | Use external LED with resistor |
| LED pin differs | Change LED_PIN in firmware |
| LED polarity is inverted | Test HIGH/LOW behavior |
| Wrong board selected | Select correct board in Arduino IDE |
| Upload went to wrong port | Recheck port |
| Cable issue | Try another USB data cable |

External LED wiring:

| Component | Connection |
|---|---|
| ESP32 GPIO 2 or selected LED pin | resistor |
| resistor | LED anode |
| LED cathode | GND |

Never connect an LED directly to GPIO without a resistor.

## 11. Evidence Capture

After a successful NODE_01 test, capture evidence.

Required or recommended evidence:

| Evidence | Suggested File |
|---|---|
| Serial Monitor screenshot | demos/demo_v0_1/screenshots/node_01_led_state_serial_monitor_v0_2.png |
| LED active photo | demos/demo_v0_1/photos/node_01_led_active_v0_2.jpg |
| LED warning photo/video | demos/demo_v0_1/photos/node_01_led_warning_v0_2.jpg |
| Serial log copy | demos/demo_v0_1/logs/node_01_led_state_test_log_v0_2.txt |
| Test report | demos/demo_v0_1/notes/node_01_led_state_hardware_test_report_v0_2.md |

Suggested screenshot command on macOS:

screencapture -i demos/demo_v0_1/screenshots/node_01_led_state_serial_monitor_v0_2.png

Suggested public wording:

This evidence shows NODE_01_LED_STATE running on ESP32 and responding to serial commands with visible LED state changes.

## 12. PASS Criteria

The NODE_01 hardware test passes if:

| Criterion | Required |
|---|---|
| Firmware compiles | yes |
| Firmware uploads | yes |
| Boot message appears | yes |
| PING returns PONG | yes |
| STATUS returns structured state | yes |
| ACTIVE turns LED on | yes |
| WARNING produces slow blink | yes |
| ERROR produces fast blink | yes |
| STOP enters SAFE_MODE | yes |
| RESET returns READY | yes |
| Board does not overheat | yes |
| Evidence is saved | recommended |

## 13. FAIL Conditions

The test fails if:

| Failure | Meaning |
|---|---|
| Firmware does not compile | Code or board configuration issue |
| Upload fails | Cable, board, port or boot mode issue |
| No serial response | Serial configuration or firmware issue |
| PING fails | Command parser issue |
| STATUS malformed | Protocol output issue |
| LED never changes | Pin, board or wiring issue |
| STOP does not change state | Safety behavior issue |
| Board overheats | Stop immediately |
| External LED has no resistor | Unsafe wiring, do not continue |

If the test fails, record the failure instead of forcing the test.

A documented failure is still useful engineering evidence.

## 14. Correct Public Description

Correct wording before test:

NODE_01_LED_STATE firmware is prepared but not yet physically validated.

Correct wording after successful test:

NODE_01_LED_STATE has been uploaded to an ESP32 and responds to serial commands with visible LED state changes.

Correct wording after dashboard integration:

The PC Controller Dashboard can send or represent NODE_01 state transitions and display the corresponding protocol state.

Incorrect wording:

All MicroBot physical nodes are working.

Incorrect wording:

The full MicroBot swarm is validated.

Incorrect wording:

The system is ready for autonomous operation.

## 15. Relationship With Master Test

NODE_00_MASTER and NODE_01_LED_STATE are separate first tests.

| Test | Meaning |
|---|---|
| NODE_00_MASTER test | Validates Master command/response and safety state |
| NODE_01_LED_STATE test | Validates first physical visible node behavior |
| Future Master-to-node test | Validates routing or coordination between Master and node |
| Future dashboard test | Validates PC Controller to hardware UI path |

This file covers NODE_01 standalone behavior only.

It does not prove Master-to-node routing.

## 16. Future Master-to-Node Integration

After the standalone Master and NODE_01 tests pass, the next goal is:

PC Controller -> NODE_00_MASTER -> NODE_01_LED_STATE -> LED output -> telemetry/log -> dashboard update

Possible future files:

| Future File | Purpose |
|---|---|
| docs/master_to_node_integration_checklist_v0_3.md | First Master-to-NODE_01 integration checklist |
| firmware/esp32/NODE_00_MASTER/node_router.h | Routing abstraction |
| firmware/esp32/NODE_00_MASTER/node_table.h | Node table abstraction |
| web/dashboard/hardware_node_mapping.js | Map real packets to node cards |
| demos/demo_v0_1/logs/master_to_node_01_test_log_v0_3.jsonl | Future integration evidence |

## 17. Current Validation Status

| Layer | Status |
|---|---|
| Documentation baseline | complete for v0.1.0 |
| Offline Protocol Lab | working |
| PC Controller Dashboard mock | working |
| Dashboard mock screenshot | added |
| Dashboard mock structured log | added |
| Web Serial preparation | added |
| NODE_00_MASTER firmware skeleton | added |
| NODE_00_MASTER hardware test checklist | added |
| NODE_01_LED_STATE firmware skeleton | added |
| NODE_01_LED_STATE hardware checklist | this file |
| NODE_01 real LED output | not yet tested |

## 18. Version Notes

Version: v0.2  
Repository: microbot-labs  
Document role: NODE_01 LED State hardware test checklist  
Main scope: ESP32 LED node firmware upload, serial commands, visible LED behavior, STOP/RESET behavior and evidence planning  
Hardware required: yes  
ESP32 required: yes
