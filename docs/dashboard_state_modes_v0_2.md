# MicroBot Labs — Dashboard State Modes v0.2

## 1. Purpose

This document defines the dashboard state modes used by the MicroBot PC Controller Dashboard.

The goal is to avoid confusion between mock operation and real hardware communication.

## 2. Dashboard Modes

| Mode | Meaning |
|---|---|
| OFFLINE MOCK | The dashboard is using simulated packets and does not require ESP32 hardware |
| WEB SERIAL READY | The dashboard is preparing to request a browser serial connection |
| WEB SERIAL CONNECTED | The dashboard is connected to a serial port through the browser |
| WEB SERIAL UNAVAILABLE | The browser or current context does not support Web Serial |

## 3. Correct Usage

When no ESP32 is connected, use:

Start Offline Mock

When an ESP32 is connected and running NODE_00_MASTER firmware, use:

Web Serial Hardware Only

## 4. Public Wording

Correct wording:

The dashboard currently runs in offline/mock mode and prepares a future Web Serial connection to NODE_00_MASTER.

Incorrect wording:

The dashboard is already connected to real hardware when it is only using mock packets.

## 5. Version Notes

Version: v0.2  
Repository: microbot-labs  
Document role: dashboard state/mode clarification  
Main scope: offline mock, Web Serial readiness and real hardware connection distinction
