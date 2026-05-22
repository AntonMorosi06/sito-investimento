# MicroBot Labs — v0.4 Prototype Block Diagram

Status: prototype block documentation  
Created: 2026-05-18  
Repository phase: v0.4 hardware-ready scaffold  
Hardware validation status: not hardware-validated  
Source diagram: `docs/diagrams/microbot_v0_4_prototype_block_diagram.mmd`  
Static asset: `assets/diagrams/microbot_v0_4_prototype_block_diagram.svg`

## 1. Purpose

This document completes the prototype block diagram item that was still listed as incomplete in the README.

The v0.4 prototype block diagram is deliberately narrow. It does not describe the final MicroBot swarm, the drone platform, the full magnetic docking system or the future physical shell. It describes the first real hardware validation block: ESP32 NODE_00_MASTER serial validation.

That is the correct next step because the repository already has a strong simulated and documented baseline. The next evidence gap is physical: the system must show that a real ESP32 can run the firmware and produce serial output that can be captured, parsed and reported.

## 2. Prototype block



## 3. Block explanation

| Block | Meaning |
|---|---|
| ESP32 DevKit | The first real physical board used for NODE_00_MASTER |
| USB data cable | Provides power, upload path and serial connection |
| Arduino IDE / ESP32 Core | Upload workflow for the firmware |
| NODE_00_MASTER firmware | First firmware target: boot, heartbeat, status, ping/status behavior |
| Serial capture script | Captures real serial output into raw and JSONL logs |
| Validation script | Reads captured JSONL and generates PASS/FAIL report |
| Evidence folder | Stores raw logs, JSONL logs, summaries and reports |
| Breadboard / LED / resistors | Prepared for the immediate next NODE_01 LED/state test |
| Multimeter | Basic safety and diagnostic support |

## 4. Minimum physical kit represented by the diagram

The block diagram corresponds to the v0.4 minimum BOM:

- two ESP32 development boards;
- two matching USB data cables;
- one breadboard;
- jumper wires;
- LED assortment;
- resistor kit;
- basic multimeter;
- USB adapter/hub only if needed.

Only one ESP32 is strictly required for the first serial validation, but two are recommended because having a backup board prevents a single hardware fault from blocking the validation phase.

## 5. Expected validation output

A successful v0.4 validation should produce:

| Output | Purpose |
|---|---|
| Raw serial log | Human-readable record of the board output |
| JSONL log | Machine-readable parsed packets |
| Metadata JSON | Capture context: port, baud, duration, timestamp |
| Validation report | PASS/FAIL technical interpretation |
| Summary JSON | Machine-readable validation result |

## 6. What this block diagram does not include yet

This block diagram intentionally does not include:

- drone motors;
- ESCs;
- LiPo batteries;
- flight controller;
- ESP32-CAM;
- OLED display;
- electromagnets;
- MOSFET coil drivers;
- custom PCB;
- 3D printed shell.

Those belong to later milestones after the first real serial validation.

## 7. Acceptance criteria for the block

The prototype block becomes validated only when real logs exist in:

`demos/demo_v0_4/real_esp32_node00_master/logs/`

and the validation report exists in:

`demos/demo_v0_4/real_esp32_node00_master/reports/`

Until those files are produced from a real ESP32, the prototype block is prepared but not hardware-validated.

