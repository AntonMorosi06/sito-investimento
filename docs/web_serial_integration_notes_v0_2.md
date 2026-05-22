# MicroBot Labs — Web Serial Integration Notes v0.2

## 1. Purpose

This document explains the first Web Serial preparation step for the MicroBot PC Controller Dashboard.

The repository now includes two new dashboard modules:

| File | Role |
|---|---|
| web/dashboard/protocol_parser.js | Parses and validates JSON-like protocol packets |
| web/dashboard/serial_adapter.js | Prepares browser Web Serial connection to NODE_00_MASTER |

## 2. Current Status

The dashboard still works in offline/mock mode.

The new files prepare the transition toward real ESP32 communication, but they do not require hardware to exist.

## 3. Intended Future Flow

The intended hardware flow is:

Dashboard -> Web Serial -> NODE_00_MASTER -> JSON-like response -> protocol parser -> dashboard state -> simulation placeholder

## 4. Why This Matters

The dashboard should not be rewritten when hardware becomes available.

The correct design is to separate:

| Layer | Responsibility |
|---|---|
| serial_adapter.js | Reads and writes serial lines |
| protocol_parser.js | Converts raw text into validated packets |
| app.js | Updates dashboard state and UI |
| simulation placeholder | Visualizes state changes |

## 5. Current Limitation

Web Serial may not be available from every browser or local file context.

If it is unavailable, the dashboard remains usable through offline/mock mode.

## 6. Next Step

When ESP32 hardware is available, test this sequence:

1. Upload NODE_00_MASTER firmware.
2. Open the dashboard.
3. Press Web Serial.
4. Select the ESP32 serial port.
5. Send PING.
6. Confirm that the real Master response appears in the raw protocol terminal.

## 7. Version Notes

Version: v0.2  
Repository: microbot-labs  
Document role: Web Serial integration notes  
Main scope: protocol parsing, serial adapter preparation and future ESP32 Master connection
