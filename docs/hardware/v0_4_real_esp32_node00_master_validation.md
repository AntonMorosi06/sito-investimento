# MicroBot Labs — v0.4 Real ESP32 NODE_00_MASTER Validation

Status: hardware validation scaffold  
Created: 2026-05-18  
Current hardware validation status: not hardware-validated until real logs are captured

## 1. Purpose

This document prepares the repository for the first real hardware validation milestone.

The target is narrow and measurable:

Validate that a real ESP32 running NODE_00_MASTER firmware can emit serial output that can be captured, parsed and reported inside this repository.

## 2. Why this matters

The v0.3 phase closed a strong pre-hardware baseline: dashboard, simulated nodes, telemetry model, gesture lab, Data Center, Documentation Viewer, MicroBot OS Console, Drone Perimeter Preview and offline evidence artifacts.

The next step must be physical evidence.

v0.4 should not try to validate the entire MicroBot ecosystem. It should validate one real chain:

Mac -> USB cable -> ESP32 -> NODE_00_MASTER firmware -> serial output -> raw log -> JSONL log -> validation report -> committed evidence.

## 3. Required tools

Minimum requirements:

- ESP32 development board;
- USB data cable;
- Arduino IDE or equivalent upload workflow;
- ESP32 board package installed;
- Python 3;
- pyserial;
- this repository cloned locally.

Install pyserial:

    python3 -m pip install pyserial

List serial ports:

    python3 tools/serial/capture_real_esp32_node00_master_v0_4.py --list

Capture real serial output:

    python3 tools/serial/capture_real_esp32_node00_master_v0_4.py --port /dev/cu.usbserial-XXXX --duration 60

Validate latest captured JSONL:

    python3 tools/serial/validate_real_esp32_node00_master_v0_4.py

## 4. Evidence folders

Real v0.4 evidence should be stored under:

    demos/demo_v0_4/real_esp32_node00_master/

Subfolders:

- 
- 
- 
- 

## 5. Acceptance criteria

v0.4 can be considered successful only when the repository contains real captured serial evidence.

A minimal PASS should show:

- JSON packets present;
- NODE_00_MASTER source present;
- boot event present;
- heartbeat present;
- status/ready behavior present;
- no parse errors;
- real capture metadata present or attached;
- validation report generated.

## 6. Non-goals

v0.4 does not validate:

- all six MicroBot nodes;
- LED physical behavior;
- proximity sensor behavior;
- magnetic docking;
- actuation;
- battery behavior;
- drone flight;
- room perimeter mapping;
- gesture-to-hardware control;
- MicroBot OS as a real embedded kernel.

## 7. Correct claim after PASS

A valid claim after a PASS report would be:

MicroBot Labs v0.4 validates the first real ESP32 NODE_00_MASTER serial-output path and stores the captured hardware evidence in the repository.

A wrong claim would be:

The full MicroBot swarm is hardware validated.

