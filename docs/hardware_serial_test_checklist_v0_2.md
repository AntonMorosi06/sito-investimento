# MicroBot Labs — Hardware Serial Test Checklist v0.2

## 1. Purpose

This document defines the first hardware serial test checklist for MicroBot Labs v0.2.

The goal is to prepare the transition from offline/mock dashboard validation to real ESP32 communication.

The current repository already validates the software side of the system through:

- Offline Protocol Lab.
- PC Controller Dashboard.
- Dashboard mock command flow.
- Protocol-style logs.
- Simulation placeholder.
- Screenshot evidence.
- Structured mock test log.

The next validation step is hardware-based:

PC Controller -> USB Serial -> NODE_00_MASTER ESP32 -> PING/PONG -> STATUS -> STOP -> RESET

This checklist is written before hardware testing so that the first physical test is controlled, repeatable and safe.

## 2. Test Scope

This checklist covers the first real ESP32 serial test.

It validates:

| Area | Included |
|---|---|
| ESP32 connection | yes |
| NODE_00_MASTER firmware upload | yes |
| USB Serial communication | yes |
| PING command | yes |
| STATUS command | yes |
| GET_NODE_TABLE command | yes |
| STOP command | yes |
| RESET command | yes |
| Basic dashboard readiness | yes |
| Screenshot/log evidence | yes |

It does not yet validate:

| Area | Not Included Yet |
|---|---|
| Real NODE_01 physical LED response | not in first Master-only test |
| Real sensor telemetry | future |
| Real actuator movement | future |
| Real magnetic docking | future |
| Real camera/vision module | future |
| Wireless communication | future |
| Battery-powered operation | future |
| Certified safety | not applicable to v0.2 |

## 3. Hardware Required

Minimum required hardware:

| Item | Required | Notes |
|---|---|---|
| ESP32 development board | yes | DevKit-style board recommended |
| USB data cable | yes | Must support data, not charge-only |
| Mac / PC | yes | Runs Arduino IDE, browser dashboard and terminal |
| Arduino IDE or Arduino CLI | yes | Used to upload firmware |
| MicroBot repository | yes | Local folder: ~/microbot-labs |

Optional hardware:

| Item | Purpose |
|---|---|
| LED on breadboard | Future NODE_01 test |
| 220-330 ohm resistor | LED protection |
| Breadboard and jumpers | Future node tests |
| Multimeter | Electrical checks |
| Phone/camera | Evidence photos |
| Power bank | Later power tests, not required for first USB serial test |

## 4. Software Required

Required local files:

| File | Purpose |
|---|---|
| firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino | ESP32 Master firmware |
| web/dashboard/index.html | PC Controller Dashboard |
| web/dashboard/protocol_parser.js | Packet parsing |
| web/dashboard/serial_adapter.js | Web Serial preparation |
| docs/communication_protocol_v0_1.md | Protocol reference |
| docs/risk_safety_summary_v0_1.md | Safety reference |
| docs/dashboard_test_checklist_v0_2.md | Dashboard mock reference |

Optional files:

| File | Purpose |
|---|---|
| tools/serial/microbot_serial_ping_status.py | Python serial test tool, only if Python/pyserial works |
| demos/demo_v0_1/logs/ | Evidence logs |
| demos/demo_v0_1/screenshots/ | Evidence screenshots |
| demos/demo_v0_1/notes/ | Test reports |

Because the user's current Python 3.14 environment may have a pip/pyexpat issue, the first hardware test should not depend on Python. Arduino Serial Monitor or the browser dashboard should be enough.

## 5. Safety Pre-Check

Before connecting the ESP32:

| Check | Expected Result | Status |
|---|---|---|
| Board visually inspected | No bent pins, burn marks or obvious damage | To check |
| USB cable checked | Data-capable cable available | To check |
| Board placed safely | On non-conductive surface | To check |
| No loose metal nearby | Avoid shorts | To check |
| No external power connected | First test uses USB only | To check |
| No motors/coils connected | Master-only test first | To check |
| No battery connected | USB-only first | To check |
| Laptop battery/power stable | Avoid interruption during upload | To check |

Rule:

The first hardware test must be USB-only and Master-only.

Do not attach motors, coils, batteries or external loads during the first Master serial validation.

## 6. Firmware Upload Checklist

Firmware file:

firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino

Upload steps:

| Step | Action | Expected Result | Status |
|---:|---|---|---|
| 1 | Open Arduino IDE | IDE starts correctly | To test |
| 2 | Open NODE_00_MASTER.ino | Firmware file loads | To test |
| 3 | Select ESP32 board | Correct board selected | To test |
| 4 | Connect ESP32 by USB | Port appears in Arduino IDE | To test |
| 5 | Select serial port | Correct ESP32 port selected | To test |
| 6 | Compile / Verify | Build succeeds | To test |
| 7 | Upload | Upload completes | To test |
| 8 | Open Serial Monitor | Monitor opens at 115200 baud | To test |
| 9 | Reset board if needed | Boot message appears | To test |

Expected boot message:

A JSON-like event packet containing:

- version
- type: event
- source: NODE_00_MASTER
- event: BOOT_COMPLETE
- state: READY

## 7. Serial Monitor Test

Serial baud rate:

115200

Line ending:

Newline or Both NL and CR is recommended if needed.

Test commands:

| Step | Command | Expected Response | Status |
|---:|---|---|---|
| 1 | PING | Response with message PONG | To test |
| 2 | STATUS | Response with NODE_00_MASTER state | To test |
| 3 | GET_NODE_TABLE | Expected node list appears | To test |
| 4 | SCAN_NODES | Placeholder scan response appears | To test |
| 5 | STOP | Master enters SAFE_MODE | To test |
| 6 | STATUS | State shows SAFE_MODE | To test |
| 7 | RESET | Master returns READY | To test |
| 8 | STATUS | State shows READY | To test |
| 9 | EMERGENCY_STOP | Master enters EMERGENCY | To test |
| 10 | RESET | Master returns READY | To test |

The first PASS condition is:

PING returns a structured PONG response from the real ESP32.

## 8. Expected Response Patterns

PING response should include:

| Field | Expected |
|---|---|
| version | v0.2.0-baseline |
| type | response |
| source | NODE_00_MASTER |
| target | PC_CONTROLLER |
| command | PING |
| status | OK |
| payload.message | PONG |

STATUS response should include:

| Field | Expected |
|---|---|
| source | NODE_00_MASTER |
| command | STATUS |
| status | OK |
| state | READY, SAFE_MODE or EMERGENCY depending on test |
| payload.role | ESP32_MASTER |
| payload.known_nodes | 6 |

STOP response should include:

| Field | Expected |
|---|---|
| command | STOP |
| status | OK |
| state | SAFE_MODE |
| payload.safe | true |

EMERGENCY_STOP response should include:

| Field | Expected |
|---|---|
| command | EMERGENCY_STOP |
| status | OK |
| state | EMERGENCY |
| payload.safe | true |

RESET response should include:

| Field | Expected |
|---|---|
| command | RESET |
| status | OK |
| state | READY |
| payload.message | Master reset to READY |

## 9. Browser Dashboard Hardware Test

After Serial Monitor works, the dashboard can be tested.

Open:

web/dashboard/index.html

Hardware test steps:

| Step | Action | Expected Result | Status |
|---:|---|---|---|
| 1 | Open dashboard | Dashboard loads | To test |
| 2 | Confirm mode before serial | OFFLINE MOCK or local dashboard state visible | To test |
| 3 | Press Web Serial Hardware Only | Browser asks for serial port | To test |
| 4 | Select ESP32 port | Dashboard connects | To test |
| 5 | Confirm mode | WEB SERIAL CONNECTED | To test |
| 6 | Press PING | Real response appears in terminal | To test |
| 7 | Press STATUS | Real status appears in terminal | To test |
| 8 | Press STOP | Dashboard receives safe response | To test |
| 9 | Press RESET | Dashboard receives ready response | To test |

Important:

Only describe this as hardware-connected if the dashboard actually reaches WEB SERIAL CONNECTED and receives real packets from the ESP32.

## 10. Port Selection Rules

When the browser or Arduino IDE asks for a serial port, choose the ESP32 USB serial device.

Likely macOS names:

| Port Pattern | Meaning |
|---|---|
| /dev/cu.usbserial-* | Common USB serial adapter |
| /dev/cu.SLAB_USBtoUART | Silicon Labs adapter |
| /dev/cu.wchusbserial-* | CH340/CH9102 adapter |
| /dev/cu.usbmodem* | Native USB serial device |

Do not choose:

| Port | Reason |
|---|---|
| Bluetooth-Incoming-Port | Not ESP32 |
| AirPods or audio devices | Not serial hardware |
| iPhone/iPad service ports | Not ESP32 |
| Unknown unrelated ports | Avoid wrong device |

If unsure, unplug the ESP32, list ports, plug it back in, and see what changed.

## 11. Evidence Capture

After the first successful hardware test, capture evidence.

Required evidence:

| Evidence | Suggested File |
|---|---|
| Serial Monitor screenshot | demos/demo_v0_1/screenshots/node_00_master_serial_monitor_v0_2.png |
| Dashboard hardware screenshot | demos/demo_v0_1/screenshots/dashboard_web_serial_connected_v0_2.png |
| Serial log copy | demos/demo_v0_1/logs/node_00_master_ping_status_log_v0_2.txt |
| Hardware test report | demos/demo_v0_1/notes/node_00_master_hardware_serial_test_report_v0_2.md |
| ESP32 photo | demos/demo_v0_1/photos/node_00_master_esp32_v0_2.jpg |

Suggested screenshot command on macOS:

screencapture -i demos/demo_v0_1/screenshots/node_00_master_serial_monitor_v0_2.png

## 12. Hardware PASS Criteria

The hardware serial test passes if:

| Criterion | Required |
|---|---|
| Firmware compiles | yes |
| Firmware uploads | yes |
| Serial Monitor opens | yes |
| Boot message appears | yes |
| PING returns PONG | yes |
| STATUS returns structured state | yes |
| STOP enters SAFE_MODE | yes |
| RESET returns READY | yes |
| No uncontrolled hardware behavior | yes |
| Evidence is saved | recommended |

The browser dashboard hardware test passes if:

| Criterion | Required |
|---|---|
| Browser can open serial port | yes |
| Dashboard reaches WEB SERIAL CONNECTED | yes |
| Real PING response appears | yes |
| Real STATUS response appears | yes |
| Real STOP/RESET response appears | yes |
| Screenshot/log evidence saved | recommended |

## 13. Hardware FAIL Conditions

The test fails if:

| Failure | Meaning |
|---|---|
| Firmware does not compile | Fix code or board configuration |
| Upload fails | Check board, cable, port and boot mode |
| No serial port appears | Cable or driver issue |
| Boot message missing | Board may not be running firmware |
| PING gives no response | Serial input or firmware parser issue |
| STATUS malformed | Protocol output issue |
| STOP does not change state | Safety behavior issue |
| Dashboard claims hardware connected without receiving packets | UI/state issue |
| Board overheats | Stop immediately |

If hardware fails, do not force the test. Record the failure and fix one problem at a time.

## 14. Correct Public Description

Correct wording before hardware test:

The dashboard and protocol are currently validated in offline/mock mode. Hardware serial validation is prepared but not yet completed.

Correct wording after successful Serial Monitor test:

NODE_00_MASTER firmware has been uploaded to an ESP32 and responds to PING, STATUS, STOP and RESET through USB Serial.

Correct wording after successful dashboard Web Serial test:

The PC Controller Dashboard can connect to the ESP32 Master through Web Serial and display real protocol responses.

Incorrect wording:

The full MicroBot swarm is working.

Incorrect wording:

All six physical nodes are validated.

Incorrect wording:

The system is certified safe.

## 15. Relationship With Existing Mock Evidence

The existing mock evidence remains useful.

| Evidence | Role |
|---|---|
| Offline Protocol Lab screenshot | Validates protocol/dashboard concept without hardware |
| PC Controller Dashboard screenshot | Validates dashboard UI in mock mode |
| Dashboard mock structured log | Validates expected command sequence |
| Hardware serial checklist | Prepares physical validation |

Mock evidence is not replaced by hardware evidence.

Hardware evidence extends it.

## 16. Future NODE_01 Hardware Test

After NODE_00_MASTER works, the next hardware target is:

NODE_01_LED_STATE

Future test chain:

PC or Serial Monitor -> NODE_01_LED_STATE -> LED state change -> structured response -> STOP / RESET

Future expected commands:

| Command | Expected Physical Result |
|---|---|
| PING | PONG response |
| STATUS | NODE_01 state response |
| ACTIVE | LED turns on |
| WARNING | LED slow blink |
| ERROR | LED fast blink |
| STOP | SAFE_MODE blink |
| RESET | LED returns ready/idle |

That test should be documented in a separate file later.

Suggested future file:

docs/node_01_led_state_hardware_test_checklist_v0_2.md

## 17. Current Validation Status

| Layer | Status |
|---|---|
| Documentation baseline | complete for v0.1.0 |
| Offline Protocol Lab | working |
| PC Controller Dashboard mock | working |
| Dashboard screenshot evidence | added |
| Dashboard mock structured log | added |
| Web Serial preparation | added |
| NODE_00_MASTER firmware skeleton | added |
| NODE_00_MASTER real upload | not yet tested |
| Real PING/PONG from ESP32 | not yet tested |
| NODE_01 real LED output | not yet tested |

## 18. Version Notes

Version: v0.2  
Repository: microbot-labs  
Document role: hardware serial test checklist  
Main scope: ESP32 Master upload, USB Serial PING/STATUS/STOP/RESET test, dashboard Web Serial preparation and hardware evidence planning  
Hardware required: yes  
ESP32 required: yes
