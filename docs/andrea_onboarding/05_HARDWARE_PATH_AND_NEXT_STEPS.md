# 05 — Hardware Path and Next Steps

Status: hardware roadmap for Andrea  
Hardware status: not yet hardware-validated

## Purpose

This file explains what must happen next when hardware becomes available.

## First physical target

The first target is not a complete swarm.

The first target is:

```text
PC -> USB Serial -> ESP32 NODE_00_MASTER -> structured response -> log/report
```

## Second physical target

The second target is:

```text
PC or Master -> ESP32 NODE_01_LED_STATE -> visible LED state -> serial/log/photo evidence
```

## Minimum hardware needed

Minimum useful kit:

- ESP32 DevKit board;
- USB data cable;
- breadboard;
- jumper wires;
- resistor kit;
- LED kit;
- basic multimeter.

## First hardware commands

After uploading NODE_00_MASTER firmware:

```bash
python3 -m pip install pyserial
python3 tools/serial/capture_node00_master_validation.py --list
python3 tools/serial/capture_node00_master_validation.py --port /dev/cu.usbserial-XXXX
```

## NODE_01 future hardware test

Upload:

```text
firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino
```

Then test:

```text
PING
STATUS
ACTIVE
WARNING
ERROR
IDLE
STOP
RESET
```

Expected LED behavior:

```text
ACTIVE -> ON
IDLE/READY -> OFF
WARNING -> slow blink
ERROR -> fast blink
STOP/SAFE_MODE -> safety blink
```

## What Andrea can help with

Andrea can help by checking:

- whether the hardware path is realistic;
- whether the first test is small enough;
- whether the BOM is sufficient;
- whether the evidence standard is clear;
- whether the documentation is understandable.
