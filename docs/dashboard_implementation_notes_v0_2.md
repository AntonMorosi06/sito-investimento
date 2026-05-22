# MicroBot Labs — Dashboard Implementation Notes v0.2

## 1. Purpose

This document explains the first implementation step of the MicroBot PC Controller Dashboard.

The repository now contains a web dashboard baseline at:

web/dashboard/index.html

The dashboard is separate from the offline protocol lab. The offline protocol lab is a focused testing tool. The dashboard is the first version of the future operator cockpit.

## 2. Current State

The dashboard currently works in offline/mock mode.

It can:

- start a mock connection;
- display Master state;
- display node cards;
- send simulated commands;
- update NODE_01 state;
- display raw JSON-like protocol packets;
- show telemetry/event counters;
- show STOP and EMERGENCY_STOP behavior;
- update a simulation placeholder.

## 3. Why Offline Mode Is Useful

Offline mode allows development to continue without ESP32 hardware.

It validates the dashboard data model before connecting real serial communication.

The intended development path is:

offline mock -> Web Serial adapter -> ESP32 Master -> real telemetry -> simulation mapping

## 4. Current Files

| File | Role |
|---|---|
| web/dashboard/index.html | Dashboard structure |
| web/dashboard/style.css | Dashboard visual design |
| web/dashboard/app.js | Dashboard state, command flow and mock protocol |
| web/dashboard/README.md | Dashboard usage notes |

## 5. Next Technical Step

The next technical step is to add a Web Serial or local serial bridge module.

Suggested future files:

| File | Role |
|---|---|
| web/dashboard/serial_adapter.js | Browser Web Serial connection |
| web/dashboard/protocol_parser.js | Parse incoming JSON packets |
| web/dashboard/state_store.js | Shared state model |
| web/dashboard/simulation_bridge.js | Map dashboard state to simulation state |

## 6. Hardware Transition

When the ESP32 Master is available, the dashboard should replace the mock packet source with real serial packets.

The UI should not need to be redesigned.

Only the data source should change.

## 7. Version Notes

Version: v0.2  
Repository: microbot-labs  
Document role: dashboard implementation notes  
Main scope: PC Controller dashboard baseline, mock state model and future Web Serial integration
