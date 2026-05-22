# MicroBot Labs — Diagrams

This folder contains the first public diagrams for the MicroBot Labs repository.

These diagrams are aligned with the internal MicroBot v0.1 documentation series. They are not generic diagrams: they reflect the actual project structure defined across the executive summary, roadmap, hardware architecture, firmware protocol, dashboard specification, simulation specification, testing plan, risk and safety document, demo runbook, pitch strategy, and GitHub publication plan.

## Available diagrams

| Diagram | Purpose |
|---|---|
| microbot_ecosystem_architecture_v0_1.mmd | Shows the complete public architecture: PC Controller, bridge, Master ESP32, six nodes, telemetry, dashboard, simulation, safety and documentation |
| microbot_demo_flow_v0_1.mmd | Shows the demo execution flow from user command to node response, telemetry, dashboard update and simulation output |
| microbot_safety_validation_flow_v0_1.mmd | Shows the safety and validation logic based on preflight checks, safe mode, heartbeat, offline detection, STOP and report generation |

## Design principle

The diagrams must make MicroBot understandable from the outside without exposing the full internal workspace.

The public representation should be clean, realistic and defensible. It should distinguish between implemented, prototyped, simulated and planned parts of the system.

The simulation layer must be described as a parametric computational representation of system states, not as a physical proof of higher dimensions.

The safety layer must be visible because MicroBot includes electronics, sensors, actuators, magnets, camera modules, firmware and communication logic.
