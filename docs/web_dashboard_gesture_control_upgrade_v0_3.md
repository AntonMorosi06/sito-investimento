# MicroBot Labs — Browser Hand Gesture Control Upgrade v0.3

Status: browser-side gesture control upgrade  
Created: 2026-05-17  
Hardware validation status: not hardware-validated  
Dashboard path: `web/dashboard/`

## 1. Purpose

This document describes the v0.3 gesture-control upgrade for the MicroBot Labs dashboard.

The dashboard now includes a browser camera section that can detect hand landmarks and map recognized gestures to simulated MicroBot commands.

This feature is intended as an interaction layer for the dashboard. It does not validate physical MicroBot hardware.

## 2. Technology

The implementation uses a browser-side hand landmark model through MediaPipe Tasks Vision. The camera feed is processed locally by the browser when permission is granted.

The dashboard loads the hand landmarker model from a public MediaPipe model URL and uses detected hand landmarks to classify gestures.

## 3. Gesture map

| Gesture | How to perform it | Dashboard action | Meaning |
|---|---|---|---|
| Open Palm | Extend all five fingers | `SCAN_NODES` | Ask the Master to scan the simulated node field. |
| Closed Fist | Close all fingers | `STOP` | Put the simulated swarm into safe mode. |
| Index Point | Extend only the index finger | selected node `ACTIVE` | Activate the currently selected MicroBot. |
| Pinch | Bring thumb and index close together | selected node role action | Run the selected node's special function. |
| Peace / V | Extend index and middle fingers | `SWARM_SWEEP` | Run an ordered sweep across six simulated nodes. |
| Three Fingers | Extend index, middle and ring fingers | `MISSION_DEMO` | Run the complete simulated mission sequence. |
| Thumbs Up | Thumb up, other fingers closed | `ALL_ACTIVE` | Activate all simulated MicroBots. |
| Thumbs Down | Thumb down, other fingers closed | `ALL_IDLE` | Return all simulated MicroBots to idle. |
| Swipe Right | Move open hand quickly right | select next node | Move target selection forward. |
| Swipe Left | Move open hand quickly left | select previous node | Move target selection backward. |
| Palm Up | Move open hand upward | selected node `WARNING` | Mark selected node as warning/review. |
| Palm Down | Move open hand downward | selected node `IDLE` | Return selected node to idle. |
| Two Hands Open | Show both hands open | `RESET` | Reset simulated system to ready/idle. |
| Two Fists | Show both hands closed | `EMERGENCY_STOP` | Trigger simulated emergency stop. |

## 4. Correct interpretation

This is browser-side gesture input.

It can control the simulated dashboard state, but it does not validate real ESP32 hardware, real motors, real sensors, real drone control, real MicroBot physical movement or real safety behavior.

## 5. How to run

From the repository root:

    python3 -m http.server 8000

Open:

    http://localhost:8000/web/dashboard/index.html

Then click:

    Start Gesture Control

Camera access usually requires localhost or HTTPS.

## 6. Safety note

Gesture commands are debounced and include a safety lock. Two Fists triggers emergency stop in the simulated dashboard. The gesture section must remain disabled or carefully reviewed before being connected to real hardware in the future.
