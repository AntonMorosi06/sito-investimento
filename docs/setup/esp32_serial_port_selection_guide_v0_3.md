# MicroBot Labs — ESP32 Serial Port Selection Guide v0.3

Status: pre-hardware setup guide  
Created: 2026-05-16  
Hardware validation status: not hardware-validated

## 1. Purpose

This guide explains how to identify the correct serial port for the ESP32 board during MicroBot Labs v0.3 testing.

The target is the real NODE_00_MASTER validation chain:

    PC -> USB Serial -> ESP32 NODE_00_MASTER -> structured response -> log -> report

## 2. Why serial port selection matters

The first hardware test can fail for a simple reason: the computer is not talking to the ESP32 board.

On macOS, an ESP32 board usually appears under `/dev/cu.*`. The exact name depends on the USB-to-UART bridge used by the board.

Possible examples:

- `/dev/cu.usbserial-XXXX`
- `/dev/cu.usbmodemXXXX`
- `/dev/cu.SLAB_USBtoUART`
- `/dev/cu.wchusbserialXXXX`

## 3. Recommended terminal method

From the repository root:

    python3 tools/serial/capture_node00_master_validation.py --list

If no port appears, try:

    ls /dev/cu.*

Then disconnect the ESP32, run again, reconnect the ESP32 and run again. The port that appears after reconnecting is probably the ESP32.

## 4. Recommended Arduino IDE method

In Arduino IDE:

1. Open the Tools menu.
2. Select the correct board.
3. Open the Port menu.
4. Identify the port that appears when the ESP32 is connected.
5. If the board is not recognized, install the required driver for the USB-to-UART bridge.

## 5. Typical failure cases

If the port does not appear:

- the USB cable may be charge-only;
- the board may need a driver;
- the USB hub may be unreliable;
- the board may be damaged;
- another application may already be using the port;
- Arduino IDE Serial Monitor may be open while the Python script tries to connect.

If upload fails:

- check board selection;
- check port selection;
- press BOOT on boards that require manual bootloader mode;
- lower upload speed;
- close Serial Monitor;
- reconnect the board.

## 6. First MicroBot command sequence

After the firmware is uploaded and the port is known, run:

    python3 tools/serial/capture_node00_master_validation.py --port /dev/cu.usbserial-XXXX

The script sends:

- `PING`
- `STATUS`
- `GET_NODE_TABLE`
- `SCAN_NODES`
- `STOP`
- `STATUS`
- `RESET`
- `STATUS`

A passing test creates a raw log and Markdown report.

## 7. Evidence rule

A serial port listing is not hardware validation by itself.

Hardware validation begins only after the real ESP32 runs the firmware and returns expected structured responses.
