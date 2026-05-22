# MicroBot Labs — v0.4 Hardware Purchase and Setup Notes

Created: 2026-05-18  
Target: first real ESP32 NODE_00_MASTER validation

## 1. Hardware target

The first physical target is not the full MicroBot system.

The first physical target is:

ESP32 board connected to Mac through USB serial, running NODE_00_MASTER firmware and producing captured serial logs.

## 2. Why two ESP32 boards are recommended

Only one ESP32 is strictly required for v0.4. However, two are recommended because:

- one board can fail;
- one board may have a bad USB bridge;
- one board may be occupied with NODE_00_MASTER while the second prepares NODE_01;
- debugging is easier when there is a backup.

## 3. Why cable quality matters

A charge-only cable can power the board while giving no serial port. That creates a false debugging problem.

For this reason, the BOM recommends two confirmed data cables.

## 4. Why the multimeter matters

The first serial validation does not strictly require a multimeter, but the immediate next step, NODE_01 LED/state testing, benefits from voltage and continuity checks.

A cheap multimeter reduces the risk of burning LEDs, misreading resistor values or debugging wiring blindly.

## 5. First hardware day checklist

1. Open repository.
2. Confirm working tree is clean.
3. Install pyserial.
4. Connect ESP32.
5. List serial ports.
6. Upload firmware.
7. Capture serial log.
8. Validate serial log.
9. Commit real evidence.
10. Update current evidence.

