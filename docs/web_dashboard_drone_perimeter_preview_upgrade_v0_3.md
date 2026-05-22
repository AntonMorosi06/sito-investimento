# MicroBot Labs — Drone Perimeter Preview Upgrade v0.3

Status: dashboard drone/perimeter simulation upgrade  
Created: 2026-05-17  
Hardware validation status: not hardware-validated  
Dashboard path: `web/dashboard/`

## Purpose

This upgrade adds a Drone Perimeter Preview section to the MicroBot Labs dashboard.

The purpose is to connect the MicroBot dashboard with the future drone roadmap: indoor room perimeter scanning, boundary-following, obstacle awareness, MicroBot node placement and telemetry-aware mapping.

## What the section includes

The Drone Perimeter Preview includes:

- a 2D room map;
- a stylized drone;
- a room perimeter path;
- live perimeter progress;
- scan points;
- obstacle markers;
- MicroBot position markers;
- mission controls;
- live mission statistics;
- perimeter event log;
- JSON export for the simulated perimeter run.

## Correct interpretation

This is a pre-hardware simulation.

It does not validate:

- real drone flight;
- real indoor navigation;
- real SLAM;
- real LiDAR;
- real optical flow;
- real camera mapping;
- real obstacle avoidance;
- real MicroBot/drone coordination.

## Relationship with the MicroBot roadmap

This preview is aligned with the broader MicroBot direction:

1. MicroBot Labs dashboard as control center.
2. Six-node MicroBot simulation.
3. Telemetry and Data Center.
4. Gesture and MicroBot OS Console.
5. Drone perimeter preview.
6. Future real drone/room perimeter hardware testing.

## How to run

From the repository root:

    python3 -m http.server 8000

Open:

    http://localhost:8000/web/dashboard/index.html

Then open:

    Drone Perimeter

Recommended first interaction:

1. Start Perimeter Sim.
2. Watch the drone follow the boundary.
3. Toggle obstacles.
4. Toggle MicroBots.
5. Export Perimeter JSON.
6. Open Data Center and inspect exported/terminal evidence.

## Next possible upgrade

A future step can add a Dimension Engine overlay where the drone path is connected to state dimensions such as position, time, energy, link quality, risk, sensor confidence and node coordination.
