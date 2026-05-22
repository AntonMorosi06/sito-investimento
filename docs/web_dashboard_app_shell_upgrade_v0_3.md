# MicroBot Labs — Web App Shell / Sidebar / Tabs Upgrade v0.3

Status: web app shell upgrade  
Created: 2026-05-17  
Hardware validation status: not hardware-validated  
Dashboard path: `web/dashboard/`

## Purpose

This upgrade turns the MicroBot dashboard from a long scrolling page into a navigable web application shell.

The dashboard now has sidebar navigation, section routing, documentation quick links, a Data Center, local event filtering and local JSON snapshot export.

## Main sections

The web app shell organizes the dashboard into:

1. Overview
2. Nodes
3. Visual Swarm
4. Gesture Lab
5. Telemetry
6. Data Center
7. Inspectors
8. Terminal
9. Evidence

## Data Center

The Data Center summarizes packet count, terminal line count, warning count, error count, filtered event view, local JSON snapshot and export tools.

This is useful for debugging and presentation, but it is not hardware evidence.

## Correct interpretation

This upgrade improves usability and presentation.

It does not validate ESP32 hardware, Web Serial hardware data, radio signal, sensors, swarm movement, drone behavior or physical MicroBot behavior.

All current UI output remains pre-hardware unless real hardware logs are explicitly captured and reviewed.

## How to run

From the repository root:

    python3 -m http.server 8000

Open:

    http://localhost:8000/web/dashboard/index.html
