# MicroBot Labs — Source Document Alignment v0.1

This document explains how the public MicroBot Labs repository is aligned with the internal MicroBot v0.1 documentation series.

The purpose of this file is to keep the public repository coherent with the broader technical documentation without publishing the entire private workspace.

## Internal documentation basis

The public repository structure is derived from the following internal documents:

| Internal document | Role in the public repository |
|---|---|
| Documento 01 — Executive Summary | Defines MicroBot as a modular ecosystem, not a single isolated prototype |
| Documento 02 — BOM and Purchase Plan | Defines the Master ESP32, six node structure, dashboard, simulation and physical mockup as the v0.1 operational scope |
| Documento 03 — Hardware Architecture Specification | Defines the hardware model: PC Controller, ESP32 Master and six specialized nodes |
| Documento 04 — Firmware and Communication Protocol | Defines the logical language between PC Controller, Master and nodes: commands, states, heartbeat, telemetry and errors |
| Documento 05 — PC Controller and Dashboard Specification | Defines the dashboard as the operational cockpit for commands, logs, telemetry, camera, simulation and safety |
| Documento 06 — Simulation and Dimensional Engine Specification | Defines the 3D/4D/5D/6D simulation as a parametric computational state representation |
| Documento 07 — Testing and Validation Plan | Defines repeatable tests, acceptance criteria, integration tests and validation logic |
| Documento 08 — Physical Design and CAD Specification | Defines the physical MicroBot concept: black mockup, functional large prototype and future miniaturization path |
| Documento 09 — Risk and Safety Document | Defines fail-safe logic, low-power-first testing, safe mode, heartbeat, timeout and emergency stop |
| Documento 10 — Demo Script and Presentation Runbook | Defines the public demo chain: PC Controller, Master, nodes, response, dashboard and simulation |
| Documento 11 — Pitch Deck Content and Presentation Strategy | Defines how to communicate the project to professors, collaborators, community and potential investors |
| Documento 12 — GitHub and Portfolio Publication Plan | Defines the public repository, README, visual assets, release strategy, portfolio page and GitHub publication logic |
| Roadmap 6 Mesi — Prototipi Reali | Defines the six-month path toward a demonstrable MicroBot v0.1 platform |

## Public architecture derived from the documents

The public architecture used in this repository is:

PC Controller / Dashboard -> Web Serial or WebSocket Bridge -> NODE_00_MASTER -> six specialized nodes -> telemetry -> dashboard state -> simulation engine -> visual representation.

The six public node identities are:

| Node ID | Public role |
|---|---|
| NODE_00_MASTER | Central ESP32 controller |
| NODE_01_LED_STATE | Visual state node |
| NODE_02_PROXIMITY_SAFETY | Distance and safety node |
| NODE_03_MAGNETIC_DOCKING | Magnetic docking and coupling node |
| NODE_04_MOTION_ACTUATOR | Servo, vibration and motion node |
| NODE_05_TELEMETRY_SENSOR | IMU, OLED and telemetry node |
| NODE_06_VISION_CAMERA | ESP32-CAM and vision node |

## Public communication rule

The public repository must avoid exaggerated claims.

MicroBot Labs should be presented as an experimental platform for modular robotics, distributed robotic nodes, ESP32-based prototyping, telemetry dashboards, simulation and educational research.

The simulation layer should be described as a 3D/4D/5D/6D parametric visualization system. It should not be described as a direct physical proof of higher dimensions.

## Public safety rule

Every public technical explanation should include safety as a core design layer.

The system must visibly include:

- Low power first.
- One module at a time.
- Observable system states.
- Heartbeat.
- Timeout.
- Safe mode.
- Emergency stop.
- Error reporting.
- Manual recovery.

## Public publication rule

The repository should publish the clean and understandable version of MicroBot Labs, not the entire internal archive.

The public goal is clarity, demonstration, validation and progressive release.
