# MicroBot Labs — Dashboard Mockup v0.4

Status: dashboard mockup documentation  
Created: 2026-05-18  
Repository phase: v0.4 hardware-ready scaffold  
Hardware validation status: not hardware-validated  
Static asset: `assets/mockups/dashboard_mockup_v0_4.svg`

## 1. Purpose

This document completes the dashboard mockup item that was still listed as incomplete in the README.

The mockup is based on the dashboard that now exists in the repository. It is not just a decorative landing page. It represents the current web app structure: sidebar navigation, Overview, Nodes, Visual Swarm, Gesture Lab, Telemetry, Data Center, Documentation Viewer, MicroBot OS Console, Drone Perimeter Preview, Inspectors, Terminal and Evidence.

The mockup is useful for README presentation, collaborator onboarding and professor review because it explains at a glance what the web app is meant to do.

## 2. Dashboard concept

The dashboard is the current operational center of MicroBot Labs.

It has three roles:

First, it is a simulated control surface for the MicroBot nodes. It can show planned nodes, trigger simulated commands, display visual state and explain the command model.

Second, it is an evidence and debugging surface. Data Center, Terminal, Inspectors and evidence documents make the repository auditable rather than just visual.

Third, it is a roadmap bridge. Gesture Lab, MicroBot OS Console and Drone Perimeter Preview show how the system will grow later, while still marking them as pre-hardware simulation or browser-side interface mocks.

## 3. Main mockup zones

| Zone | Role |
|---|---|
| Sidebar | Navigation between major project layers |
| Overview | Global truth state, current claim and system summary |
| Nodes | Six-node MicroBot command matrix |
| Visual Swarm | Stylized MicroBot response area |
| Telemetry | Signal, latency, packet loss, jitter and quality model |
| Data Center | Event filtering, snapshots and JSON export |
| Documentation Viewer | Local docs and private reference-base map |
| MicroBot OS Console | Browser-side OS shell concept |
| Drone Perimeter | Room mapping/drone roadmap preview |
| Evidence | Boundary between simulated/offline and real hardware validation |

## 4. Static mockup

![MicroBot Labs Dashboard Mockup v0.4](../../assets/mockups/dashboard_mockup_v0_4.svg)

## 5. Correct interpretation

This mockup reflects an existing local dashboard structure, but it does not mean that physical MicroBot hardware is validated.

The mockup should be interpreted as a UI/UX and documentation artifact. Real hardware validation begins only when ESP32 serial logs are captured and committed in the v0.4 evidence folder.

## 6. Next design improvements

Future dashboard improvements can include:

1. a real hardware mode panel after ESP32 validation;
2. Web Serial integration after serial capture is proven;
3. real validation badges for NODE_00_MASTER;
4. a first NODE_01 LED hardware view;
5. a more advanced telemetry chart history;
6. a future dimension-engine overlay for position, time, energy, link quality, risk and sensor confidence.

