# MicroBot Labs — Implementation Plan v0.2.0

## 1. Purpose

This document defines the first implementation plan after the v0.1.0 documentation baseline.

The objective of v0.2.0 is to validate the first live operational chain:

PC Controller -> ESP32 Master -> NODE_01_LED_STATE -> serial response -> dashboard/log -> simulation state update -> STOP / SAFE_MODE

## 2. Scope

v0.2.0 focuses on a small and real target.

It does not attempt to build the full swarm, the full dashboard, the full simulation engine, the full MicroBot OS, the micro-drone branch, or the complete GLB asset library.

It focuses on the first bridge between documentation and working code.

## 3. Implementation Targets

| Target | Output |
|---|---|
| NODE_00_MASTER firmware | ESP32 Master responds to PING, STATUS, STOP and node-table commands |
| NODE_01_LED_STATE firmware | ESP32 LED node changes visible state |
| Serial test tool | Python script sends commands and prints responses |
| Dashboard preparation | Future Web Serial/local bridge integration |
| Simulation preparation | Future NODE_01 state mapping |
| Evidence package | Screenshot, photo and serial log in later step |

## 4. Current Files Added

| File | Purpose |
|---|---|
| firmware/README.md | Firmware folder overview |
| firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino | ESP32 Master firmware skeleton |
| firmware/esp32/NODE_00_MASTER/README.md | Master firmware usage notes |
| firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino | LED State node firmware skeleton |
| firmware/esp32/NODE_01_LED_STATE/README.md | NODE_01 usage notes |
| tools/serial/microbot_serial_ping_status.py | Python serial command tester |
| tools/serial/README.md | Serial tools usage notes |

## 5. Test Sequence

1. Upload NODE_00_MASTER firmware to ESP32.
2. Open serial monitor at 115200 baud.
3. Send PING.
4. Confirm PONG response.
5. Send STATUS.
6. Confirm READY state.
7. Send GET_NODE_TABLE.
8. Confirm expected nodes are listed.
9. Send STOP.
10. Confirm SAFE_MODE.
11. Send RESET.
12. Confirm READY.

Then repeat with NODE_01_LED_STATE firmware:

1. Upload NODE_01 firmware to ESP32.
2. Send PING.
3. Send STATUS.
4. Send ACTIVE.
5. Confirm LED turns on.
6. Send WARNING.
7. Confirm slow blink.
8. Send ERROR.
9. Confirm fast blink.
10. Send STOP.
11. Confirm SAFE_MODE blink.
12. Send RESET.
13. Confirm READY.

## 6. Acceptance Criteria

| Criterion | Required Result |
|---|---|
| Master compiles | NODE_00_MASTER firmware builds in Arduino IDE |
| Master responds | PING and STATUS return structured messages |
| Node compiles | NODE_01_LED_STATE firmware builds in Arduino IDE |
| Node output works | LED changes state |
| STOP works | Master or node enters safe state |
| Serial tool works | Python script can send commands and print responses |
| GitHub remains clean | No temporary scripts or private files committed |

## 7. Next Step After v0.2.0

The next step after this implementation baseline is:

v0.3.0 — Dashboard Serial Connection and NODE_01 Visualization

Expected v0.3.0 scope:

- Basic static dashboard.
- Connect/disconnect control.
- PING/STATUS buttons.
- Raw terminal panel.
- Parsed event log.
- NODE_01 card.
- Simulation placeholder updating from NODE_01 state.
