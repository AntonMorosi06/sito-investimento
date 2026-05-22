# MicroBot Labs — Offline Testing Without Hardware v0.2

## 1. Purpose

This document explains how to continue MicroBot v0.2 development when the ESP32 is not available or cannot be connected.

The project is not blocked by missing hardware.

Hardware validation is only one layer of the system. Before connecting the ESP32, MicroBot can still validate protocol shape, dashboard behavior, state mapping, safety visualization, demo flow and GitHub documentation.

## 2. Correct Testing Strategy

When hardware is unavailable, the correct strategy is:

PC/browser -> Offline Mock Master -> Simulated Node State -> Dashboard Log -> Simulation Placeholder

This does not replace the hardware test.

It prepares the system for the hardware test.

## 3. What Can Be Tested Offline

| Area | Can Be Tested Without ESP32 |
|---|---|
| Protocol packet structure | yes |
| PING/STATUS response format | yes |
| Node table representation | yes |
| NODE_01 state mapping | yes |
| STOP and EMERGENCY_STOP behavior | yes |
| Dashboard layout | yes |
| Raw log | yes |
| Simulation placeholder | yes |
| README screenshots | yes |
| Demo flow rehearsal | yes |
| Real GPIO/LED behavior | no |
| Real serial timing | no |
| Real ESP32 firmware upload | no |
| Electrical safety | no |

## 4. Offline Tool

The current offline tool is:

tools/offline_protocol_lab/index.html

Open it with:

open tools/offline_protocol_lab/index.html

## 5. Public Honesty Rule

Offline evidence must be clearly labeled as simulated.

Correct wording:

This screenshot shows the offline protocol mock used before connecting ESP32 hardware.

Incorrect wording:

This screenshot proves the physical Master node is working.

## 6. Development Flow

Recommended flow when hardware is unavailable:

1. Use the offline protocol lab.
2. Test PING, STATUS, node table, STOP and RESET.
3. Capture a screenshot.
4. Document what is simulated.
5. Continue dashboard design.
6. Continue simulation mapping.
7. Return to ESP32 upload when hardware is available.

## 7. Transition to Hardware

When the ESP32 is available, replace the mock source with the real serial source.

Offline:

Dashboard state receives simulated packets.

Hardware:

Dashboard state receives packets from USB Serial / ESP32 Master.

The dashboard and simulation should not need to change their conceptual model.

Only the data source changes.

## 8. Version Notes

Version: v0.2  
Repository: microbot-labs  
Document role: Offline testing strategy  
Main scope: protocol mock, dashboard logic, simulated node state and demo preparation without hardware  
Next step: capture screenshot and later connect NODE_00_MASTER firmware to ESP32
