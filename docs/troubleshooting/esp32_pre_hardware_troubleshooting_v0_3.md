# MicroBot Labs — ESP32 Pre-Hardware Troubleshooting Guide v0.3

Status: pre-hardware troubleshooting guide  
Created: 2026-05-16  
Hardware validation status: not hardware-validated

## 1. Purpose

This guide collects the most likely problems that can occur before or during the first ESP32 NODE_00_MASTER validation.

It is designed to prevent wasting time during the first real hardware session.

## 2. Problem: ESP32 does not appear as a serial port

Possible causes:

- USB cable is charge-only.
- Driver missing.
- USB hub problem.
- Board is not powered.
- Board uses a USB-to-UART bridge not supported automatically.
- The board is defective.

Actions:

1. Try a known data-capable USB cable.
2. Connect directly to the Mac, avoiding hubs.
3. Run:

       python3 tools/serial/capture_node00_master_validation.py --list

4. Run:

       ls /dev/cu.*

5. Disconnect and reconnect the board to see which port appears.
6. Install the correct driver if required by the board.

## 3. Problem: Arduino IDE cannot upload

Possible causes:

- Wrong board selected.
- Wrong port selected.
- Serial Monitor open.
- Board requires BOOT button during upload.
- Upload speed too high.
- Driver issue.
- Cable issue.

Actions:

1. Close Serial Monitor.
2. Recheck board and port.
3. Press and hold BOOT during the start of upload if required.
4. Try a lower upload speed.
5. Try another USB cable.
6. Restart Arduino IDE.
7. Reconnect the board.

## 4. Problem: Upload works but no serial output appears

Possible causes:

- Wrong baud rate.
- Firmware not actually uploaded.
- Wrong port selected.
- Serial output delayed by reset.
- Script starts reading too early or too late.

Actions:

1. Use 115200 baud.
2. Press RESET on the board.
3. Run:

       python3 tools/serial/capture_node00_master_validation.py --port /dev/cu.usbserial-XXXX --boot-seconds 3

4. Open Arduino Serial Monitor at 115200 and check for boot output.
5. Re-upload firmware.

## 5. Problem: Python script cannot import serial

Cause:

- pyserial missing.

Fix:

    python3 -m pip install pyserial

Check:

    python3 -c "import serial; print(serial.__version__)"

## 6. Problem: Permission or port busy error

Possible causes:

- Arduino Serial Monitor is open.
- Another script is using the port.
- VS Code/PlatformIO opened the port.
- Previous terminal process is still running.

Actions:

1. Close Arduino Serial Monitor.
2. Close other serial tools.
3. Unplug and replug the ESP32.
4. Run the script again.

## 7. Problem: JSON output appears malformed

Possible causes:

- Firmware version differs from expected version.
- Serial output contains bootloader noise.
- Baud rate mismatch.
- Partial line read due to reset timing.

Actions:

1. Confirm baud rate is 115200.
2. Wait for board boot before sending commands.
3. Review raw log before editing firmware.
4. Do not delete failed logs; mark them as review-required if committed.

## 8. Safety warnings

During the first NODE_00_MASTER test:

- do not connect motors;
- do not connect coils;
- do not connect batteries;
- do not connect magnets;
- do not connect external power;
- do not connect actuators;
- keep the test USB-only.

The goal is communication validation, not actuation.
