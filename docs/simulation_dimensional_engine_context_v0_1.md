# MicroBot Labs — Simulation and Dimensional Engine Context v0.1

## 1. Purpose

This document defines the public simulation and dimensional engine context for MicroBot Labs v0.1.

The goal is to explain how MicroBot can map physical node states, telemetry, firmware events, safety conditions and dashboard commands into a visual simulation layer.

The simulation layer is not a replacement for hardware. It is an observability layer.

It helps the project answer a practical question:

What is the distributed MicroBot system doing, and how can that behavior be represented clearly before the final miniaturized swarm exists?

The first operational chain is:

PC Controller -> Dashboard -> Protocol -> NODE_00_MASTER -> Nodes -> Telemetry -> Simulation Engine -> Visual State

This document must keep the project technically strong and scientifically careful. It must support the vision of MicroBot without making unsupported claims about physical higher dimensions.

## 2. Source Alignment

This file is aligned with the internal MicroBot documentation base.

The main internal sources behind this public document are:

| Source Document | Role in this file |
|---|---|
| MicroBot_Documento_06_Simulation_Dimensional_Engine_Specification.pdf | Primary source for the simulation engine, 3D/4D/5D/6D mapping and hardware-simulation bridge |
| Senza nome.pdf | Theoretical source for dimensions from 4D to 16D, with methodological distinction between mathematics, physics, information and visualization |
| Documentazione_microbot.pdf | Mother document for MicroBot architecture, simulation software, telemetry, safety, swarm behavior and system vision |
| prototipo_fisico e fondamento teorico del sistema.pdf | Source for the transition from theory to LED/ESP32 prototype, firmware, telemetry and observable behavior |
| MicroBot_Documento_05_PC_Controller_Dashboard_Specification.pdf | Source for dashboard-to-simulation integration |
| MicroBot_Documento_04_Firmware_Communication_Protocol.pdf | Source for commands, states, telemetry, heartbeat and error mapping |
| MicroBot_Documento_07_Testing_Validation_Plan.pdf | Source for simulation testing and validation logic |
| MicroBot_Documento_09_Risk_Safety_Document.pdf | Source for safety visualization, timeout, safe mode and emergency state |
| MicroBot_Roadmap_6_Mesi_Prototipi_Reali.pdf | Source for the six-month path toward an integrated hardware, dashboard and simulation demo |

The public repository must not publish the full private archive. It must publish the clean and defensible version of the architecture.

## 3. External Research Anchors

This file also uses public technical references as design anchors.

These references do not replace the MicroBot documentation. They help position the implementation with technologies and practices already used in robotics, visualization and browser-based hardware interaction.

| External Reference Area | Why It Matters for MicroBot |
|---|---|
| Three.js | Useful reference for browser-based 3D visualization, scene graph, camera, renderer, meshes and animation loops |
| Web Serial API | Useful reference for direct browser communication with serial devices and microcontrollers in a supported secure browser context |
| ROS / RViz | Useful conceptual reference for robot-state visualization and 3D inspection of robotic systems |
| Gazebo / robotics simulation | Useful conceptual reference for sensor, actuator, robot and environment simulation |
| WebGL / Canvas / SVG | Useful low-level web visualization references for rendering, overlays and diagnostic panels |
| Scientific visualization and digital twin concepts | Useful conceptual references for representing physical system state in a virtual counterpart |
| Multi-agent and swarm simulation literature | Useful references for virtual agents, local rules, emergent behavior and scalable node visualization |
| State-space modeling and high-dimensional data | Useful references for treating dimensions as variables, features, parameters or coordinates of system state |

Important rule:

External research must strengthen the implementation, not inflate the claims.

## 4. Public Positioning

MicroBot Labs uses dimensional language as a computational, visual and state-modeling framework.

The correct public statement is:

MicroBot Labs uses a parametric simulation model where physical and virtual node states can be represented through spatial position, time evolution, configuration, vibration, energy, information, docking, communication and safety variables.

The incorrect public statement is:

MicroBot physically proves higher dimensions.

The public repository must always distinguish:

| Category | Meaning |
|---|---|
| Mathematical dimension | Coordinate or degree of freedom inside a formal space |
| Physical dimension | Dimension with physical interpretation inside a model of nature |
| Informational dimension | Variable, feature or state parameter used to describe a system |
| Visual dimension | Representation layer used to make hidden state visible |
| Project dimension | Design abstraction used to organize system behavior |

The dimensional engine is useful because a distributed robotic system has many state variables. It is not useful because it claims to reveal an invisible physical universe.

## 5. Why Simulation Is Needed

MicroBot v0.1 combines hardware, firmware, protocol, dashboard, telemetry, safety and future swarm behavior.

Even with only one physical node, the system already has several hidden states:

| Hidden State | Why It Needs Visualization |
|---|---|
| Node identity | The user must know which node is active |
| Node state | The user must know whether the node is READY, ACTIVE, WARNING or OFFLINE |
| Command history | The user must know what command changed the system |
| Heartbeat | The user must know whether a node is still alive |
| Telemetry | The user must see sensor and status data |
| Safety | The user must see warnings, safe mode and emergency state |
| Simulation mapping | The user must understand how physical state becomes visual state |

Simulation makes those states readable.

The simulation is therefore both a technical tool and a communication tool.

## 6. Relationship with the Physical Prototype

The MicroBot physical prototype starts from an incremental method.

The first practical level is not the final micro-robot. It is a controllable LED/ESP32 node capable of receiving commands, changing state, producing visible output and supporting telemetry.

This matters because the simulation should not wait for the complete physical swarm.

The simulation can start with:

| Mode | Description |
|---|---|
| Offline mode | No hardware, only virtual nodes |
| Simulated protocol mode | Dashboard generates fake packets |
| Single-node hardware mode | One ESP32 node controls one visual state |
| Hybrid mode | One real node plus several simulated nodes |
| Multi-node mode | Master ESP32 and multiple physical or simulated nodes |
| Replay mode | Recorded telemetry drives the visual state |

This structure keeps the project progressive and testable.

The minimum useful simulation can begin as soon as one command changes one physical or simulated node state.

## 7. Core Architecture

The simulation engine is positioned between dashboard state and visual output.

Recommended public architecture:

PC Controller / Dashboard
  -> Communication Protocol
  -> State Store
  -> Telemetry Adapter
  -> Simulation Mapper
  -> Rendering Layer
  -> Visual State / Demo Output

The simulation should not directly invent state. It should receive state from the same source used by the dashboard.

Recommended modules:

| Module | Suggested File | Responsibility |
|---|---|---|
| State Store | microbotState.js | Stores Master, nodes, telemetry, safety and simulation state |
| Serial Bridge | serialBridge.js | Reads and writes protocol messages from Web Serial or local bridge |
| Protocol Parser | protocolParser.js | Validates command, response, telemetry, error and heartbeat packets |
| Telemetry Adapter | telemetryAdapter.js | Converts sensor values into normalized dashboard state |
| Node Mapper | nodeMapper.js | Maps hardware node IDs to virtual MicroBot objects |
| Dimension Engine | dimensionEngine.js | Computes 4D/5D/6D representation values |
| Simulation Core | simulation3d.js | Creates scene, camera, nodes, animations and update loop |
| Safety Visualizer | safetyVisualizer.js | Shows warning, safe mode, emergency and offline states |
| Demo Controller | demoMode.js | Runs guided demo sequences |
| UI Overlay | dashboardController.js | Updates panels, cards, charts and logs |

## 8. Core Data Model

Each physical or virtual MicroBot should be represented as an agent.

A MicroBot simulation agent should have:

| Field | Meaning |
|---|---|
| id | Stable node identity |
| label | Human-readable node name |
| type | Master, LED, proximity, docking, motion, telemetry, vision or virtual |
| online | Whether the node is responding |
| position3D | Position in simulated space |
| rotation3D | Orientation in simulated space |
| time4D | Time, phase, history, replay and latency values |
| config5D | Frequency, vibration, mode, pattern or behavior configuration |
| energy6D | Energy, current, intensity, data load, safety or information state |
| docking | Docking state, magnetic level and connection target |
| safety | NORMAL, WARNING, SAFE_MODE, EMERGENCY or OFFLINE |
| telemetry | Latest values from physical or simulated sensors |
| lastEvent | Last command, response or error |
| sourceMode | real, simulated, replay or hybrid |

Example conceptual object:

{
  "id": "NODE_03_MAGNETIC_DOCKING",
  "label": "Magnetic Docking Node",
  "type": "docking",
  "online": true,
  "position3D": {
    "x": 0,
    "y": 0,
    "z": 0
  },
  "rotation3D": {
    "x": 0,
    "y": 0,
    "z": 0
  },
  "time4D": {
    "t": 0,
    "phase": 0,
    "history": [],
    "latency_ms": 0
  },
  "config5D": {
    "mode": "IDLE",
    "frequency": 0,
    "amplitude": 0,
    "pattern": "none"
  },
  "energy6D": {
    "energy": 0,
    "intensity": 0,
    "data_load": 0,
    "safety_weight": 0
  },
  "docking": {
    "docked": false,
    "magnetic_level": 0,
    "field_strength": 0
  },
  "safety": {
    "state": "NORMAL",
    "warning": false,
    "emergency": false
  },
  "telemetry": {},
  "sourceMode": "hybrid"
}

This is a conceptual data model, not mandatory final code.

## 9. Dimensional Layer Definitions

The dimensional engine should use clear definitions.

| Layer | Public Meaning | MicroBot Mapping | Example Variables |
|---|---|---|---|
| 3D | Spatial representation | Position, orientation and relative layout | x, y, z, rotation, scale, distance |
| 4D | Time evolution | Sequence, phase, history, latency and replay | t, phase, history, seq, latency_ms |
| 5D | Configuration or vibration layer | Frequency, vibration, mode, pattern and topology | frequency, amplitude, pattern, mode, topology |
| 6D | Energy, information and safety layer | Energy, light intensity, data load, trust, access and warning state | energy, intensity, data_load, trust, safety_weight |
| Extended state | Programmable matter and swarm state | Docking, role, field strength, cluster state and group behavior | docked, role, fieldStrength, cluster_id |

The key rule is that these layers are computational coordinates of system description.

They are not presented as ordinary physical dimensions.

## 10. 3D Layer — Space

The 3D layer represents space.

It should include:

| Element | Representation |
|---|---|
| Node position | x, y, z coordinates |
| Node orientation | rotation or heading |
| Distance | spacing between nodes |
| Proximity | sensor radius or warning zone |
| Docking | visual link between units |
| Physical mockup | black MicroBot model or abstract node |
| Swarm structure | line, circle, cluster or grid |

Minimum v0.1 representation:

Six virtual nodes and one Master node in a simple scene.

The first 3D objective is not photorealism. It is clarity.

## 11. 4D Layer — Time and Evolution

The 4D layer represents time and state evolution.

It should include:

| Time Feature | Meaning |
|---|---|
| Command sequence | Order of dashboard commands |
| State transition | READY -> ACTIVE -> IDLE |
| Heartbeat history | Alive signal over time |
| Timeout | Missing response beyond threshold |
| Latency | Delay between command and response |
| Trail | Visual memory of previous position or state |
| Replay | Reconstruct a previous test or demo |

Correct statement:

The fourth layer represents the temporal evolution of the MicroBot system.

Avoid reducing the fourth dimension to a vague visual effect. It must correspond to sequence, time, history or latency.

## 12. 5D Layer — Configuration, Vibration and Behavior

The 5D layer should represent configuration, vibration, frequency or behavior mode.

It can include:

| Parameter | Meaning |
|---|---|
| Vibration | Activity of NODE_04 or simulated oscillation |
| Frequency | LED pulse, signal rhythm or repeated behavior |
| Pattern | Swarm pattern, LED pattern or motion mode |
| Configuration | Internal state not visible in pure 3D |
| Topology | Local relation between nodes |
| Behavior intensity | Degree of node activity |

Correct statement:

In MicroBot, the fifth layer can represent configuration, vibration, frequency, topology or behavior mode.

Avoid saying:

The fifth dimension is sound.

Sound, if used, is only one possible signal or parameter, not a universal definition of the fifth dimension.

## 13. 6D Layer — Energy, Information and Safety

The 6D layer should represent variables that are not naturally visible in a simple 3D scene.

It can include:

| Parameter | Meaning |
|---|---|
| Energy | Battery, voltage, current, power budget or activity cost |
| Light intensity | LED or visual feedback strength |
| Information | Message count, command density, telemetry load |
| Trust | Confidence in node state or data reliability |
| Access | Camera/auth/security status in future demos |
| Safety | Warning, safe mode, emergency, thermal or power state |

Correct statement:

In MicroBot, the sixth layer is a visual abstraction for energy, information and system-level state.

Avoid saying:

The sixth dimension is light.

Light can be used as a visualization channel, not as a physical definition of the sixth dimension.

## 14. 7D to 16D Research Context

The public v0.1 repository should not overextend the dimensional model.

The theoretical work from 4D to 16D can be used as a long-term research context, but it should not be required to understand the first hardware demo.

Recommended distinction:

| Range | Public Repository Role |
|---|---|
| 3D | Direct visual scene |
| 4D | Time evolution |
| 5D | Configuration, vibration, frequency or topology |
| 6D | Energy, information, safety and telemetry abstraction |
| 7D-12D | Future theoretical and visual research notes |
| 13D-16D | Data, AI, robotics, state-space and information modeling context |

The 13D-16D range is especially suitable for informational and computational representations.

A robot, swarm or dashboard can be described by many variables without claiming that physical space has that many visible directions.

## 15. Protocol-to-Simulation Mapping

The simulation engine should consume the same protocol state used by the dashboard.

| Protocol Field | Simulation Use |
|---|---|
| version | Ensure compatibility |
| type | command, response, telemetry, error, heartbeat or event |
| source | Identify node or Master |
| target | Identify affected object |
| command | Update expected action |
| status | Update result state |
| seq | Order events |
| timestamp | Update 4D time layer |
| state | Update visual node state |
| error_code | Update warning or emergency visual state |
| distance_mm | Update proximity field |
| magnetic_level | Update docking field |
| docked | Show physical or simulated coupling |
| servo_angle | Show actuator pose |
| vibration_level | Update 5D activity |
| battery_v | Update 6D energy |
| current_ma | Update energy or warning |
| safety_state | Update safety overlay |

The simulation must never bypass the protocol.

If the dashboard says a node is OFFLINE, the simulation must not show it as healthy.

## 16. Node-Specific Mapping

| Node | Simulation Representation |
|---|---|
| NODE_00_MASTER | Central hub, heartbeat source, command router and safety state |
| NODE_01_LED_STATE | Color, glow, state badge, pulse and activity |
| NODE_02_PROXIMITY_SAFETY | Proximity radius, warning zone and distance marker |
| NODE_03_MAGNETIC_DOCKING | Magnetic field ring, docking line and coupling indicator |
| NODE_04_MOTION_ACTUATOR | Servo angle, vibration wave and movement indicator |
| NODE_05_TELEMETRY_SENSOR | Orientation marker, IMU vector, telemetry graph and data panel |
| NODE_06_VISION_CAMERA | Camera cone, stream indicator, privacy-safe visual state |
| Virtual node | Simulated swarm extension when physical nodes are missing |

## 17. Visual Grammar

The simulation must use a consistent visual grammar.

| State | Visual Rule |
|---|---|
| READY | Stable neutral node |
| IDLE | Low brightness or static node |
| ACTIVE | Brighter node or subtle animation |
| WARNING | Yellow outline or pulse |
| ERROR | Red marker |
| SAFE_MODE | Locked state or protective overlay |
| EMERGENCY | Global red stop overlay |
| OFFLINE | Greyed-out node |
| DOCKING | Link line or magnetic ring |
| STREAMING | Camera cone or live indicator |
| HIGH_TELEMETRY | Data aura or graph emphasis |
| HIGH_ENERGY_USE | Energy color or warning intensity |

The first rule is readability.

A beautiful simulation that does not explain state is not a good MicroBot simulation.

## 18. Simulation Modes

| Mode | Description |
|---|---|
| Offline simulation | No hardware, only virtual nodes |
| Manual dashboard mode | User changes state from UI |
| Protocol mode | Simulation updates from real packets |
| Replay mode | Recorded telemetry drives the scene |
| Hybrid mode | One real node plus virtual nodes |
| Demo mode | Controlled public sequence |
| Fault injection mode | Simulated errors, timeout and offline nodes |
| Safety mode | Highlights STOP, SAFE_MODE and EMERGENCY |

Hybrid mode is central for v0.1 because it allows the project to show the logic of a larger swarm before all physical nodes exist.

## 19. External Implementation References

This section records external implementation anchors that can guide the technical direction.

| Reference | Use in MicroBot |
|---|---|
| Three.js manual | Browser-based 3D scene, camera, renderer, mesh, animation loop and scene graph |
| MDN Web Serial API | Browser-to-serial communication with microcontroller-like devices, when supported |
| ROS RViz | Conceptual reference for visualizing robotic state in 3D |
| Gazebo Sensors / Gazebo Sim | Conceptual reference for simulating robot sensors, environments and physical systems |
| WebGL fundamentals | Low-level browser graphics reference |
| Canvas and SVG | Useful for overlays, diagnostic panels and simpler simulation layers |
| Multi-agent simulation literature | Useful for swarm behavior, virtual agents and local-rule systems |
| State-space modeling | Useful for describing multi-variable robotic state |

The first MicroBot implementation does not need to copy ROS, RViz or Gazebo. Those systems are references for how serious robotics projects separate control, state, visualization and simulation.

MicroBot v0.1 should remain smaller, simpler and GitHub-readable.

## 20. Minimum v0.1 Simulation

The minimum v0.1 simulation should include:

| Feature | Required |
|---|---|
| Master object | yes |
| Six virtual node placeholders | yes |
| Node ID labels | yes |
| State colors | yes |
| Protocol event log connection | yes |
| One real or simulated telemetry update | yes |
| OFFLINE visualization | yes |
| Safety overlay | yes |
| Demo sequence | yes |
| Screenshot for GitHub | later |
| Short video for portfolio | later |

Minimum success criterion:

When a command changes NODE_01_LED_STATE from READY to ACTIVE, the dashboard and simulation must both show that state change.

## 21. Implementation Roadmap

| Phase | Objective | Output |
|---|---|---|
| Phase 1 | Offline scene | Master and six virtual nodes |
| Phase 2 | State store | Central object for nodes and telemetry |
| Phase 3 | Manual demo mode | Dashboard buttons update virtual nodes |
| Phase 4 | Protocol parser | JSON-like packets update simulation |
| Phase 5 | Web Serial bridge | Real Master updates dashboard state |
| Phase 6 | NODE_01 mapping | Real LED state updates virtual node |
| Phase 7 | NODE_02 and NODE_03 mapping | Safety and docking visual layers |
| Phase 8 | NODE_04 and NODE_05 mapping | Motion, vibration and telemetry layers |
| Phase 9 | NODE_06 mapping | Camera state and privacy-safe vision panel |
| Phase 10 | Replay and demo | Recorded sequence, screenshots and video |

## 22. Testing and Validation

The simulation must be tested progressively.

| Test | Procedure | Success Criterion |
|---|---|---|
| Offline scene | Open simulation without hardware | Nodes appear and no console errors |
| Manual state update | Click dashboard state button | Node visual state changes |
| Protocol packet update | Inject sample telemetry | Node state updates correctly |
| Master connection | Connect dashboard to Master | Master state appears |
| NODE_01 sync | Change LED state | Virtual LED node changes state |
| NODE_02 safety | Send distance warning | Warning radius or safety overlay appears |
| NODE_03 docking | Send magnetic value | Docking field or connection appears |
| NODE_04 motion | Send servo/vibration state | Motion indicator updates |
| NODE_05 telemetry | Send IMU values | Telemetry panel or visual marker updates |
| NODE_06 camera | Send camera status | Camera indicator updates |
| Emergency stop | Trigger EMERGENCY_STOP | Hardware and simulation enter safe state |
| Replay mode | Load recorded sequence | State evolution is reconstructed |

The simulation is valid when it makes the system more understandable and testable.

It is not valid merely because it looks impressive.

## 23. Safety Integration

The simulation must display safety state clearly.

| Safety State | Simulation Behavior |
|---|---|
| NORMAL | No warning overlay |
| WARNING | Yellow caution state |
| SAFE_MODE | Locked or restricted state |
| EMERGENCY | Global stop visualization |
| OFFLINE | Disabled or grey node |
| SENSOR_ERROR | Sensor icon warning |
| TARGET_OFFLINE | Node card and virtual node marked offline |
| UNSAFE_COMMAND | Command rejected and visual warning shown |
| TIMEOUT | Node heartbeat warning |

The simulation must never visually hide risk.

If the protocol reports an error, the simulation should show it.

## 24. Relationship with Physical Design

The simulation should support two visual levels.

| Visual Level | Purpose |
|---|---|
| Abstract node level | Debugging, first dashboard and fast development |
| Realistic MicroBot level | Portfolio, demo video, CAD alignment and future presentation |

The realistic level should follow the physical MicroBot design direction:

| Design Feature | Simulation Meaning |
|---|---|
| Black compact body | Future final identity |
| Central core | Sensor, logic or control center |
| Tapered sides | Directional technical design |
| Docking ring | Coupling and programmable matter concept |
| Exploded/cutaway versions | Educational and documentation use |
| State overlays | Safety, energy and telemetry without unrealistic visual noise |

The first implementation should start abstract.

The realistic 3D model can be added after state mapping works.

## 25. Public Communication Rules

Use these statements:

MicroBot Labs uses a dimensional simulation model to represent spatial position, time evolution, configuration, energy, information, docking, safety and telemetry states.

The 3D/4D/5D/6D system is a computational visualization framework connected to dashboard and protocol state.

The simulation helps explain what the physical prototype is doing and allows virtual extension before every physical node is built.

Avoid these statements:

The fifth dimension is sound.

The sixth dimension is light.

MicroBot proves higher dimensions physically.

A dashboard with sixteen parameters proves a sixteen-dimensional universe.

The simulation replaces hardware validation.

## 26. Repository Direction

The simulation can remain inside microbot-labs as documentation during v0.1.

Later it can become a separate repository.

Possible future repository:

microbot-simulation-engine

Recommended structure:

microbot-simulation-engine/
  README.md
  docs/
    simulation_model.md
    dimensional_mapping.md
    telemetry_mapping.md
    visual_state_rules.md
    research_references.md
  src/
    state/
    protocol/
    telemetry/
    rendering/
    safety/
    replay/
  web/
    index.html
    style.css
    simulation.js
  examples/
    recorded_telemetry/
    demo_scenarios/
  assets/
    models/
    screenshots/

The first public goal is documentation and clarity.

The second goal is an offline demo.

The third goal is hardware-connected simulation.

## 27. Public Research References To Add Later

A future file should collect technical references.

Suggested future file:

docs/research_references_v0_1.md

Suggested categories:

| Category | Example Direction |
|---|---|
| Web 3D visualization | Three.js, WebGL, Canvas |
| Browser hardware communication | Web Serial API |
| Robot visualization | ROS RViz |
| Robot simulation | Gazebo, sensor simulation, digital environments |
| Multi-agent systems | Swarm robotics and agent-based modeling |
| Scientific visualization | Data visualization and state-space representation |
| State estimation | Telemetry, latency, uncertainty and trust |
| Human-machine interfaces | Dashboards, controls and operator feedback |

This keeps external research organized instead of mixing random links into every file.

## 28. Acceptance Criteria

This document is successful when:

| Criterion | Success Condition |
|---|---|
| Scientific caution | The model avoids unsupported physical claims |
| Internal consistency | It matches MicroBot documentation and roadmap |
| Hardware relevance | It connects to ESP32 Master and nodes |
| Dashboard relevance | It maps protocol and telemetry into UI state |
| Simulation clarity | 3D/4D/5D/6D have clear meanings |
| Online research alignment | It uses external references as implementation anchors |
| Safety visibility | Warning, safe mode and emergency are represented |
| GitHub readability | A new reader understands the simulation role |
| Future extensibility | The file prepares a later simulation repository |

## 29. Next Implementation Step

After this file, the next public document should be:

docs/risk_safety_summary_v0_1.md

That document should summarize the public safety philosophy for MicroBot v0.1:

- low power first
- one module at a time
- observable states
- heartbeat
- timeout
- safe mode
- emergency stop
- electrical protection
- camera privacy
- demo safety procedure

The simulation document defines how MicroBot state is visualized.

The safety summary defines how MicroBot remains controlled during tests and demos.

## 30. Version Notes

Version: v0.1  
Repository: microbot-labs  
Document role: Public simulation and dimensional engine context  
Project phase: Pre-startup foundation / physical demonstrator planning  
Main scope: simulation, 3D/4D/5D/6D state mapping, dashboard integration, telemetry mapping, external research alignment and scientific caution  
Next document: risk_safety_summary_v0_1.md
