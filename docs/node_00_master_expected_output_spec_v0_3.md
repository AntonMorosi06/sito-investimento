# MicroBot Labs — NODE_00_MASTER Expected Output Specification v0.3

Status: expected-output specification  
Created: 2026-05-16  
Applies to: simulated pre-hardware validation and future real ESP32 validation  
Hardware validation status: not hardware-validated by this document

## 1. Purpose

This document defines the expected output behavior for NODE_00_MASTER during the v0.3 validation sequence.

It is used by both:

- the pre-hardware mock responder;
- the future real serial capture workflow.

The goal is to make the expected behavior explicit before comparing simulated output against real ESP32 output.

## 2. Expected boot behavior

After startup or reset, NODE_00_MASTER should produce an event-like output indicating that the Master node is ready.

Expected fields:

- protocol or version field;
- message type;
- source set to `NODE_00_MASTER`;
- target set to `PC_CONTROLLER`;
- payload indicating boot completion or ready state.

## 3. Expected response structure

Each structured response should contain:

- protocol or version;
- validation mode when simulated;
- type;
- source;
- target;
- sequence number;
- uptime or simulated uptime;
- command when command-related;
- status;
- state;
- payload.

The exact field names may evolve, but the response must remain machine-readable and reviewable.

## 4. Expected command behavior

| Command | Expected response |
|---|---|
| `PING` | `OK` response containing `PONG` |
| `STATUS` | `OK` response identifying `NODE_00_MASTER` |
| `GET_NODE_TABLE` | `OK` response listing expected nodes |
| `SCAN_NODES` | `OK` response with placeholder scan result before real node networking |
| `STOP` | `OK` response and transition to `SAFE_MODE` |
| `EMERGENCY_STOP` | `OK` response and transition to `EMERGENCY` |
| `RESET` | `OK` response and transition to `READY` |
| unknown command | structured error response |

## 5. Expected node table

The expected future nodes are:

- `NODE_01_LED_STATE`
- `NODE_02_PROXIMITY_SAFETY`
- `NODE_03_MAGNETIC_DOCKING`
- `NODE_04_MOTION_ACTUATOR`
- `NODE_05_TELEMETRY_SENSOR`
- `NODE_06_VISION_CAMERA`

In the current v0.3 stage these nodes may be listed as expected but offline.

## 6. Expected safety behavior

Safety behavior is more important than visual complexity.

Expected rules:

- `STOP` must put the Master into `SAFE_MODE`.
- `RESET` must return the Master to `READY`.
- `EMERGENCY_STOP` must put the Master into `EMERGENCY`.
- Unknown commands must be rejected.
- No test should imply motors, coils, magnets, batteries or external loads are connected.

## 7. Simulated versus hardware output

Simulated output should use clear labels such as:

    PRE_HARDWARE_SIMULATED

Real ESP32 output should use clear labels such as:

    HARDWARE_CAPTURED

A simulated log is useful as an expected-output baseline. It is not hardware evidence.
