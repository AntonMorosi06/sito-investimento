# MicroBot Labs — v0.4 Architecture Diagram

Status: visual architecture documentation  
Created: 2026-05-18  
Repository phase: v0.4 hardware-ready scaffold  
Hardware validation status: not hardware-validated  
Source diagram: `docs/diagrams/microbot_v0_4_architecture_diagram.mmd`  
Static asset: `assets/diagrams/microbot_v0_4_architecture_diagram.svg`

## 1. Purpose

This document completes the architecture diagram item that was still listed as incomplete in the public README table.

The purpose of the v0.4 architecture diagram is not to describe a finished physical swarm. The purpose is to describe the current real structure of the repository after the v0.3 baseline closure and the v0.4 hardware-validation scaffold.

The architecture must therefore show three things at the same time:

1. the software and documentation layers that already exist;
2. the simulated/pre-hardware layers that are useful but not physical evidence;
3. the narrow v0.4 hardware target that must be validated next.

This distinction is important because MicroBot Labs is now a serious technical baseline, but it is not yet a completed robotics product.

## 2. Current architecture summary

The current architecture can be understood as a staged path:

User -> Mac/PC -> Web Dashboard -> simulated modules and evidence tools -> real ESP32 serial validation.

The web dashboard is the center of the current repository experience. It includes the sidebar web app shell, six-node control model, telemetry model, gesture lab, Data Center, Documentation Viewer, MicroBot OS Console and Drone Perimeter Preview. These features are valuable because they make the system understandable and inspectable before physical hardware is available.

The real hardware path is intentionally narrower. It starts from the Mac, uses the serial capture tools, connects to a real ESP32 running NODE_00_MASTER firmware and produces raw logs, JSONL logs and validation reports. That is the v0.4 hardware target.

## 3. Diagram



## 4. Layer interpretation

| Layer | Current role | Evidence status |
|---|---|---|
| User / Operator | Interacts with the local dashboard and hardware tools | Real user action |
| Mac / PC Controller | Runs the repository, dashboard, scripts and serial tools | Prepared |
| Web Dashboard | Main control and presentation interface | Working local web app |
| Documentation Viewer | Catalogs local docs and private reference-base documents | Documentation / navigation |
| MicroBot OS Console | Browser-side OS interface mock | Simulated |
| Gesture Lab | Browser-side hand gesture input | Simulated input |
| Drone Perimeter Preview | 2D room perimeter/drone workflow preview | Simulated |
| Serial Capture Tools | Real v0.4 preparation for ESP32 logs | Hardware-ready scaffold |
| NODE_00_MASTER ESP32 | First real hardware target | Pending validation |
| Evidence Artifacts | Logs, JSONL, reports and summaries | Offline PASS for v0.3; real v0.4 pending |

## 5. What this architecture does not claim

This architecture does not claim that:

- the full MicroBot swarm is physically working;
- all six nodes have been built;
- Web Serial has been validated with real hardware;
- gesture commands control real hardware;
- the drone preview is real flight;
- MicroBot OS is a real embedded operating system;
- the Dimension Engine proves higher physical dimensions.

## 6. Why this diagram is correct for v0.4

The diagram is correct for v0.4 because it reflects the current milestone honestly. v0.3 has been closed as a pre-hardware baseline. v0.4 has the capture and validation scaffold ready. The BOM is prepared. The next missing evidence is a real ESP32 serial capture.

The diagram therefore acts as a map for reviewers, collaborators and Anton himself: it tells them where the project is, what already exists and what the next physical proof must be.

