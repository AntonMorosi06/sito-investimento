# MicroBot Labs — Hardware Purchase Readiness Checklist v0.3

Status: pre-purchase checklist  
Created: 2026-05-16  
Hardware validation status: not hardware-validated

## 1. Purpose

This checklist defines the minimum conditions that should be satisfied before buying the first MicroBot Labs ESP32 hardware.

The goal is not to buy random components. The goal is to buy the smallest serious set of components that allows the v0.3 NODE_00_MASTER and NODE_01_LED_STATE tests to be completed cleanly.

## 2. Readiness criteria

Before purchasing, confirm:

- [ ] The repository `microbot-labs` is clean and pushed.
- [ ] The v0.3 canonical status document exists.
- [ ] The NODE_00_MASTER serial validation pack exists.
- [ ] The pre-hardware simulation bridge exists or is planned.
- [ ] The Arduino IDE setup guide exists.
- [ ] The serial port selection guide exists.
- [ ] The troubleshooting guide exists.
- [ ] The minimum BOM is reviewed.
- [ ] A realistic budget is chosen.
- [ ] A USB data cable is included in the purchase.
- [ ] No motors, coils or high-current devices are needed for the first test.
- [ ] Evidence folders are ready.
- [ ] The first issue to close is hardware upload, not full swarm behavior.

## 3. Minimum purchase target

The minimum serious purchase should support:

1. Real ESP32 NODE_00_MASTER upload.
2. Real serial PING/STATUS validation.
3. NODE_01_LED_STATE visible LED state validation.
4. Safe breadboard experimentation.
5. Basic measurement with a multimeter.
6. Repeatable documentation with photos/logs.

## 4. Avoid buying too early

Do not buy advanced components first.

Avoid starting with:

- motors;
- coils;
- batteries;
- magnetic docking hardware;
- camera modules;
- robotic chassis;
- too many sensors;
- expensive kits not needed for v0.3.

The first hardware milestone is communication and state validation, not movement.

## 5. Purchase decision

The purchase is ready when the following sentence is true:

    I can buy the minimum kit, connect one ESP32 by USB, upload NODE_00_MASTER, run serial validation, save evidence, then test one LED node.

If that sentence is not true, keep preparing the documentation and setup environment.
