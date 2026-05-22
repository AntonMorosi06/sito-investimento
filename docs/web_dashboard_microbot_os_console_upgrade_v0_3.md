# MicroBot Labs — MicroBot OS Console Upgrade v0.3

Status: dashboard MicroBot OS console upgrade  
Created: 2026-05-17  
Hardware validation status: not hardware-validated  
Dashboard path: `web/dashboard/`

## Purpose

This upgrade adds a MicroBot OS Console to the dashboard/web app.

The console connects the dashboard to the MicroBot OS concept described in the broader MicroBot documentation: boot layer, kernel layer, drivers, services, shell, event log, safety and module coordination.

## What the console includes

The MicroBot OS Console includes:

- simulated boot sequence;
- OS-style command line;
- command history;
- kernel/runtime status;
- simulated driver table;
- module table;
- node state inspection;
- telemetry model inspection;
- gesture mapping summary;
- documentation viewer summary;
- evidence boundary report;
- safety report;
- demo command.

## Commands

Available commands:

- `help`
- `boot`
- `status`
- `kernel`
- `drivers`
- `modules`
- `nodes`
- `telemetry`
- `gesture`
- `docs`
- `evidence`
- `safety`
- `demo`
- `clear`
- `reset`

## Correct interpretation

This is a browser-side MicroBot OS interface mock.

It does not validate:

- a real embedded kernel;
- a real QEMU boot;
- a real ESP32 boot;
- real drivers;
- real hardware modules;
- real safety behavior.

The console is designed to explain how the future MicroBot OS layer could coordinate modules, drivers, commands, telemetry, gesture input and evidence state.

## How to run

From the repository root:

    python3 -m http.server 8000

Open:

    http://localhost:8000/web/dashboard/index.html

Then open:

    OS Console

Recommended first commands:

    help
    boot
    status
    drivers
    nodes
    telemetry
    evidence
