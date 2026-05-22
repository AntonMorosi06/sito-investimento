# MicroBot Labs — v0.4 Badge Status Truth Table

Created: 2026-05-18  
Purpose: explain the README badges and prevent overclaiming  
Hardware validation status: not hardware-validated

## Current README badge meaning

| Badge | Meaning |
|---|---|
| `status: v0.4 hardware-ready scaffold` | The repository has the tools, folder structure and documentation needed to begin real ESP32 validation. |
| `evidence: offline PASS / real hardware pending` | v0.3 offline evidence exists and passed, but real ESP32 logs are still missing. |
| `baseline: v0.3 closed pre-hardware` | v0.3 has been closed as a software, dashboard, documentation and offline evidence baseline. |
| `next: v0.4 real ESP32 serial validation` | The next milestone is a narrow hardware validation of NODE_00_MASTER serial output. |
| `platform: ESP32 / Web / Simulation / Docs` | The repository combines ESP32 firmware preparation, web dashboard, simulation and documentation. |
| `license: MIT` | Public repository license badge. |

## What the badges do not mean

The badges do not mean that:

- ESP32 hardware has already been validated;
- all six MicroBot nodes work physically;
- real Web Serial has been tested;
- sensors, actuators, magnetics, batteries or drone hardware have been validated;
- MicroBot OS is a real embedded kernel;
- the drone perimeter preview is real flight or real mapping evidence.

## Correct claim

Correct:

MicroBot Labs is now prepared for v0.4 real ESP32 NODE_00_MASTER serial validation.

Incorrect:

MicroBot Labs has completed full hardware validation.

