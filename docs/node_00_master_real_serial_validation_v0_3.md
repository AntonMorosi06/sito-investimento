# MicroBot Labs — NODE_00_MASTER Real Serial Validation Plan v0.3

Status: hardware-ready validation plan  
Created: 2026-05-16  
Target firmware: `firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino`  
Target board: ESP32 DevKit or compatible ESP32 development board  
Hardware validation status: not yet hardware-validated

## 1. Purpose

This document defines the first real hardware validation step for MicroBot Labs v0.3.

The objective is deliberately narrow: validate the first real communication chain between the PC and the ESP32 Master node.

The chain under test is:

    PC -> USB Serial -> ESP32 NODE_00_MASTER -> structured response -> local log -> validation report

This is not a full MicroBot swarm validation. It does not validate wireless networking, node-to-node communication, sensors, batteries, magnetic docking, movement, camera input, real simulation synchronization, or programmable matter. It validates the first real hardware boundary: a command leaves the PC, reaches an ESP32 running the Master firmware, and produces structured serial output.

## 2. Why this test matters

MicroBot Labs has already reached a strong offline and mock validation baseline. The dashboard, protocol mock, firmware skeleton, serial testing tool, checklists, repository audit and v0.3 canonical map are in place.

The next meaningful step is not to add more speculative documentation, but to capture evidence from the first real ESP32 board.

A successful NODE_00_MASTER serial validation proves that the project has crossed from pure software or browser mock behavior into the first hardware-observed command and response loop.

## 3. Firmware behavior expected

The Master firmware should emit a boot event after reset and should respond to the following commands:

- `PING`
- `STATUS`
- `GET_NODE_TABLE`
- `SCAN_NODES`
- `STOP`
- `EMERGENCY_STOP`
- `RESET`

Expected behavior:

- `PING` returns a structured response containing `PONG`.
- `STATUS` returns node identity, role, protocol and known-node information.
- `GET_NODE_TABLE` returns the six expected prototype node IDs.
- `SCAN_NODES` returns a placeholder scan result.
- `STOP` moves the Master into `SAFE_MODE`.
- `EMERGENCY_STOP` moves the Master into `EMERGENCY`.
- `RESET` returns the Master to `READY`.

## 4. Required hardware

Minimum hardware required:

- ESP32 DevKit or compatible ESP32 development board.
- USB data cable, not a charge-only cable.
- Computer with Python 3.
- Serial driver if required by the specific ESP32 board.
- Arduino IDE or another uploader capable of flashing the `.ino` file.

No sensors, batteries, motors, coils, magnets, ESP-NOW nodes or external power systems are required for this test.

## 5. Required software

Install pyserial:

    python3 -m pip install pyserial

List available ports:

    python3 tools/serial/capture_node00_master_validation.py --list

Run validation after uploading the firmware:

    python3 tools/serial/capture_node00_master_validation.py --port /dev/cu.usbserial-XXXX

On macOS the port is usually similar to:

- `/dev/cu.usbserial-XXXX`
- `/dev/cu.usbmodemXXXX`
- `/dev/cu.SLAB_USBtoUART`
- `/dev/cu.wchusbserialXXXX`

## 6. Upload workflow

1. Open Arduino IDE.
2. Open the firmware file:

       firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino

3. Select the correct ESP32 board.
4. Select the correct serial port.
5. Upload the firmware.
6. Keep the board connected.
7. Return to the terminal.
8. Run the serial validation script.

## 7. Acceptance criteria

The NODE_00_MASTER serial validation may be marked as hardware-validated only when all of the following are true:

1. The firmware has been uploaded to a real ESP32 board.
2. The board appears as a serial port on the computer.
3. The capture script opens the serial port at 115200 baud.
4. The board emits at least one boot, event, heartbeat or response message.
5. `PING` produces a response containing `PONG`.
6. `STATUS` produces a structured response containing `NODE_00_MASTER`.
7. `STOP` produces a safe-mode response.
8. `RESET` returns the Master to `READY`.
9. The raw log is saved under `demos/demo_v0_3/node_00_master_serial/logs/`.
10. The generated report is saved under `demos/demo_v0_3/node_00_master_serial/reports/`.
11. The log and report are reviewed before being committed as hardware evidence.

## 8. Evidence policy

Before this test is run on real hardware, this folder is hardware-ready only.

After the test is run, the evidence must be committed with precise wording. The correct claim is:

    NODE_00_MASTER serial PING/STATUS validated on real ESP32 hardware.

The incorrect claims to avoid are:

- MicroBot swarm validated.
- Six nodes validated.
- Wireless swarm validated.
- Magnetic docking validated.
- Programmable matter validated.
- Full MicroBot hardware complete.

## 9. Failure handling

If the script cannot open the serial port, check:

- The USB cable is a data cable.
- The correct port has been selected.
- The Arduino Serial Monitor is closed.
- The board has been flashed correctly.
- The board driver is installed.
- The board is not locked by another process.

If responses appear but checks fail, review the raw log before changing code. A failed or partial test is still useful evidence as long as it is labeled correctly.

## 10. Next step after success

After NODE_00_MASTER is validated, the next hardware validation should be NODE_01_LED_STATE. That test should validate:

    PC -> Serial tool or Master path -> NODE_01 firmware -> LED state change -> log/report/photo evidence

Only after both Master and NODE_01 have evidence should the dashboard Web Serial mode be treated as the next integration target.
