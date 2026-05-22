# MicroBot Labs — Web Dashboard Data Telemetry Upgrade v0.3

Status: dashboard data/telemetry upgrade  
Created: 2026-05-17  
Hardware validation status: not hardware-validated  
Dashboard path: `web/dashboard/`

## Purpose

This upgrade improves the dashboard as a data-management and telemetry cockpit.

It adds a black/white/gray visual style and a telemetry link analysis section that models signal strength, estimated response time, packet loss, throughput, jitter, packet rate, battery estimate, temperature estimate and overall link quality.

## What changed

The dashboard now includes:

- monochrome technical styling;
- signal strength in dBm;
- estimated response time in milliseconds;
- packet loss percentage;
- link quality score;
- throughput estimate;
- jitter estimate;
- packets per minute;
- battery estimate;
- temperature estimate;
- transport mode;
- per-node telemetry health table;
- telemetry scenarios: good link, weak signal, congested link, stress test and reset.

## Correct interpretation

This is a pre-hardware telemetry model.

It does not validate real ESP32 telemetry, Wi-Fi, ESP-NOW, USB Serial, real sensor data, real battery data or real temperature data.

## How to run

From the repository root:

    python3 -m http.server 8000

Open:

    http://localhost:8000/web/dashboard/index.html

## Next upgrade

The next upgrade should add a separate gesture-control section using browser camera input and hand tracking. That feature should remain clearly labeled as browser-side gesture input, not hardware validation.
