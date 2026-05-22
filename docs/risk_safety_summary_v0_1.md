# MicroBot Labs — Risk and Safety Summary v0.1

## 1. Purpose

This document defines the public risk and safety summary for MicroBot Labs v0.1.

The purpose of this file is to make the safety logic of MicroBot visible inside the public GitHub repository.

MicroBot v0.1 is not a certified product. It is a laboratory demonstrator composed of a PC Controller, an ESP32 Master, six specialized nodes, a dashboard, a telemetry layer, a simulation engine and a physical mockup direction.

For this reason, every practical test must be designed with clear limits, controlled power, visible states, documented procedures, safe firmware behavior and emergency stop logic.

The goal of safety is not to reduce the ambition of MicroBot.

The goal of safety is to make the project credible, testable and responsible.

## 2. Source Alignment

This public safety summary is aligned with the internal MicroBot documentation base.

| Source Document | Role in this file |
|---|---|
| MicroBot_Documento_09_Risk_Safety_Document.pdf | Primary source for safety philosophy, risk classes, fail-safe logic, electrical protection, firmware safety and demo safety |
| MicroBot_Documento_07_Testing_Validation_Plan.pdf | Source for validation levels, test criteria, safety tests, stress tests and report templates |
| MicroBot_Documento_04_Firmware_Communication_Protocol.pdf | Source for commands, states, heartbeat, timeout, error codes and protocol safety |
| MicroBot_Documento_05_PC_Controller_Dashboard_Specification.pdf | Source for dashboard safety panel, visible emergency stop, node cards and telemetry/logging |
| MicroBot_Documento_02_BOM_Piano_Acquisti.pdf | Source for safe material selection, MOSFETs, diodes, protected power and staged purchasing |
| piano di acquisto e organizzazione microbot.pdf | Source for MicroBot Home Lab setup, measurement tools, power strategy and component organization |
| prototipo_fisico e fondamento teorico del sistema.pdf | Source for incremental prototype development, LED/ESP32 validation and firmware progression |
| Documentazione_microbot.pdf | Mother context for safety layer, electronics, magnetism, communication, telemetry and scaling |
| MicroBot_Documento_10_Demo_Script_Runbook.pdf | Source for safe demo flow, STOP demonstration and publishable demo outputs |

The public version must be concise and operational. The full internal safety analysis remains in the private documentation base.

## 3. Safety Positioning

MicroBot v0.1 must be treated as a controlled laboratory platform.

It contains low-voltage electronics, ESP32 boards, LEDs, sensors, possible MOSFET-driven loads, magnets, motors, servos, camera modules, serial communication, dashboard controls and simulation.

Even if the prototype is small, unsafe behavior can still damage components, create misleading demo results, overheat parts, lock actuators, corrupt logs, expose private visual data or make debugging unreliable.

The safety layer must be designed from the beginning.

It is not an optional feature to add after the demo.

## 4. Core Safety Principles

| Principle | Meaning | MicroBot Application |
|---|---|---|
| Fail-safe | If system behavior is uncertain, stop instead of continuing | STOP, SAFE_MODE, actuator off, coil off |
| Low power first | Start with the safest power source and lowest energy configuration | USB or power bank before batteries or high-current supplies |
| One module at a time | Test each node separately before integration | Master first, then NODE_01 to NODE_06 |
| Observable system | Every critical state must be visible or logged | LED, OLED, serial log, dashboard, heartbeat, error code |
| No hidden energy | No load remains active without timeout or explicit control | Timeout on servo, motor, coil, camera stream and wireless actions |
| Documented tests | Every important test has procedure, expected result and evidence | Test checklist, log, photo, screenshot or video |
| Manual recovery | Critical states require controlled recovery | RESET or CLEAR_ERROR before returning to operation |
| Public honesty | The repository must state what is implemented, simulated or planned | No exaggerated claims |

## 5. System Boundaries in v0.1

MicroBot v0.1 includes the following system boundaries.

| Element | Included | Main Safety Concern |
|---|---|---|
| PC Controller | Dashboard, command panel, terminal, logs and simulation bridge | Wrong command, UI freeze, missing STOP |
| ESP32 Master | Routing, heartbeat, node table, global state and emergency logic | Firmware freeze, lost communication, stale node state |
| NODE_01_LED_STATE | LED or NeoPixel state output | Wrong resistor, GPIO overcurrent, short circuit |
| NODE_02_PROXIMITY_SAFETY | Distance sensor and warning state | False readings, wrong thresholds, unsafe reaction |
| NODE_03_MAGNETIC_DOCKING | Hall sensor, magnets and future coil logic | Coil heat, magnetic attraction, MOSFET errors |
| NODE_04_MOTION_ACTUATOR | Servo, vibration motor or small motion unit | Unexpected movement, blocked servo, bad power |
| NODE_05_TELEMETRY_SENSOR | IMU, OLED, current or environmental telemetry | Misread data, misleading dashboard state |
| NODE_06_VISION_CAMERA | ESP32-CAM or camera status module | Stream privacy, camera power draw, uncontrolled recording |
| Dashboard | Control, state, log, safety panel and emergency stop | Hidden errors, unsafe command still enabled |
| Simulation | 3D/4D/5D/6D state visualization | Hiding real hardware faults or overstating results |

Out of scope for v0.1:

| Out of Scope | Reason |
|---|---|
| Certified product safety | v0.1 is a laboratory prototype |
| Human-contact robot testing | The prototype is not ready for physical interaction with people |
| High-current electromagnets | Start with passive magnets and Hall sensing first |
| Custom Li-Po integration | Use USB/power bank until the system is stable |
| Full autonomous swarm | First validate PC -> Master -> node -> telemetry -> simulation |
| Real biometric database | Not required and not appropriate for public v0.1 |

## 6. Risk Classification

Risks should be classified using probability and impact.

| Level | Probability | Impact | Example |
|---|---|---|---|
| 1 | Rare | Negligible | Incomplete log, wrong label |
| 2 | Possible | Low | Sensor noise, node offline |
| 3 | Probable | Medium | Servo instability, firmware crash, false warning |
| 4 | Frequent | High | Hot coil, low battery, breadboard short |
| 5 | Very frequent or uncontrolled | Critical | Non-stoppable command, overheating, battery damage |

Priority rule:

| Priority | Condition | Required Action |
|---|---|---|
| Low | Low probability and low impact | Document and monitor |
| Medium | Medium probability or medium impact | Add test or software protection |
| High | High probability or high impact | Fix before integration |
| Critical | Thermal, power or non-stoppable behavior | Stop test until mitigation exists |

If a risk cannot be described, it cannot be controlled.

## 7. Electrical Safety

The first practical risks are electrical.

| Risk | Cause | Mitigation |
|---|---|---|
| ESP32 GPIO exposed to 5V | Sensor or module output not level-compatible | Use 3.3V modules, level shifter or voltage divider |
| LED without resistor | Direct connection to GPIO | Use 220-330 ohm resistor for standard LEDs |
| Servo powered from ESP32 logic pin | Wrong power path | Use external 5V supply or power bank and common GND |
| GND not common | Separate supplies without shared reference | Connect ESP32 GND and external supply GND |
| Breadboard short | Confused rails or crossed jumpers | Visual check, multimeter and gradual power-up |
| Loose jumper | Unstable contact | Label wires and use shorter connections when possible |
| Inductive load without protection | Motor, coil or electromagnet controlled incorrectly | Use MOSFET, flyback diode and timeout |

Laboratory rule:

Before applying power, check polarity, voltage and GND.

If a component heats unexpectedly, stop immediately.

## 8. Power and Battery Safety

The safest v0.1 power strategy is incremental.

| Stage | Recommended Power | Reason |
|---|---|---|
| Firmware test | USB from PC | Serial debug and limited current |
| Node test | Power bank 5V | Stable and still relatively safe |
| Servo or motor test | External 5V supply | Avoid ESP32 resets and voltage drops |
| Mockup aesthetic test | No real battery or dummy battery | Avoid unnecessary energy risk |
| Compact prototype | Protected Li-Po or Li-ion only later | Requires charger, protection and thermal awareness |

Battery rules:

| Rule | Reason |
|---|---|
| Do not begin with Li-Po integration | Too many variables at early stage |
| Do not hide batteries inside a compact shell before testing | Heat and wiring issues become harder to inspect |
| Use protected modules and safe charging boards | Prevent overdischarge and unsafe charging |
| Add LOW_POWER and SAFE_MODE states | Avoid running loads under unstable voltage |
| Document every power source | Reproducibility and safety |

## 9. Magnetic and Coil Safety

NODE_03_MAGNETIC_DOCKING must be introduced in stages.

Stage 1:

Use passive magnets and Hall sensors only.

Stage 2:

Measure magnetic readings and docking thresholds.

Stage 3:

Add MOSFET-driven coil or electromagnet only after the detection logic works.

Stage 4:

Add timeout, duty cycle limit, flyback diode and current monitoring.

| Risk | Mitigation |
|---|---|
| Coil overheating | Short activation, timeout and duty cycle limit |
| MOSFET wrong wiring | Gate resistor, pull-down and wiring review |
| Flyback spike | Flyback diode across inductive load |
| Uncontrolled attraction | Small magnets first, clear test area |
| Magnetic interference | Keep magnets away from sensitive components when not needed |
| Continuous coil activation | Firmware timeout and dashboard warning |

Rule:

Do not drive coils or electromagnets directly from ESP32 GPIO pins.

## 10. Motion and Actuator Safety

NODE_04_MOTION_ACTUATOR should start with controlled and low-energy movement.

| Risk | Indicator | Response |
|---|---|---|
| Servo blocked | Buzzing, heat or no movement | Send MOTION_STOP and remove mechanical load |
| ESP32 resets | Brownout or USB disconnect | Use external 5V and capacitor |
| Unexpected motion | Wrong command or slider value | Add angle limits and visible STOP |
| Vibration motor stuck on | Motor continues after command | Firmware timeout and STOP |
| Loose part | Arm or support detaches | Test slowly and keep area clear |

Motion rules:

| Rule | Meaning |
|---|---|
| Every actuator command needs duration or timeout | No indefinite movement |
| Use low speed first | Avoid sudden motion |
| Use small angle range first | Validate control before full sweep |
| STOP must override motion | Safety has priority over demo |
| External actuator power must be stable | Avoid resets and false behavior |

## 11. Sensor and Telemetry Safety

Sensors can fail quietly.

A wrong sensor value can be as dangerous as no sensor value.

| Sensor Area | Risk | Mitigation |
|---|---|---|
| Distance sensor | False SAFE or false DANGER | Conservative thresholds and filtering |
| Hall sensor | False docking detection | Calibration and repeated reading |
| IMU | Noisy or drifting values | Range checks and smoothing |
| Current sensor | Misread current | Calibration and fallback state |
| OLED display | Wrong displayed status | Use dashboard and serial log as source of truth |
| Camera | Stream active without awareness | Visible stream indicator and explicit start/stop |

Telemetry rules:

| Rule | Meaning |
|---|---|
| Sensor data must include units | distance_mm, current_ma, temperature_c |
| Bad readings must have error states | SENSOR_ERROR, RANGE_ERROR or UNKNOWN |
| Dashboard must not hide invalid data | Show warning instead of fake normality |
| Simulation must reflect uncertainty | Unknown state should not look healthy |

## 12. Camera, Vision and Privacy

NODE_06_VISION_CAMERA introduces information risk.

For public v0.1, the camera must be treated as a controlled vision/status module.

| Risk | Public v0.1 Rule |
|---|---|
| Stream active without consent | STREAM_ON must be explicit and visible |
| Face data stored unnecessarily | Do not store real biometric data in public v0.1 |
| Landmark misuse | Use temporary overlay only, no database |
| Recording people in public | Use controlled scene or prototype objects |
| Camera permission denied | Dashboard should fallback without crashing |
| Camera stream stuck active | STOP_STREAM and timeout required |

Privacy rule:

The camera node should demonstrate vision status, not collect private identity data.

## 13. Firmware Safety Layer

The firmware should include a safety layer separate from ordinary behavior logic.

The safety layer must run before normal commands inside the main loop.

Minimum state machine:

| State | Description | Allowed Actions |
|---|---|---|
| BOOT | Startup and diagnostics | Initialize serial, sensors and parameters |
| READY | System initialized but not active | PING, STATUS, CALIBRATE, START |
| RUNNING | Normal command execution | Allowed commands with limits |
| WARNING | Non-critical anomaly | Reduce activity, log and request check |
| SAFE_MODE | Degraded controlled condition | Disable actuators, keep telemetry |
| EMERGENCY | Critical condition | Stop actuators, coil and motion; require manual reset |
| OFFLINE | Node not responding | Block commands and mark dashboard state |

Transition rule:

From ERROR, SAFE_MODE or EMERGENCY, the system should not return directly to RUNNING without reset, clear error or manual confirmation.

## 14. Heartbeat, Timeout and Watchdog

The system must detect lost communication.

| Mechanism | Recommended v0.1 Value | Purpose |
|---|---:|---|
| Master heartbeat | 1000 ms | Confirm Master is alive |
| Node heartbeat | 1000-2000 ms | Confirm node is alive |
| Node warning timeout | 3000 ms | Mark node suspicious |
| Node offline timeout | 5000 ms | Mark node OFFLINE |
| Coil timeout | 500-2000 ms | Prevent heat |
| Servo command timeout | 1000-3000 ms | Prevent indefinite movement |
| Camera stream timeout | Defined per demo | Avoid uncontrolled stream |
| Watchdog | Enabled on Master and critical nodes | Recover from firmware freeze |

Timeout rule:

A node must be able to stop dangerous behavior locally even if the PC or Master connection is lost.

## 15. Communication Safety

The protocol must support safe command execution.

| Problem | Example | Protection |
|---|---|---|
| Duplicate command | SET_SERVO_ANGLE repeated | Sequence number and idempotent behavior |
| Old command | Late packet arrives | Timestamp or sequence rejection |
| Unknown command | Typo or wrong UI button | UNKNOWN_COMMAND error |
| Invalid payload | Missing duration or invalid angle | INVALID_PAYLOAD error |
| Offline node | No STATUS response | OFFLINE and block critical commands |
| Dangerous broadcast | START sent to all nodes | Confirmation and safe default |
| Lost connection | PC closed during actuation | Local timeout and STOP behavior |
| Corrupted JSON | Invalid packet | Controlled parser failure and log event |

Every critical command should produce an explicit response.

No silent failures.

## 16. Dashboard Safety

The dashboard is part of the safety layer.

It must include:

| Dashboard Safety Feature | Purpose |
|---|---|
| Always-visible STOP | Immediate manual intervention |
| Emergency stop | Global high-priority stop |
| Master state indicator | Shows READY, WARNING, SAFE_MODE or EMERGENCY |
| Node online/offline indicators | Prevent commands to missing nodes |
| Error log | Makes faults visible |
| Safety panel | Central view of warnings, timeouts and emergency states |
| Disabled critical commands | Prevent unsafe action when disconnected |
| Demo mode safeguards | Avoid accidental unsafe commands during presentation |
| Raw terminal | Debug unexpected packets |

Dashboard rule:

If the dashboard loses connection, hardware should still enter or remain in a safe state through local timeouts.

## 17. Simulation Safety

The simulation must not make the system look safer than it is.

| Real or Protocol State | Simulation Behavior |
|---|---|
| NORMAL | Normal visual state |
| WARNING | Yellow warning state |
| SAFE_MODE | Locked or protected overlay |
| EMERGENCY | Global red stop overlay |
| OFFLINE | Greyed-out node |
| SENSOR_ERROR | Sensor warning icon |
| TARGET_OFFLINE | Node disabled visually |
| UNSAFE_COMMAND | Command rejected visually |
| TIMEOUT | Heartbeat warning |

Simulation rule:

If the protocol reports warning, error, offline, safe mode or emergency, the simulation must show it.

Never display a healthy visual state when the telemetry says otherwise.

## 18. Laboratory Procedure

Every physical test should follow a repeatable procedure.

| Step | Action |
|---:|---|
| 1 | Define the node and behavior to test |
| 2 | Check wiring, polarity, voltage and GND |
| 3 | Open dashboard in OFFLINE or SAFE mode |
| 4 | Connect Master and verify PING/STATUS |
| 5 | Execute one command at a time |
| 6 | Observe LED, OLED, serial log, dashboard and temperature |
| 7 | Press STOP and verify that the node really stops |
| 8 | Save notes, log, photos or screenshots |
| 9 | Mark PASS, FAIL, PARTIAL or BLOCKED |
| 10 | Fix issue before integration |

Lab rule:

Do not integrate a node into the system until it passes its individual test.

## 19. Demo Safety Procedure

A public demo should be short, controlled and repeatable.

Before demo:

| Check | Required |
|---|---|
| Workbench clean | yes |
| Power source known | yes |
| Mockup separated from powered prototype if needed | yes |
| Dashboard opens without errors | yes |
| STOP button visible | yes |
| Master READY | yes |
| Node table prepared | yes |
| Camera privacy checked | yes |
| Log output folder ready | yes |
| Fallback plan ready | yes |

During demo:

| Rule | Meaning |
|---|---|
| Do not improvise unsafe commands | Follow runbook |
| Show state before actuation | Viewer sees system readiness |
| Keep actuators short | Avoid heat or mechanical stress |
| Show STOP | Safety is part of the demo |
| Use controlled camera scene | No accidental recording |
| Export or show log | Demo becomes evidence |

After demo:

| Output | Purpose |
|---|---|
| Screenshot | README and portfolio |
| Short video | LinkedIn, website or pitch |
| Log file | Validation evidence |
| Notes | What worked and what failed |
| Issue list | Next improvements |

## 20. Failure Mode and Effects Summary

| Failure Mode | Effect | Detection | Mitigation |
|---|---|---|---|
| Master freeze | No routing or telemetry | Missing heartbeat | Watchdog and dashboard warning |
| Node offline | Missing function | Timeout | Mark OFFLINE and block critical commands |
| Servo stuck | Motion does not stop | Current, sound or no response | STOP and power removal |
| Coil overheats | Thermal risk | Time, current or touch-free observation | Timeout, duty cycle and lower current |
| Sensor false reading | Wrong safety state | Range check and repeated reading | Filter and conservative threshold |
| Camera unavailable | Demo failure | CAMERA_STATUS error | Fallback offline camera state |
| Dashboard crash | Operator loses control | UI freeze or disconnect | Local timeouts and Master safety |
| Bad JSON | Command ignored or misread | Parser error | Reject and log |
| Power instability | Reset or wrong behavior | Brownout, reboot or current drop | Separate power and capacitors |
| Misleading simulation | Wrong public interpretation | State mismatch | Simulation follows protocol, not manual assumptions |

## 21. Corrective Action Register

Every relevant problem should be recorded.

Recommended future file:

docs/safety_corrective_action_register_v0_1.md

Suggested fields:

| Field | Meaning |
|---|---|
| ID | Unique issue ID |
| Date | When issue appeared |
| Module | Master, node, dashboard, simulation or lab |
| Risk | What could go wrong |
| Severity | Low, medium, high or critical |
| Cause | Suspected root cause |
| Immediate action | What was done immediately |
| Long-term fix | What should change |
| Status | Open, fixed, postponed or accepted |
| Evidence | Photo, log, screenshot or video |

## 22. Public GitHub Safety Statement

Recommended public statement:

MicroBot Labs v0.1 is an experimental laboratory platform. It is not a commercial or certified robotic product. All hardware tests are performed with low-voltage components, staged integration, visible system states, heartbeat monitoring, timeout logic, safe mode and emergency stop procedures.

Recommended public statement:

The safety layer is part of the architecture. It includes firmware states, dashboard warnings, STOP commands, offline detection, telemetry logging and controlled demo procedures.

Avoid:

This prototype is safe for any environment.

Avoid:

The robot can operate autonomously around people.

Avoid:

The camera module is a finished biometric security system.

Avoid:

Electromagnetic docking is ready for uncontrolled high-current tests.

## 23. Release Gate for Public Sharing

Before public sharing, MicroBot v0.1 should pass this release gate.

| Gate | Required |
|---|---|
| README includes safety note | yes |
| BOM includes MOSFET/flyback/power notes | yes |
| Protocol includes STOP and EMERGENCY_STOP | yes |
| Dashboard spec includes visible STOP | yes |
| Testing checklist includes safety tests | yes |
| Simulation shows errors/offline states | yes |
| Camera privacy statement exists | yes |
| No private biometric data included | yes |
| No misleading safety claims | yes |
| No unsafe wiring photos without warning | yes |
| No high-current coil demo without protection | yes |

## 24. Safety Roadmap

| Version | Safety Focus |
|---|---|
| v0.1 | USB/power bank, low-power nodes, STOP, timeout and manual checklist |
| v0.2 | Compact nodes, current measurement, battery monitoring and better enclosure |
| v0.3 | First integrated MicroBot, watchdog, thermal modeling and protected power |
| v0.4 | Multi-node swarm, wireless interlock, safe docking and distributed logs |
| v0.5 | Demo platform, safety report, repeated tests and design review |
| v1.0 | Stable educational demonstrator with reproducible setup and clear limits |

## 25. Next Implementation Step

After this file, the next public document should be:

docs/demo_runbook_v0_1.md

That file should define the actual public demo sequence:

1. Concept and mockup.
2. Dashboard startup.
3. Master connection.
4. Node scan.
5. NODE_01 state.
6. NODE_02 proximity.
7. NODE_03 docking.
8. NODE_04 motion.
9. NODE_05 telemetry.
10. NODE_06 vision.
11. Simulation update.
12. STOP and safety.
13. Roadmap and GitHub output.

The safety summary defines how MicroBot remains controlled.

The demo runbook defines how MicroBot is shown clearly.

## 26. Version Notes

Version: v0.1  
Repository: microbot-labs  
Document role: Public risk and safety summary  
Project phase: Pre-startup foundation / physical demonstrator planning  
Main scope: safety philosophy, electrical protection, power, magnets, actuators, firmware, communication, dashboard, simulation, lab procedure and demo safety  
Next document: demo_runbook_v0_1.md
