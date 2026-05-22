# MicroBot Labs — Web Dashboard Upgrade v0.3

Status: web dashboard upgrade documentation  
Created: 2026-05-16  
Hardware validation status: not hardware-validated  
Dashboard path: `web/dashboard/`

## 1. Purpose

This document describes the v0.3 upgrade of the MicroBot Labs web dashboard.

The dashboard was improved to make the project more understandable and useful before hardware is available, while preserving the repository rule that simulated evidence must never be confused with real hardware validation.

## 2. What changed

The dashboard now includes:

- clearer v0.3 title and maturity language;
- visible evidence badges;
- current truth panel;
- links to Current Evidence, Andrea onboarding, parser notes, hardware plan and BOM;
- NODE_00 fixture loading from `web/dashboard/test_fixtures/pre_hardware_node00_master_sample.jsonl`;
- built-in NODE_01 LED state demo;
- combined NODE_00 + NODE_01 pre-hardware demo;
- manual command input;
- packet inspector;
- node inspector;
- exportable terminal log;
- richer node cards with state, online/offline status, virtual LED and evidence mode;
- improved responsive visual design;
- future Web Serial hardware path still separated from mock/simulated modes.

## 3. What this validates

This validates only web/dashboard usability and pre-hardware dashboard preparation.

It does not validate:

- ESP32 hardware;
- USB Serial hardware communication;
- real Web Serial hardware communication;
- real LED output;
- sensors;
- actuators;
- magnetic docking;
- wireless swarm behavior.

## 4. How to run locally

From the repository root:

    python3 -m http.server 8000

Then open:

    http://localhost:8000/web/dashboard/index.html

This is the recommended way because fixture loading uses browser `fetch()`.

## 5. What to click first

Recommended demo path:

1. Start Offline Mock.
2. Load NODE_00 Fixture.
3. Run NODE_01 Demo.
4. Combined Demo.
5. Export Log.

## 6. Correct interpretation

A working dashboard means:

    The web interface can visualize and process mock/pre-hardware simulated data.

It does not mean:

    ESP32 hardware has been validated.
