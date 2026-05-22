# MicroBot Labs — Minimum BOM and Amazon Search List v0.3

Status: pre-purchase BOM  
Created: 2026-05-16  
Hardware validation status: not hardware-validated  
Purchase strategy: minimum serious kit for NODE_00_MASTER and NODE_01_LED_STATE

## 1. Purpose

This document defines the minimum useful purchase list for the first physical MicroBot Labs tests.

The goal is not to buy everything needed for the final MicroBot vision. The goal is to buy the minimum serious kit that supports:

- NODE_00_MASTER upload;
- serial PING/STATUS validation;
- NODE_01_LED_STATE LED output validation;
- safe breadboard experimentation;
- basic measurement and debugging.

## 2. Minimum serious kit

| Priority | Item | Quantity | Purpose | Amazon search phrase |
|---|---:|---:|---|---|
| Essential | ESP32 DevKit USB-C or Micro-USB | 2-3 | Master board and spare/test board | `ESP32 DevKit USB-C WROOM development board` |
| Essential | USB data cables | 2 | Upload and serial communication | `USB data cable USB-C data sync cable` or `Micro USB data cable sync` |
| Essential | Breadboard 830 tie points | 1-2 | First test circuits | `830 point solderless breadboard` |
| Essential | Jumper wire kit | 1 | Breadboard wiring | `Dupont jumper wires male male female female kit` |
| Essential | Resistor kit | 1 | LED current limiting and basic circuits | `resistor assortment kit 1/4W` |
| Essential | LED kit or RGB LED kit | 1 | NODE_01 visible state output | `LED assortment kit 3mm 5mm RGB` |
| Essential | Multimeter | 1 | Voltage and continuity checks | `digital multimeter electronics continuity voltage` |
| Recommended | Tactile push buttons | 1 kit | Manual input/reset experiments | `tactile push button switch kit breadboard` |
| Recommended | OLED SSD1306 I2C display | 1-2 | Future node status display | `SSD1306 OLED I2C 0.96 inch ESP32` |
| Recommended | Logic level-safe sensor kit | 1 small kit | Later telemetry experiments | `ESP32 sensor kit I2C modules` |
| Recommended | Storage organizer | 1 | Component organization | `small parts organizer electronics components` |

## 3. Strict minimum if budget is tight

If the budget is very tight, buy only:

- 2 ESP32 DevKit boards;
- 2 USB data cables;
- 1 breadboard;
- jumper wires;
- resistor kit;
- LED kit;
- basic digital multimeter.

This is enough for:

- NODE_00_MASTER upload and serial response;
- NODE_01 LED visible state test;
- basic debugging.

## 4. What not to buy yet

For v0.3, do not prioritize:

- motors;
- robot chassis;
- LiPo batteries;
- chargers;
- coils;
- electromagnets;
- MOSFET power stages;
- camera modules;
- ESP32-CAM;
- complex sensor arrays;
- expensive robotics kits.

Those belong to later phases.

## 5. Quality rules

When choosing products:

- prefer boards with clear ESP32-WROOM or ESP32-S3 identification;
- prefer sellers that clearly mention data/programming support;
- avoid listings that do not specify the USB connector;
- buy more than one ESP32 if possible;
- always buy at least one spare data cable;
- do not assume a cable is data-capable just because it charges a device.

## 6. Estimated budget logic

Budget estimates change with seller, country, delivery and kit quality.

A reasonable minimum starter kit can often be built around:

- low budget: board + cables + breadboard + LED/resistor/jumper kit;
- serious minimum: add multimeter and spare ESP32;
- comfortable starter kit: add OLED, buttons, organizers and extra jumper/component kits.

The purchase should be optimized for repeatable validation, not aesthetic complexity.

## 7. First evidence after purchase

The first evidence to commit should be:

- serial log from NODE_00_MASTER;
- generated validation report;
- optional photo of ESP32 connected by USB;
- optional screenshot of Arduino upload success;
- current_status update from hardware-ready to specific hardware-validated behavior.

## 8. Safety rule

No external power, batteries, motors or coils are needed for the first test. Keep the first hardware session USB-only.
