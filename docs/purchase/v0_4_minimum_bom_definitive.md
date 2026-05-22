# MicroBot Labs — v0.4 Definitive Minimum Purchase BOM

Status: purchase-ready BOM  
Created: 2026-05-18  
Target milestone: v0.4 real ESP32 NODE_00_MASTER serial validation  
Hardware validation status: not hardware-validated until real logs are captured

## 1. Purpose

This document defines the minimum purchase list for MicroBot Labs v0.4.

The goal is intentionally narrow: buy only the material needed to move from the v0.3 pre-hardware baseline to the first real ESP32 validation.

The v0.4 physical target is:

Mac -> USB data cable -> ESP32 development board -> NODE_00_MASTER firmware -> serial output -> raw log -> parsed JSONL -> validation report -> committed evidence.

This BOM is not meant to build the full MicroBot swarm, the drone, magnetic docking, the final shell, batteries, sensors or actuators. It is the minimum serious purchase plan for the first real hardware proof.

## 2. Purchase philosophy

The purchase plan is divided into three levels.

The strict minimum gets the ESP32 serial validation running.

The recommended minimum makes the first LED/state-node test possible immediately after the serial test.

The safe minimum adds basic measurement and protection so that the first real tests are less fragile.

For v0.4, the recommended purchase is the safe minimum, not the absolute minimum, because one bad cable or one missing resistor can block the entire validation day.

## 3. Tier A — absolute minimum for v0.4 serial validation

This tier is enough only to validate that a real ESP32 can run NODE_00_MASTER and emit serial output.

| Priority | Item | Quantity | Estimated budget | Required? | Reason |
|---|---:|---:|---:|---|---|
| A1 | ESP32 development board, preferably ESP32 DevKit / ESP32-WROOM-32 style board | 1 | 6-15 EUR | yes | Main board for NODE_00_MASTER real serial validation |
| A2 | USB data cable matching the board connector, USB-C or Micro-USB depending on board | 1 | 4-10 EUR | yes | Needed for upload, power and serial capture |
| A3 | Spare USB data cable | 1 | 4-10 EUR | strongly recommended | Many cheap cables are charge-only; a spare avoids false debugging |
| A4 | Access to Arduino IDE / ESP32 Arduino Core / upload workflow | 1 | 0 EUR | yes | Required to upload firmware |
| A5 | Python + pyserial on the Mac | 1 | 0 EUR | yes | Required for serial capture tool |

Estimated Tier A budget: 10-35 EUR.

Tier A is acceptable only if the immediate goal is pure serial validation with no breadboard LED test.

## 4. Tier B — recommended minimum for NODE_00 + first LED/state node

This is the recommended minimum purchase for Anton's current MicroBot Labs path.

| Priority | Item | Quantity | Estimated budget | Required? | Reason |
|---|---:|---:|---:|---|---|
| B1 | ESP32 development board, ESP32 DevKit / ESP32-WROOM-32 style | 2 | 12-30 EUR | yes | One active board and one backup board |
| B2 | USB data cables matching the boards | 2 | 8-20 EUR | yes | Upload/serial reliability |
| B3 | Breadboard, 400 or 830 tie-points | 1 | 4-10 EUR | yes | Needed for LED, resistor and future node tests |
| B4 | Jumper wires M-M | 1 kit | 3-8 EUR | yes | Breadboard wiring |
| B5 | Jumper wires M-F and F-F | 1 kit | 4-10 EUR | recommended | Useful for modules and sensor boards |
| B6 | LED assortment, 3 mm or 5 mm | 1 kit | 3-8 EUR | yes | NODE_01_LED_STATE physical output |
| B7 | Resistor kit including 220 ohm, 330 ohm, 1 kohm and 10 kohm | 1 kit | 4-10 EUR | yes | LED current limiting and basic pull-up/pull-down tests |
| B8 | Tactile push buttons | 5-10 pcs | 2-6 EUR | optional but useful | Manual input/reset/safe-mode tests |
| B9 | Small component organizer or bags | 1 | 2-8 EUR | optional | Avoids losing resistors and wires |

Estimated Tier B budget: 35-80 EUR.

Tier B is the recommended v0.4 buy because it covers the real NODE_00_MASTER serial test and the immediate next NODE_01 LED/state test.

## 5. Tier C — safe minimum hardware-lab version

This tier adds the minimum safety/diagnostic tools that make the project more reliable.

| Priority | Item | Quantity | Estimated budget | Required? | Reason |
|---|---:|---:|---:|---|---|
| C1 | Basic digital multimeter | 1 | 10-25 EUR | strongly recommended | Verify voltage, continuity and resistor values |
| C2 | USB hub or adapter compatible with Mac ports | 1 | 8-25 EUR | if needed | Useful if the Mac has only USB-C and the board/cables differ |
| C3 | Antistatic or clean small work mat | 1 | 5-15 EUR | optional | Keeps tests organized |
| C4 | Small precision screwdriver/tweezer set | 1 | 5-15 EUR | optional | Useful for electronics handling |
| C5 | Electrical tape or heat-shrink assortment | 1 | 3-10 EUR | optional | Cable/connection safety |

Estimated Tier C addition: 30-90 EUR.

Recommended total safe minimum: 60-130 EUR depending on what Anton already owns.

## 6. Final recommended v0.4 cart

The definitive minimum cart for the next real MicroBot Labs step is:

| Buy | Quantity | Notes |
|---|---:|---|
| ESP32 DevKit / ESP32-WROOM-32 development board | 2 | One main, one backup |
| USB data cable matching board connector | 2 | Confirm data capability, not charge-only |
| Breadboard | 1 | 400 or 830 tie-points |
| Jumper wire kit M-M | 1 | Breadboard wiring |
| Jumper wire kit M-F/F-F | 1 | Future modules and sensor boards |
| LED assortment | 1 | NODE_01 physical state output |
| Resistor kit | 1 | Must include 220 ohm or 330 ohm |
| Basic digital multimeter | 1 | Strongly recommended |
| Mac-compatible USB adapter/hub | 1 if needed | Only if required by cable/board connector |

Recommended final budget: 60-100 EUR if buying carefully.

Maximum reasonable v0.4 beginner budget: 130 EUR.

Do not spend 300+ EUR yet unless the goal changes from v0.4 serial validation to a broader six-node hardware kit.

## 7. What not to buy yet

For v0.4, do not buy these yet unless there is a separate plan:

| Item | Why not yet |
|---|---|
| Drone frame / motors / ESC / flight controller | Belongs to later drone milestone |
| LiPo batteries and charger | Safety/flight phase, not needed for serial validation |
| Electromagnets / coils / MOSFET modules | Docking/magnetics phase, not needed for NODE_00 serial |
| ESP32-CAM | Useful later for NODE_06, not needed for first validation |
| OLED displays | Useful later, not required for NODE_00 serial |
| IMU / ToF / ultrasonic sensors | Later sensor validation |
| Custom PCB | Too early; breadboard first |
| 3D printed shell | Physical design phase, not v0.4 serial validation |

## 8. Search terms to use

Use these search terms on Amazon, AliExpress, Mouser, Digi-Key, eBay or local electronics retailers.

### ESP32 board

- ESP32 DevKit ESP32-WROOM-32 USB-C
- ESP32 DevKitC ESP32 WROOM development board
- ESP32 development board CH340 USB-C
- ESP32 NodeMCU development board

### Cable

- USB-C data cable short
- Micro USB data cable sync
- USB data cable not charge only

### Breadboard and wiring

- breadboard 830 tie points
- jumper wires male male female female kit
- breadboard jumper wire kit

### LEDs and resistors

- LED assortment 5mm
- resistor kit 220 ohm 330 ohm 1k 10k
- Arduino starter resistor LED kit

### Measurement

- digital multimeter basic electronics
- multimeter continuity voltage resistor

## 9. Board selection rules

Choose an ESP32 development board with:

- ESP32-WROOM-32 or equivalent standard ESP32 module;
- USB connector already on the board;
- USB-to-UART bridge or native upload support;
- accessible EN/RESET and BOOT buttons;
- 3.3 V logic;
- pin labels printed on the board if possible;
- many GPIO pins exposed;
- seller description mentioning Arduino IDE compatibility.

Avoid boards where:

- the USB connector is unclear;
- no pinout is shown;
- the board has no normal boot/reset buttons;
- the seller does not explain the chip/module;
- the price is suspiciously low for only one board;
- reviews mention upload/serial problems.

## 10. First validation path after purchase

After the material arrives:

1. Connect ESP32 to Mac.
2. Run:

       python3 -m pip install pyserial
       python3 tools/serial/capture_real_esp32_node00_master_v0_4.py --list

3. Identify the port.
4. Upload NODE_00_MASTER firmware.
5. Capture:

       python3 tools/serial/capture_real_esp32_node00_master_v0_4.py --port /dev/cu.usbserial-XXXX --duration 60

6. Validate:

       python3 tools/serial/validate_real_esp32_node00_master_v0_4.py

7. Commit logs and report only if they are real hardware captures.

## 11. Evidence boundary

This BOM makes the repository purchase-ready.

It does not mean hardware has been purchased.

It does not mean hardware has been validated.

Hardware validation begins only when real serial logs are captured from a real ESP32 and committed with a validation report.

