# MicroBot Labs — Testing and Validation Checklist v0.1

## 1. Purpose

This document defines the first public testing and validation checklist for MicroBot Labs v0.1.

The purpose of this checklist is to make the MicroBot v0.1 demonstrator measurable, repeatable and defensible.

MicroBot v0.1 is not considered valid simply because a component turns on once. It is considered valid when each level of the system can be tested through a clear sequence, with an expected result, an observed result, a safety condition and a documented outcome.

The first chain to validate is:

PC Controller -> Dashboard -> Bridge -> NODE_00_MASTER -> Nodes -> Telemetry -> Dashboard State -> Simulation

This checklist is designed for public GitHub documentation, demo preparation, build logs, portfolio material and future technical validation.

## 2. Validation Philosophy

The validation philosophy of MicroBot v0.1 is based on five principles.

| Principle | Practical Meaning |
|---|---|
| Repeatability | Every test must be repeatable with the same input and expected output |
| Observability | Every important state must be visible through LED, serial log, OLED, dashboard or simulation |
| Traceability | Every tested feature must be connected to a requirement or prototype objective |
| Safety | Every unsafe behavior must lead to STOP, SAFE_MODE or EMERGENCY |
| Incremental integration | Each layer must be tested alone before being integrated with the next layer |

A feature is not validated if it is only visually impressive. A feature is validated when it produces an expected, observable and documented result.

## 3. System Under Test

The system under test is MicroBot v0.1.

| Element | Included in v0.1 validation |
|---|---|
| PC Controller | Dashboard, command panel, logs, serial or bridge connection |
| NODE_00_MASTER | ESP32 Master, command routing, heartbeat, node table and safety state |
| NODE_01_LED_STATE | Visual state output |
| NODE_02_PROXIMITY_SAFETY | Distance sensing and safety threshold |
| NODE_03_MAGNETIC_DOCKING | Hall sensor, magnetic detection and docking state |
| NODE_04_MOTION_ACTUATOR | Servo, vibration or simple actuator behavior |
| NODE_05_TELEMETRY_SENSOR | IMU, OLED and telemetry packet |
| NODE_06_VISION_CAMERA | ESP32-CAM state or controlled camera test |
| Protocol | Commands, responses, telemetry, errors, heartbeat and timeout |
| Dashboard | Node cards, log, telemetry, safety panel and simulation panel |
| Simulation | Visual mapping of node state and telemetry |
| Safety Layer | STOP, SAFE_MODE, EMERGENCY, timeout and offline detection |
| Demo Runbook | Repeatable public demonstration sequence |

Out of scope for v0.1:

| Element | Reason |
|---|---|
| Full miniaturized swarm | Future phase |
| Industrial PCB | Future phase |
| Certified safety system | v0.1 is laboratory prototype |
| Real biometric database | Not required and not suitable for public v0.1 |
| Fully autonomous distributed swarm | Future wireless and AI phase |
| Physical proof of higher dimensions | Simulation is a parametric visualization system |

## 4. Validation Levels

MicroBot v0.1 should be validated in levels.

| Level | Name | What It Validates |
|---|---|---|
| L0 | Document and Preflight Test | BOM, wiring, power, pinout, safety assumptions and setup |
| L1 | Component Test | Individual sensors, LEDs, displays, actuators and camera modules |
| L2 | Node Firmware Test | Each node boots, responds and reports state |
| L3 | Master Test | Master receives commands, routes messages and manages state |
| L4 | Protocol Test | JSON-like messages, commands, responses, errors and telemetry |
| L5 | Dashboard Test | UI panels, terminal, node cards, safety and telemetry updates |
| L6 | Simulation Mapping Test | Telemetry updates visual state |
| L7 | Integration Test | PC -> Master -> Node -> Dashboard -> Simulation chain |
| L8 | Safety Validation | STOP, timeout, offline detection, SAFE_MODE and EMERGENCY |
| L9 | Demo Readiness Test | Full public demo sequence is repeatable and recordable |

No level should depend on an untested lower level.

## 5. L0 — Document and Preflight Test

Before powering the system, the documentation and workbench must be checked.

| Check | Expected Result | Status |
|---|---|---|
| BOM exists | hardware_bill_of_materials_v0_1.md is present | To do |
| Protocol exists | communication_protocol_v0_1.md is present | To do |
| Dashboard spec exists | dashboard_controller_specification_v0_1.md is present | To do |
| Node IDs defined | NODE_00 to NODE_06 are stable | To do |
| Power source identified | USB, power bank or bench supply selected | To do |
| Wiring reviewed | No short circuits or unclear power paths | To do |
| GPIO plan reviewed | Pins are not randomly assigned | To do |
| Safety plan reviewed | STOP and SAFE_MODE logic understood | To do |
| Test log prepared | Result file or notebook ready | To do |
| Camera privacy checked | No uncontrolled biometric data used | To do |

Acceptance criterion:

The system can be powered only after wiring, power and test objective are clear.

## 6. L1 — Component Test

Each component must be tested before integration.

| Component | Test | Expected Result | Status |
|---|---|---|---|
| ESP32 DevKit | Upload blink or serial test | Board programs correctly | To do |
| RGB LED / NeoPixel | Set color | LED changes color | To do |
| OLED SSD1306 | Display text | Node ID appears | To do |
| VL53L0X | Read distance | Distance value changes with object | To do |
| Hall sensor | Move magnet near sensor | Magnetic reading changes | To do |
| Servo SG90 | Move to angle | Servo moves to expected angle | To do |
| Vibration motor | Short pulse | Motor vibrates briefly | To do |
| MPU6050 | Read IMU values | Accel/gyro values returned | To do |
| ESP32-CAM | Camera boot | Camera status available | To do |
| Buzzer | Trigger warning | Sound emitted | To do |
| MOSFET test | Switch low-power load | Load activates safely | To do |

Safety rule:

Actuators, coils, motors and external loads must not be driven directly from ESP32 GPIO pins.

## 7. L2 — Node Firmware Test

Each node must boot, identify itself and answer at least PING and STATUS.

| Node | Required Test | Expected Result | Status |
|---|---|---|---|
| NODE_01_LED_STATE | PING, STATUS, SET_LED | LED state changes and response is logged | To do |
| NODE_02_PROXIMITY_SAFETY | PING, STATUS, READ_DISTANCE | Distance and safety state returned | To do |
| NODE_03_MAGNETIC_DOCKING | PING, STATUS, READ_MAGNETIC | Magnetic level or docked state returned | To do |
| NODE_04_MOTION_ACTUATOR | PING, STATUS, SET_SERVO or SET_VIBRATION | Actuator moves briefly and stops | To do |
| NODE_05_TELEMETRY_SENSOR | PING, STATUS, READ_TELEMETRY | IMU or telemetry packet returned | To do |
| NODE_06_VISION_CAMERA | PING or CAMERA_STATUS | Camera state returned | To do |

Minimum firmware requirements:

| Requirement | Meaning |
|---|---|
| Stable node ID | Firmware reports the correct node ID |
| Boot state | Node starts in BOOT then READY |
| PING response | Node answers basic availability check |
| STATUS response | Node reports current state |
| Error handling | Unknown command produces an error |
| Timeout logic | Active behavior cannot continue forever |
| Safe state | Node can return to safe condition |

## 8. L3 — Master ESP32 Test

The Master is the central coordinator.

| Test | Command | Expected Result | Status |
|---|---|---|---|
| Master boot | Power on | Master enters READY | To do |
| Ping Master | PING | Master returns PONG | To do |
| Master status | STATUS | Master returns state and uptime | To do |
| Node table | GET_NODE_TABLE | Expected nodes listed | To do |
| Scan nodes | SCAN_NODES | Online/offline state updated | To do |
| Route command | SET_LED to NODE_01 | Command reaches node or offline error returned | To do |
| Handle invalid target | Command to unknown node | INVALID_TARGET returned | To do |
| Handle unknown command | Unknown command | UNKNOWN_COMMAND returned | To do |
| Master STOP | STOP | Active local action stops | To do |
| Emergency stop | EMERGENCY_STOP | Master enters EMERGENCY | To do |

Acceptance criterion:

The Master must never hide errors. If a node is not available, it must report OFFLINE or TARGET_OFFLINE.

## 9. L4 — Protocol Test

The communication protocol must be readable and structured.

| Test | Expected Result | Status |
|---|---|---|
| Command has version | version field is present | To do |
| Command has type | command, response, telemetry, error or heartbeat | To do |
| Command has source | source field identifies sender | To do |
| Command has target | target field identifies receiver | To do |
| Command has sequence | seq or equivalent ordering field exists | To do |
| Response references command | response can be matched to command | To do |
| Error packet exists | invalid command produces structured error | To do |
| Telemetry packet exists | sensor value or state sent as telemetry | To do |
| Heartbeat exists | Master or node sends alive signal | To do |
| Timeout can be detected | dashboard or Master marks timeout | To do |

Required protocol message types:

| Type | Required |
|---|---|
| command | yes |
| response | yes |
| telemetry | yes |
| heartbeat | yes |
| error | yes |
| event | recommended |

## 10. L5 — Dashboard Test

The dashboard must make the system observable.

| Test | Expected Result | Status |
|---|---|---|
| Dashboard loads | UI opens without errors | To do |
| Connect button works | Connection state changes | To do |
| Disconnect button works | Connection closes cleanly | To do |
| PING Master button works | PONG appears in log | To do |
| STATUS Master button works | Master state appears | To do |
| Node cards visible | Six node cards appear | To do |
| Raw terminal visible | Raw messages shown | To do |
| Parsed log visible | Human-readable events shown | To do |
| Telemetry panel updates | Sensor data shown | To do |
| Safety panel visible | Safety state shown | To do |
| Emergency stop visible | STOP is always accessible | To do |
| Simulation panel visible | Placeholder or visual mapping appears | To do |
| Invalid packet handling | Protocol error appears in log | To do |

Acceptance criterion:

A person should be able to understand the current system state by looking at the dashboard.

## 11. L6 — Simulation Mapping Test

The simulation does not need advanced physics in v0.1. It must represent system state clearly.

| Protocol Data | Visual Mapping | Status |
|---|---|---|
| NODE_01 state | Color or glow change | To do |
| NODE_02 distance | Proximity radius or warning state | To do |
| NODE_03 magnetic level | Docking field or coupling indicator | To do |
| NODE_04 actuator state | Motion indicator | To do |
| NODE_05 telemetry | Orientation, movement or data panel | To do |
| NODE_06 camera state | Camera icon or vision status | To do |
| SAFE_MODE | Safety overlay | To do |
| EMERGENCY | Red lock or emergency overlay | To do |
| OFFLINE node | Greyed-out node | To do |

Important rule:

The simulation is a parametric visualization of system states. It is not a physical proof of higher dimensions. It visualizes position, time evolution, configuration, vibration, energy, information, docking and safety as computational variables.

## 12. L7 — Integration Test

The integration test validates the first complete chain.

Required chain:

PC Controller -> Dashboard -> Bridge -> Master -> Node -> Response -> Telemetry -> Dashboard -> Simulation

| Step | Action | Expected Result | Status |
|---:|---|---|---|
| 1 | Open dashboard | UI loads | To do |
| 2 | Connect Master | Master connection established | To do |
| 3 | Send PING | Master returns PONG | To do |
| 4 | Request node table | Nodes listed | To do |
| 5 | Send SET_LED to NODE_01 | LED changes state | To do |
| 6 | Receive response | Response appears in terminal | To do |
| 7 | Update node card | NODE_01 card changes state | To do |
| 8 | Update simulation | Virtual node changes state | To do |
| 9 | Send STOP | Node returns safe state | To do |
| 10 | Export or save log | Evidence saved | To do |

Minimum integration success:

At least one physical node must be controlled from the PC and reflected in the dashboard or simulation.

## 13. L8 — Safety Validation

Safety is not optional.

| Safety Test | Trigger | Expected Result | Status |
|---|---|---|---|
| STOP command | User presses STOP | Active action stops | To do |
| EMERGENCY_STOP | User presses emergency | Master enters EMERGENCY | To do |
| Node offline | Disconnect or simulate no response | Node marked OFFLINE | To do |
| Timeout | No heartbeat received | Warning or OFFLINE state shown | To do |
| Invalid command | Send unsupported command | UNKNOWN_COMMAND error returned | To do |
| Invalid target | Send to unknown node | INVALID_TARGET error returned | To do |
| Unsafe actuator command | Missing duration or unsafe payload | UNSAFE_COMMAND returned | To do |
| Sensor failure | Sensor missing or unreadable | SENSOR_ERROR returned | To do |
| Safe mode recovery | Reset from SAFE_MODE | System returns only through controlled action | To do |

Required safety states:

| State | Meaning |
|---|---|
| NORMAL | System operating within expected limits |
| WARNING | Non-critical anomaly detected |
| SAFE_MODE | System restricts actions |
| EMERGENCY | Global stop or critical condition |
| OFFLINE | Node or Master not responding |

Acceptance criterion:

When behavior is uncertain, the system must stop, log the event and require controlled recovery.

## 14. L9 — Demo Readiness Test

The demo is ready only when it can be repeated.

| Demo Step | Required Output | Status |
|---|---|---|
| Camera/phone setup | Stable recording angle | To do |
| Workbench setup | Clean table and visible nodes | To do |
| Dashboard setup | UI visible and readable | To do |
| Master boot | Master enters READY | To do |
| Node scan | Node table appears | To do |
| NODE_01 demo | LED state changes | To do |
| NODE_02 demo | Distance/safety reading appears | To do |
| NODE_03 demo | Magnetic/docking state appears | To do |
| NODE_04 demo | Motion or vibration action appears | To do |
| NODE_05 demo | Telemetry packet appears | To do |
| NODE_06 demo | Camera state appears or fallback shown | To do |
| Simulation update | Visual state changes | To do |
| STOP_ALL | System returns safe | To do |
| Final log | Demo evidence saved | To do |

The demo must explain one core idea:

MicroBot is not a single isolated object. It is a modular ecosystem where hardware, firmware, dashboard, telemetry, simulation and safety work together.

## 15. Test Case Template

Each test should be documented using this format.

| Field | Value |
|---|---|
| Test ID | MBT-v0.1-LX-000 |
| Test name | Short name |
| Date | YYYY-MM-DD |
| Operator | Name |
| Module | Master, node, dashboard, protocol, simulation or safety |
| Precondition | What must be ready before the test |
| Input | Command, action or setup |
| Expected output | What should happen |
| Observed output | What actually happened |
| Status | PASS, FAIL, PARTIAL or BLOCKED |
| Evidence | Photo, video, log, screenshot or serial output |
| Notes | Problems, fixes or next actions |

## 16. Test Status Definitions

| Status | Meaning |
|---|---|
| PASS | Expected result achieved and documented |
| FAIL | Expected result not achieved |
| PARTIAL | Some expected behavior achieved, but not complete |
| BLOCKED | Test cannot run because a dependency is missing |
| SKIPPED | Test intentionally postponed |
| UNSAFE | Test stopped due to safety risk |

A test marked PASS without evidence should be treated as incomplete.

## 17. Evidence Requirements

Each validated milestone should produce evidence.

| Evidence Type | Use |
|---|---|
| Serial log | Protocol and firmware validation |
| Dashboard screenshot | UI and telemetry validation |
| Photo | Hardware build validation |
| Short video | Demo and behavior validation |
| Wiring diagram | Reproducibility |
| Test table | Technical report |
| Git commit | Version traceability |

Evidence should be stored in future folders such as:

assets/screenshots/
assets/images/
demos/
docs/test_logs/

## 18. Validation Matrix

| Requirement | Validation Method | Evidence |
|---|---|---|
| PC can send command | PING Master test | Serial log |
| Master can respond | STATUS Master test | Dashboard log |
| Node ID is stable | Node firmware test | Response packet |
| Node can execute command | NODE_01 SET_LED test | Photo/video |
| Sensor can send data | NODE_02 or NODE_05 telemetry test | Telemetry packet |
| Dashboard shows state | Dashboard mapping test | Screenshot |
| Simulation updates | Simulation mapping test | Screen recording |
| STOP works | Safety test | Log/video |
| Offline detection works | Timeout test | Dashboard screenshot |
| Demo is repeatable | Demo readiness test | Full demo video |

## 19. Public GitHub Readiness

Before publishing or sharing the repository publicly, check:

| Check | Required |
|---|---|
| README is clear | yes |
| Diagrams visible | yes |
| BOM exists | yes |
| Communication protocol exists | yes |
| Dashboard specification exists | yes |
| Testing checklist exists | yes |
| Safety rules visible | yes |
| No private files included | yes |
| No passwords or secrets | yes |
| No uncontrolled biometric data | yes |
| No misleading claims about simulation | yes |
| Repository status is honest | yes |

## 20. Next Implementation Step

After this testing checklist, the next public document should be:

docs/simulation_dimensional_engine_context_v0_1.md

That document should explain how MicroBot maps physical and simulated node states into 3D/4D/5D/6D visual parameters while keeping the model scientifically careful and clearly computational.

The testing checklist defines how to verify the system.

The simulation context will define how to visualize the system correctly.

## 21. Version Notes

Version: v0.1  
Repository: microbot-labs  
Document role: Public testing and validation checklist  
Project phase: Pre-startup foundation / physical demonstrator planning  
Main scope: preflight, component tests, node tests, Master tests, protocol, dashboard, simulation, safety and demo readiness  
Next document: simulation_dimensional_engine_context_v0_1.md
