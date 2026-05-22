# MicroBot Labs — v0.4 Real ESP32 Validation Readiness

Date: 2026-05-18  
Current phase: v0.3 closed as pre-hardware baseline  
Next phase: v0.4 real ESP32 serial validation

## Objective

The objective of v0.4 is to move from offline/simulated evidence to the first real hardware evidence.

The target is intentionally narrow:

Validate NODE_00_MASTER on a real ESP32 through serial logs.

## Required materials

Minimum required:

- one ESP32 development board;
- one working USB data cable;
- Arduino IDE or compatible build/upload path;
- ESP32 board support installed;
- Python 3;
- pyserial;
- repository checked out locally;
- firmware path available;
- serial capture tool available.

## Validation flow

1. Connect ESP32 to the Mac.
2. Identify the serial port.
3. Upload NODE_00_MASTER firmware.
4. Open serial capture.
5. Capture boot event.
6. Capture heartbeat.
7. Send or observe ping/status behavior.
8. Save raw log.
9. Save parsed JSONL log.
10. Generate validation report.
11. Commit evidence artifacts.
12. Update documentation.

## Acceptance criteria

v0.4 can be considered successful only if the repository contains real captured hardware evidence.

A successful v0.4 report must clearly show:

- board connected;
- serial port used;
- firmware uploaded;
- boot event captured;
- heartbeat captured;
- status or ping behavior captured;
- timestamped logs saved;
- validation script result;
- explicit statement of what was and was not validated.

## Non-goals

v0.4 should not attempt to validate all six nodes, drone flight, gesture-to-hardware control, magnetic docking, battery performance, full MicroBot OS or Dimension Engine physics claims.

