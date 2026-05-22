# MicroBot Labs — Six-Node Dashboard and Stylized MicroBot Visual Upgrade v0.3

Status: web dashboard visual/control upgrade  
Created: 2026-05-16  
Hardware validation status: not hardware-validated  
Dashboard path: `web/dashboard/`

## 1. Purpose

This document describes the v0.3 dashboard upgrade that makes all six planned MicroBot nodes controllable in pre-hardware simulation mode.

The dashboard now acts as a richer local control surface for:

- `NODE_01_LED_STATE`
- `NODE_02_PROXIMITY_SAFETY`
- `NODE_03_MAGNETIC_DOCKING`
- `NODE_04_MOTION_ACTUATOR`
- `NODE_05_TELEMETRY_SENSOR`
- `NODE_06_VISION_CAMERA`

It also adds a stylized MicroBot visual swarm where each simulated MicroBot reacts to commands.

## 2. What changed

The dashboard now includes:

- per-node controls for all six planned nodes;
- node selector and action selector;
- global commands such as `ALL_ACTIVE`, `ALL_IDLE`, `SWARM_SWEEP` and `MISSION_DEMO`;
- role-specific actions for each node;
- stylized visual MicroBots that respond to state changes;
- simulated state mapping for active, idle, warning, error, safe mode and reset;
- richer node grid;
- clickable MicroBots and node cards;
- updated packet/node inspector;
- clearer evidence language.

## 3. Simulated node roles

| Node | Simulated role |
|---|---|
| `NODE_01_LED_STATE` | Visible LED state |
| `NODE_02_PROXIMITY_SAFETY` | Distance/safety zone |
| `NODE_03_MAGNETIC_DOCKING` | Magnetic docking state |
| `NODE_04_MOTION_ACTUATOR` | Motion/vibration output |
| `NODE_05_TELEMETRY_SENSOR` | IMU, energy and telemetry |
| `NODE_06_VISION_CAMERA` | Camera/vision scan state |

## 4. Correct interpretation

This upgrade makes the dashboard more useful and visually understandable before hardware exists.

It does not validate:

- real ESP32 hardware;
- real LED output;
- real proximity sensors;
- real magnetic docking;
- real actuators;
- real telemetry sensors;
- real camera hardware;
- real swarm behavior.

## 5. How to run locally

From the repository root:

    python3 -m http.server 8000

Then open:

    http://localhost:8000/web/dashboard/index.html

Recommended interaction sequence:

1. Start Offline Mock.
2. Scan nodes.
3. All Active.
4. Swarm Sweep.
5. Mission Demo.
6. Click individual MicroBots.
7. Use the per-node command matrix.
8. Export the terminal log.
