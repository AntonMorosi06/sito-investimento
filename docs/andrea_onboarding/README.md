# MicroBot Labs — Andrea Onboarding Map v0.3

Status: Andrea onboarding folder  
Created: 2026-05-16  
Repository: `AntonMorosi06/microbot-labs`  
Hardware validation status: not yet hardware-validated

## Purpose

This folder is written for Andrea.

The goal is to make the repository understandable without forcing Andrea to open every file manually. It explains what MicroBot Labs is, what has been done so far, what each important document does, what can be run without hardware, what is simulated, what is hardware-ready, and what still requires real ESP32 hardware.

This is not a marketing folder. It is a technical map.

## Fast reading order for Andrea

Andrea should read the files in this order:

1. `00_START_HERE_ANDREA.md`
2. `01_PROJECT_MAP_FOR_ANDREA.md`
3. `02_DOCUMENT_INDEX_FOR_ANDREA.md`
4. `03_HOW_TO_RUN_WITHOUT_HARDWARE.md`
5. `04_EVIDENCE_STATUS_AND_LIMITS.md`
6. `05_HARDWARE_PATH_AND_NEXT_STEPS.md`
7. `06_REVIEW_CHECKLIST_FOR_ANDREA.md`
8. `07_MESSAGE_TO_ANDREA.md`

## Current truth in one paragraph

MicroBot Labs is currently a structured v0.3 pre-hardware robotics repository. It contains documentation, repository mapping, current evidence, simulated NODE_00_MASTER behavior, simulated NODE_01_LED_STATE behavior, generated logs/reports, dashboard parser validation and a prepared path toward ESP32 hardware testing. It does not yet contain real ESP32 hardware evidence, real LED evidence, real Web Serial hardware evidence, magnetic docking evidence, sensor evidence or swarm evidence.

## Main rule

Simulated evidence must never be described as hardware validation.

The repository is strong because it is honest about what exists and what still needs to be physically tested.
