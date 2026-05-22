# MicroBot Labs — Hardware Bill of Materials v0.1

## 1. Purpose

This document defines the first public hardware bill of materials for MicroBot Labs v0.1.

The purpose of this BOM is not to describe a final industrial micro-robot. The purpose is to define the material required to build a realistic, documented and testable MicroBot v0.1 laboratory demonstrator.

MicroBot v0.1 must validate the first operational chain:

PC Controller -> ESP32 Master -> MicroBot Nodes -> Telemetry -> Dashboard -> Simulation

The BOM is designed to support three connected goals.

First, it must allow the construction of a basic physical control chain based on ESP32 modules.

Second, it must support six specialized node prototypes: LED state, proximity safety, magnetic docking, motion actuator, telemetry sensor and vision camera.

Third, it must support a small but serious MicroBot Home Lab, where each prototype can be measured, powered, tested, documented, photographed and improved.

This file is the public GitHub version of the BOM. It is intentionally cleaner and more compact than the internal documentation.

## 2. Public Scope of MicroBot v0.1

MicroBot v0.1 is a laboratory demonstrator.

It is composed of:

| Element | Function |
|---|---|
| PC Controller | User interface, dashboard, logs, command panel and simulation bridge |
| NODE_00_MASTER | Central ESP32 controller for routing commands and collecting node status |
| NODE_01_LED_STATE | Visual state node for IDLE, ACTIVE, DOCKING, WARNING and ERROR states |
| NODE_02_PROXIMITY_SAFETY | Distance and safety node |
| NODE_03_MAGNETIC_DOCKING | Magnetic detection and docking prototype |
| NODE_04_MOTION_ACTUATOR | Servo, vibration or simple motion actuator node |
| NODE_05_TELEMETRY_SENSOR | IMU, OLED and sensor telemetry node |
| NODE_06_VISION_CAMERA | ESP32-CAM vision and camera-status node |
| Dashboard | Control, observation, telemetry, log and emergency stop interface |
| Simulation Layer | Visual representation of physical and simulated node states |
| Physical Mockup | Black MicroBot design mockup for presentation and CAD direction |

The v0.1 system does not attempt to build a fully miniaturized swarm robot immediately. It separates the functional prototype from the visual mockup. The functional prototype may be larger, wired and easier to debug. The visual mockup represents the intended future design.

## 3. MicroBot Home Lab Principle

The MicroBot Home Lab must be treated as a complete technical environment, not as a random collection of components.

The lab must include:

| Lab Area | Purpose |
|---|---|
| Electronics | ESP32 boards, sensors, LEDs, MOSFETs, diodes, resistors and modules |
| Measurement | Multimeter, current sensor, controlled checks and test logs |
| Power | USB power, power bank, bench power supply, buck converters and protected power lines |
| Soldering | Soldering iron, solder, flux, desoldering braid and heat shrink tubing |
| Mechanical setup | Screws, spacers, supports, test base, enclosures and mounting material |
| Documentation | Photos, videos, diagrams, build logs, reports and GitHub-ready assets |
| Organization | Labeled boxes, node-specific component bags and physical inventory |

The central rule is simple:

The project must not only make circuits work. It must create prototypes that are documented, photographed, filmed and described professionally.

## 4. Budget Levels

There are two budget views.

The first view is the prototype-only BOM. This is the minimum material required to build the MicroBot v0.1 architecture with Master, nodes, dashboard and mockup.

The second view is the Home Lab budget. This includes tools, measurement equipment, soldering material, organization and documentation material.

## 4.1 Prototype-only budget

| Version | Estimated Cost | Purpose |
|---|---:|---|
| Minimum prototype | 120-180 EUR | Start with Master, NODE_01 and basic sensors |
| Complete prototype | 250-350 EUR | Build Master and six separated nodes |
| Serious demo prototype | 350-500 EUR | Add replacements, better power, mechanical support and mockup material |

## 4.2 Home Lab budget

| Version | Estimated Cost | Purpose |
|---|---:|---|
| Minimum serious lab | 280-420 EUR | ESP32, breadboards, sensors, multimeter, soldering tools and basic modules |
| Recommended complete lab | 450-750 EUR | Adds bench power supply, MOSFETs, diodes, buck converters, Hall sensors, current sensors, motor driver, robot frame, emergency stop and organization material |
| Advanced lab | 650-950 EUR | Adds extra sensors, extra ESP32 boards, logic analyzer, more mechanical material, extra robotics modules and spare parts |

The recommended path is not to buy everything at once. The correct path is incremental: first build the PC -> Master -> NODE_01 chain, then add proximity and docking, then motion and telemetry, then camera, then physical mockup and demo stabilization.

## 5. Core Tools

These tools should be considered part of the laboratory foundation.

| Item | Quantity | Priority | Purpose |
|---|---:|---|---|
| Digital multimeter | 1 | High | Measure voltage, continuity and basic electrical faults |
| Adjustable bench power supply | 1 | Medium/High | Controlled power for safer testing |
| Soldering iron with temperature control | 1 | High | Move from breadboard prototypes to stable wiring |
| Solder wire | 1 | High | Basic soldering |
| Flux | 1 | Medium | Cleaner solder joints |
| Desoldering braid or pump | 1 | Medium | Repair mistakes |
| Heat shrink tubing kit | 1 | Medium | Protect wires and solder joints |
| Helping hands or PCB holder | 1 | Medium | Safer soldering and assembly |
| Safety glasses | 1 | High | Basic eye protection |
| Antistatic or insulating mat | 1 | Medium | Safer electronics workbench |
| Component organizer boxes | 3-6 | High | Separate ESP32, sensors, resistors, wires, magnets and screws |
| Labels | 1 pack | High | Identify node boxes and component groups |

## 6. Core Electronic Material

| Item | Quantity | Priority | Notes |
|---|---:|---|---|
| ESP32 DevKit boards | 5-7 | High | Minimum 3 to start, 7 for Master plus six nodes |
| ESP32-CAM | 1 | Medium/High | Required for NODE_06 |
| FTDI programmer for ESP32-CAM | 1 | Medium/High | Needed to program ESP32-CAM |
| Breadboard 830-point | 2-3 | High | Main prototyping boards |
| Mini breadboards | 4-6 | Medium | Node-level experiments |
| Jumper wire kit | 1 large kit | High | Male-male, male-female and female-female |
| USB data cables | 3-7 | High | Must support data, not only charging |
| Resistor kit | 1 | High | LED protection, dividers, pull-ups and pull-downs |
| Capacitor kit | 1 | Medium | Decoupling and stabilization |
| Push buttons | 10+ | Medium | Manual input and reset tests |
| Switches | 5+ | Medium | Power and mode selection |
| LED kit | 1 | High | State indicators |
| RGB LED or NeoPixel modules | 3+ | High | NODE_01 and visual state feedback |
| Pin headers male/female | 1 kit | Medium | Soldered modules and stable prototypes |
| Perfboard / millefori | 5+ | Medium | More stable node builds after breadboard |
| Heat shrink tubing | 1 kit | Medium | Wire protection |

## 7. NODE_00_MASTER Material

NODE_00_MASTER is the central ESP32 controller.

Its role is to receive commands from the PC Controller, route commands to the nodes, collect node responses, maintain global state and expose telemetry to the dashboard.

| Item | Quantity | Purpose |
|---|---:|---|
| ESP32 DevKit | 1 | Master controller |
| OLED SSD1306 I2C display | 1 | Local status display |
| Status LED or RGB LED | 1 | Master state indication |
| Push buttons | 2-3 | Reset, mode and emergency input prototype |
| Breadboard or perfboard | 1 | Assembly |
| USB data cable | 1 | Programming and serial communication |
| Jumper wires | as needed | Wiring |
| Optional enclosure or base | 1 | Cleaner bench setup |

Minimum outputs:

| Output | Success Criteria |
|---|---|
| PING response | PC sends PING and Master replies |
| STATUS response | Master returns system state |
| Node table placeholder | Master lists expected nodes |
| Error state | Master can report ERROR or OFFLINE |
| Emergency stop input | STOP can be triggered from dashboard or button in later versions |

## 8. NODE_01_LED_STATE Material

NODE_01_LED_STATE validates the first physical output of MicroBot.

It represents node identity, state and simple system feedback through LEDs.

| Item | Quantity | Purpose |
|---|---:|---|
| ESP32 DevKit | 1 | Node controller |
| RGB LED or NeoPixel | 1-3 | State feedback |
| Resistors | as needed | LED protection if using standard LEDs |
| Breadboard or mini breadboard | 1 | Prototype wiring |
| Jumper wires | as needed | Wiring |
| Optional OLED | 1 | Node ID and status display |

Expected states:

| State | Visual Meaning |
|---|---|
| IDLE | Node powered but inactive |
| ACTIVE | Node executing command |
| DOCKING | Node entering docking or coupling mode |
| WARNING | Non-critical anomaly |
| ERROR | Fault or invalid condition |
| OFFLINE | Node not responding, represented in dashboard |

NODE_01 is the first practical milestone because it proves that a software command can become a physical, observable state.

## 9. NODE_02_PROXIMITY_SAFETY Material

NODE_02_PROXIMITY_SAFETY validates environmental sensing and safety thresholds.

| Item | Quantity | Purpose |
|---|---:|---|
| ESP32 DevKit | 1 | Node controller |
| VL53L0X Time-of-Flight sensor | 1 | Preferred distance sensor |
| HC-SR04 ultrasonic sensor | optional | Alternative distance sensor, requires level attention |
| Buzzer | 1 | Warning signal |
| Warning LED | 1 | Safety indication |
| Resistors | as needed | Protection and dividers |
| Breadboard or perfboard | 1 | Assembly |
| Jumper wires | as needed | Wiring |

Recommended approach:

Use VL53L0X first if possible, because it is compact and easier to integrate with ESP32 logic levels. Use HC-SR04 only if there is enough space and proper level shifting or voltage division is used.

Expected outputs:

| Output | Success Criteria |
|---|---|
| Distance reading | Node returns distance in millimeters or centimeters |
| SAFE state | Distance is above threshold |
| WARNING state | Distance approaches threshold |
| DANGER state | Distance below critical threshold |
| Dashboard update | Safety status appears in dashboard |

## 10. NODE_03_MAGNETIC_DOCKING Material

NODE_03_MAGNETIC_DOCKING validates the first physical concept related to coupling, docking and future programmable matter.

In v0.1, this node should start with sensing and detection. Active coils or electromagnets must be tested only after MOSFETs, flyback diodes, current limits and timeouts are understood.

| Item | Quantity | Purpose |
|---|---:|---|
| ESP32 DevKit | 1 | Node controller |
| Hall sensor A3144 or SS49E | 1-3 | Detect magnetic field |
| Small magnets | several | Passive docking test |
| MOSFET logic-level | 1-3 | Future coil or electromagnet driving |
| Flyback diodes | 1-3 | Protection for inductive loads |
| Resistors | as needed | Gate pull-down and signal conditioning |
| Optional 5V electromagnet | 1 | Only for controlled later tests |
| External 5V supply or power bank | 1 | Separate power for loads |
| Breadboard or perfboard | 1 | Assembly |

Expected outputs:

| Output | Success Criteria |
|---|---|
| MAGNET_NEAR | Hall sensor detects magnetic field |
| DOCKED | Sensor threshold confirms docking condition |
| Magnetic value | Raw or normalized magnetic reading |
| Dashboard update | Docking state appears in dashboard |
| Safety timeout | Coil or electromagnet cannot remain active indefinitely |

Safety note:

Do not drive coils, motors or electromagnets directly from ESP32 GPIO pins. Use MOSFETs, flyback diodes, separate power and timeout logic.

## 11. NODE_04_MOTION_ACTUATOR Material

NODE_04_MOTION_ACTUATOR validates controlled physical action.

| Item | Quantity | Purpose |
|---|---:|---|
| ESP32 DevKit | 1 | Node controller |
| SG90 servo | 1 | Basic controlled motion |
| Vibration motor | 1 | Simple actuation feedback |
| MOSFET logic-level | 1 | Motor control |
| Flyback diode | 1 | Inductive protection if needed |
| External 5V supply | 1 | Servo and motor power |
| Capacitor | 1-2 | Power stabilization |
| Breadboard or perfboard | 1 | Assembly |
| Jumper wires | as needed | Wiring |

Expected outputs:

| Output | Success Criteria |
|---|---|
| Servo angle command | Servo moves to controlled angle |
| Vibration command | Motor activates briefly |
| Timeout | Motion cannot continue indefinitely |
| Dashboard state | Motion state is visible |
| STOP response | Node stops movement immediately |

Safety note:

Servos and motors should use external 5V power. ESP32 and actuator power must share a coherent GND reference, but actuator current must not pass through ESP32 power pins.

## 12. NODE_05_TELEMETRY_SENSOR Material

NODE_05_TELEMETRY_SENSOR validates observability.

| Item | Quantity | Purpose |
|---|---:|---|
| ESP32 DevKit | 1 | Node controller |
| MPU6050 IMU | 1 | Acceleration and gyroscope data |
| OLED SSD1306 I2C display | 1 | Local telemetry display |
| Optional BME280 | 1 | Environmental telemetry |
| Optional INA219 current sensor | 1 | Power/current telemetry |
| Breadboard or perfboard | 1 | Assembly |
| Jumper wires | as needed | Wiring |

Expected outputs:

| Output | Success Criteria |
|---|---|
| IMU data | Acceleration and gyroscope values are read |
| Local OLED state | Node ID and state displayed |
| Telemetry packet | Sensor values sent to Master or PC |
| Dashboard graph | Telemetry can be visualized |
| Error state | Sensor failure can be reported |

## 13. NODE_06_VISION_CAMERA Material

NODE_06_VISION_CAMERA validates the vision layer.

| Item | Quantity | Purpose |
|---|---:|---|
| ESP32-CAM | 1 | Camera node |
| FTDI programmer | 1 | Programming and serial flashing |
| Stable 5V supply | 1 | ESP32-CAM power |
| Status LED | 1 | Camera state feedback |
| Mount or support | 1 | Stable camera position |
| Optional microSD card | 1 | Local capture tests, if needed |

Expected outputs:

| Output | Success Criteria |
|---|---|
| Camera boot | ESP32-CAM starts reliably |
| Stream test | Camera stream or capture works locally |
| Camera state | Dashboard shows camera status |
| Privacy-safe demo | No real biometric database is used in v0.1 |
| Controlled environment | Camera is tested only on prototype objects or controlled scenes |

Privacy note:

In the public v0.1 project, the camera should be treated as a vision and status module. Real biometric storage or uncontrolled recording of people should not be part of the public demo.

## 14. PC Controller and Dashboard Material

The PC Controller is currently the user's development computer.

No extra computer is required in v0.1.

| Item | Quantity | Purpose |
|---|---:|---|
| Mac or PC | 1 | Development, dashboard, serial monitor and simulation |
| Browser with Web Serial support | 1 | Possible dashboard connection |
| Python environment | 1 | Serial bridge, tools, testing scripts |
| USB data cables | several | Programming and serial communication |
| VS Code | 1 | Development environment |
| Git and GitHub | 1 | Version control and publication |
| Optional webcam | 1 | Dashboard camera tests if ESP32-CAM is not ready |

Raspberry Pi should not be bought immediately. The Mac can already act as controller, dashboard and development machine. Raspberry Pi can be considered later if the project needs a standalone local controller.

## 15. Simulation and Visual Material

The simulation layer does not require special hardware at v0.1.

| Item | Quantity | Purpose |
|---|---:|---|
| Existing Mac or PC | 1 | Run browser, Python or web simulation |
| Web browser | 1 | Dashboard and visual simulation |
| Optional 3D assets | as needed | MicroBot visual representation |
| Screenshots and demo recordings | as needed | Portfolio and GitHub documentation |
| Diagrams | as needed | Explain architecture and demo flow |

The simulation should be treated as a parametric representation of system state. It visualizes position, time, vibration/configuration, energy, information, safety and telemetry. It does not prove new physics. It makes the prototype observable and explainable.

## 16. Mechanical and Mockup Material

The physical MicroBot design should be split into two parallel tracks.

The first track is a small visual mockup. This represents the future design.

The second track is a larger functional prototype. This contains real electronics and is easier to debug.

| Item | Quantity | Purpose |
|---|---:|---|
| Black filament or resin access | as needed | Visual MicroBot mockup |
| Small magnets | several | Passive docking and design tests |
| Screws M2/M3 | kit | Assembly |
| Spacers and standoffs | kit | Stable electronics mounting |
| Acrylic, wood or plastic base | 1 | Test bench |
| Cable ties | 1 pack | Cable management |
| Strong double-sided tape | 1 | Temporary mounting |
| Small boxes or enclosures | 6+ | Node organization |
| Labels | 1 pack | Node identity and component tracking |

Do not buy a 3D printer immediately unless it is clearly useful and budget allows it. At v0.1, external printing, maker spaces or simple mockup methods are enough.

## 17. Documentation and Media Material

Documentation is part of the prototype.

| Item | Quantity | Purpose |
|---|---:|---|
| Smartphone camera | 1 | Photos and demo recording |
| Tripod or phone stand | 1 | Stable video |
| Notebook or digital log | 1 | Build log and test notes |
| GitHub repository | 1 | Public documentation |
| Folder structure | 1 | Organize images, reports, diagrams and tests |
| Labels and node cards | 6+ | Identify each prototype physically |

Every prototype should produce:

| Output | Purpose |
|---|---|
| Photo | Visual proof of construction |
| Short video | Demo and portfolio material |
| Wiring note | Reproducibility |
| Test log | Validation |
| Issue list | Future debugging |
| README section | Public explanation |

## 18. Purchase Phases

The purchase strategy must be incremental.

| Order | Buy | Estimated Cost | Immediate Output |
|---:|---|---:|---|
| 1 | 3 ESP32, breadboards, jumper wires, LEDs, resistors, buttons, OLED | 60-100 EUR | PC -> Master -> NODE_01 first demo |
| 2 | VL53L0X, Hall sensor, magnets, buzzer, extra resistors | 30-70 EUR | NODE_02 proximity and NODE_03 docking |
| 3 | SG90 servo, MPU6050, extra OLED, vibration motor, MOSFET, diodes | 40-90 EUR | NODE_04 motion and NODE_05 telemetry |
| 4 | ESP32-CAM, FTDI, stable 5V supply, camera support | 25-60 EUR | NODE_06 vision |
| 5 | Extra ESP32 boards, spare parts, data cables, power bank, perfboard | 80-150 EUR | Full separated system and stabilization |
| 6 | Black filament or printing service, screws, finishing material, small magnets | 50-150 EUR | Visual MicroBot mockup |

The first milestone should not be the complete system.

The first milestone should be:

PC -> Master ESP32 -> NODE_01 -> Response -> Dashboard log

Once this chain works, every new component adds one real capability.

## 19. Physical Organization

Each node should have a dedicated box or labeled bag.

| Container | Content | Label |
|---|---|---|
| Box 00 | ESP32 Master, OLED, buttons, status LED | NODE_00_MASTER |
| Box 01 | ESP32, RGB LED or NeoPixel, resistors | NODE_01_LED_STATE |
| Box 02 | ESP32, VL53L0X or HC-SR04, buzzer, warning LED | NODE_02_PROXIMITY_SAFETY |
| Box 03 | ESP32, Hall sensor, magnets, optional MOSFET | NODE_03_MAGNETIC_DOCKING |
| Box 04 | ESP32, servo, vibration motor, MOSFET, diodes | NODE_04_MOTION_ACTUATOR |
| Box 05 | ESP32, MPU6050, OLED, optional temperature/current sensor | NODE_05_TELEMETRY_SENSOR |
| Box 06 | ESP32-CAM, FTDI, camera support | NODE_06_VISION_CAMERA |
| Box POWER | Power bank, bench supply accessories, buck converters, battery holders | POWER_SYSTEM |
| Box MECH | Screws, spacers, magnets, shell parts, PLA/resin parts | MECHANICAL_MOCKUP |
| Box DOC | labels, node cards, notes, printed pinouts | DOCUMENTATION |

The physical organization of the lab must match the logical organization of the project.

## 20. Material Not to Buy Immediately

Some components are interesting but should not be part of the first purchase.

| Item | Reason to delay |
|---|---|
| Real EEG device | NeuroBridge should begin with simulated commands or public datasets |
| Raspberry Pi | The Mac or PC is enough for v0.1 dashboard and controller |
| 3D printer | External printing or simple mockups are enough at the beginning |
| Oscilloscope | Useful later, but not required for first ESP32, LED and sensor tests |
| Expensive custom PCB | Breadboard and perfboard are better for early debugging |
| High-current electromagnets | Start with Hall sensors and small magnets before active coil tests |
| Large batteries | Begin with USB, power bank and controlled low-power testing |

The correct strategy is to buy only what helps the next validation step.

## 21. Safety Rules for the BOM

MicroBot v0.1 must be built using safety as a design layer.

| Rule | Practical Meaning |
|---|---|
| Low power first | Start with USB or power bank before custom batteries |
| One module at a time | Test Master and each node separately before integration |
| Observable system | Every state must be visible through LED, serial log, OLED or dashboard |
| No hidden energy | Coils, motors and camera must not remain active without timeout |
| Fail-safe behavior | If behavior is unclear, stop the system |
| Emergency stop | STOP must be available in dashboard and later on physical Master |
| Protected inductive loads | Motors, coils and electromagnets require MOSFETs and flyback diodes |
| Common GND | ESP32 and external loads need coherent ground reference |
| Documented tests | Each test must have input, expected output and result |

## 22. Minimum First Build

The minimum first build is:

| Element | Material |
|---|---|
| PC Controller | Existing Mac or PC |
| Master | ESP32 DevKit |
| Node | ESP32 DevKit or shared ESP32 prototype |
| Output | RGB LED or NeoPixel |
| Interface | Serial monitor or simple dashboard |
| Power | USB cable |
| Documentation | README, photo, test log |

Minimum test:

1. Connect ESP32.
2. Upload firmware.
3. Send PING.
4. Receive response.
5. Send SET_STATE ACTIVE.
6. LED changes state.
7. Dashboard or serial log records the event.
8. STOP returns the node to safe state.

This is enough to prove the first MicroBot chain.

## 23. Next Implementation Step

After this BOM, the next public document should be:

docs/communication_protocol_v0_1.md

That document will define:

| Area | Content |
|---|---|
| Node IDs | NODE_00_MASTER to NODE_06_VISION_CAMERA |
| Commands | PING, STATUS, SET_STATE, START, STOP, RESET, CALIBRATE |
| States | BOOT, READY, RUNNING, WARNING, SAFE_MODE, EMERGENCY, OFFLINE |
| Telemetry | Node status, sensor values, errors, timestamps |
| Safety | Heartbeat, timeout, sequence number, emergency stop |
| Dashboard mapping | How messages update panels, logs and simulation |

The BOM defines what must exist physically.

The communication protocol defines how the system speaks.

## 24. Version Notes

Version: v0.1  
Repository: microbot-labs  
Document role: Public GitHub hardware BOM  
Project phase: Pre-startup foundation / physical demonstrator planning  
Main scope: Master ESP32, six node prototypes, dashboard, simulation, safety and Home Lab organization  
Next document: communication_protocol_v0_1.md
