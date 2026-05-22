# MicroBot Labs — Arduino IDE and ESP32 Setup Guide v0.3

Status: pre-hardware setup guide  
Created: 2026-05-16  
Target board family: ESP32 DevKit / compatible ESP32 development board  
Target firmware: `firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino`  
Hardware validation status: not hardware-validated

## 1. Purpose

This guide prepares the software environment needed to upload the first MicroBot Labs firmware to a real ESP32 board.

The immediate target is not the full MicroBot swarm. The immediate target is the first v0.3 hardware boundary:

    PC -> USB Serial -> ESP32 NODE_00_MASTER -> structured response -> log -> report

This guide exists so that, when the ESP32 arrives, the upload process is not improvised.

## 2. Required software

Install:

- Arduino IDE 2.x or a compatible Arduino development environment.
- ESP32 board support package.
- Python 3.
- pyserial for serial testing.
- Git, already used by this repository.

Install pyserial:

    python3 -m pip install pyserial

Verify that Python can see pyserial:

    python3 -c "import serial; print(serial.__version__)"

## 3. ESP32 board package installation in Arduino IDE

Open Arduino IDE.

Open settings or preferences.

Find the field for additional Boards Manager URLs.

Add the ESP32 board package URL from the official Espressif Arduino core documentation when needed.

Then open Boards Manager and install the ESP32 platform.

After installation, select an ESP32 board compatible with the actual board purchased. For a generic ESP32 DevKit, a common starting board selection is usually close to an ESP32 Dev Module or ESP32 DevKit-style board. The exact board name must match the purchased board as closely as possible.

## 4. Open the NODE_00_MASTER firmware

Open this file:

    firmware/esp32/NODE_00_MASTER/NODE_00_MASTER.ino

The firmware is intentionally USB Serial based. It should not require sensors, external batteries, motors, coils, magnets or wireless nodes for the first test.

## 5. Select board and port

In Arduino IDE:

1. Select the correct ESP32 board.
2. Connect the ESP32 using a USB data cable.
3. Select the correct serial port.
4. Set upload speed to a safe default if needed.
5. Compile or Verify.
6. Upload.

If more than one serial port is visible, disconnect the ESP32, check the list, reconnect it, and select the port that appears.

## 6. First upload acceptance criteria

The first upload is considered successful only when:

- the firmware compiles;
- the firmware uploads to the board;
- the serial monitor opens at 115200 baud;
- a boot or ready message appears from `NODE_00_MASTER`;
- the board does not overheat;
- no external loads are connected.

## 7. Next command after upload

After upload, return to the terminal and run:

    python3 tools/serial/capture_node00_master_validation.py --list

Then use the detected port:

    python3 tools/serial/capture_node00_master_validation.py --port /dev/cu.usbserial-XXXX

## 8. Correct maturity language

Before upload:

    hardware-ready

After real upload and passing serial capture:

    NODE_00_MASTER serial PING/STATUS hardware-validated

Do not claim:

- full MicroBot hardware validated;
- full swarm validated;
- magnetic docking validated;
- wireless validated;
- programmable matter validated.

## 9. External references checked

This setup guide is aligned with official Arduino and Espressif setup concepts, including Arduino Boards Manager workflow, board/port selection, ESP32 serial connection requirements and pyserial serial-port listing behavior.

Reference URLs:

- https://support.arduino.cc/hc/en-us/articles/360016466340-Add-third-party-platforms-to-the-Boards-Manager-in-Arduino-IDE
- https://support.arduino.cc/hc/en-us/articles/4406856349970-Select-board-and-port-in-Arduino-IDE
- https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html
- https://documentation.espressif.com/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide_v2.html
- https://www.pyserial.com/docs/getting-started
