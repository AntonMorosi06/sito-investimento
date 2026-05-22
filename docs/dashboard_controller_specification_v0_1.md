# MicroBot Labs — Dashboard Controller Specification v0.1

## 1. Purpose

This document defines the first public dashboard and PC Controller specification for MicroBot Labs v0.1.

The dashboard is not only a graphic interface. It is the operational control layer of the MicroBot v0.1 demonstrator.

Its role is to connect the user, the PC, the ESP32 Master, the six physical or simulated nodes, the telemetry layer, the safety layer and the simulation engine.

The first operational chain is:

PC Controller -> Dashboard -> Bridge -> NODE_00_MASTER -> Nodes -> Telemetry -> Dashboard State -> Simulation

The purpose of this document is to define what the dashboard must show, what commands it must send, what states it must display, how telemetry must be represented and how the first public demo should be controlled.

## 2. Dashboard Role in MicroBot v0.1

The dashboard must make a distributed system observable.

In MicroBot v0.1, the physical prototype may still be simple, wired, breadboard-based and incomplete. The dashboard compensates for this by making every command, state, response, warning and simulation update visible.

The dashboard has six main roles.

| Role | Meaning |
|---|---|
| Command interface | Send commands to Master and nodes |
| State monitor | Show system state, node state and safety state |
| Telemetry viewer | Display sensor values, events and packets |
| Serial or bridge terminal | Show raw protocol communication |
| Simulation bridge | Map physical or simulated telemetry into visual state |
| Demo cockpit | Provide a clean interface for recording and presentation |

The dashboard should be designed for debugging first and presentation second. A beautiful interface is useful, but the first priority is that the system can be understood and tested.

## 3. Public Scope

The v0.1 dashboard should support:

| Feature | v0.1 Status |
|---|---|
| Master connection panel | Required |
| Web Serial or local bridge | Required |
| Command buttons | Required |
| Node cards | Required |
| Telemetry log | Required |
| Raw terminal | Required |
| Emergency stop | Required |
| Safety panel | Required |
| Simulation preview | Required |
| Camera status panel | Optional but planned |
| Charts | Optional in first version |
| Authentication | Not required for public v0.1 |
| Cloud backend | Not required |
| Multi-user remote control | Not required |

The public dashboard should remain simple enough to build, explain and test.

## 4. Recommended Technology Stack

The first dashboard can be implemented with a lightweight web stack.

| Layer | Recommended Option | Reason |
|---|---|---|
| UI | HTML, CSS, JavaScript | Simple, portable and GitHub-friendly |
| Serial connection | Web Serial API or Python bridge | Direct PC-Master debugging |
| Local bridge | Python or Node.js WebSocket server | Useful when browser serial is not enough |
| Simulation preview | Canvas, SVG or Three.js | Visual state representation |
| Charts | Simple Canvas or lightweight JS | Telemetry visualization |
| Data model | JavaScript state object | Easy mapping from protocol packets |
| Storage | Local logs or exported JSON | Useful for test reports |

The first version should avoid a heavy framework unless necessary. The priority is a dashboard that can be opened, understood and debugged quickly.

## 5. High-Level Dashboard Layout

The dashboard should be organized into clear panels.

| Panel | Purpose |
|---|---|
| Header / System Bar | Project name, connection status, protocol version and global state |
| Master Panel | Master ESP32 state, uptime, node count, heartbeat and errors |
| Node Grid | One card for each MicroBot node |
| Command Panel | Buttons and controls for PING, STATUS, STOP, RESET and node commands |
| Telemetry Panel | Parsed telemetry values from nodes |
| Terminal / Raw Log | Raw messages, command history and errors |
| Safety Panel | SAFE_MODE, EMERGENCY, timeout, offline nodes and warnings |
| Simulation Panel | Visual representation of node states and extended simulation variables |
| Demo Panel | Buttons for demo sequence, record checklist and presentation mode |

The dashboard must allow a person to understand the system without reading the full documentation.

## 6. Header and System Bar

The header should show the global status of the MicroBot v0.1 system.

Recommended fields:

| Field | Description |
|---|---|
| Project name | MicroBot Labs |
| Version | v0.1 |
| Protocol version | communication_protocol_v0_1 |
| Connection state | DISCONNECTED, CONNECTING, CONNECTED, ERROR |
| Master state | UNKNOWN, BOOT, READY, RUNNING, SAFE_MODE, EMERGENCY |
| Online nodes | Number of responding nodes |
| Last heartbeat | Timestamp or elapsed time |
| Safety state | NORMAL, WARNING, SAFE_MODE, EMERGENCY |

The header should be visible at all times.

## 7. Master Panel

The Master Panel represents NODE_00_MASTER.

It should display:

| Field | Meaning |
|---|---|
| Master ID | NODE_00_MASTER |
| Firmware version | Current firmware version if available |
| Uptime | Time since Master boot |
| State | BOOT, READY, IDLE, RUNNING, WARNING, ERROR, SAFE_MODE, EMERGENCY |
| Known nodes | Expected node count |
| Online nodes | Number of active nodes |
| Last command | Most recent command processed |
| Last error | Most recent error code |
| Heartbeat | Alive signal from Master |
| Transport | USB Serial, WebSocket, ESP-NOW future |

Required Master commands:

| Command | Purpose |
|---|---|
| PING | Check Master availability |
| STATUS | Request Master state |
| SCAN_NODES | Check expected node availability |
| GET_NODE_TABLE | Return current node table |
| STOP | Stop current Master action |
| EMERGENCY_STOP | Stop all nodes and enter emergency state |
| RESET | Reset Master state |

## 8. Node Grid

The dashboard should show six node cards.

| Node | Card Name | Main Data |
|---|---|---|
| NODE_01_LED_STATE | LED State | mode, color, pattern, brightness |
| NODE_02_PROXIMITY_SAFETY | Proximity Safety | distance, threshold, safety_state |
| NODE_03_MAGNETIC_DOCKING | Magnetic Docking | magnetic_level, hall_raw, docked |
| NODE_04_MOTION_ACTUATOR | Motion Actuator | servo_angle, vibration_level, actuator_state |
| NODE_05_TELEMETRY_SENSOR | Telemetry Sensor | acceleration, gyro, temperature, current |
| NODE_06_VISION_CAMERA | Vision Camera | camera_state, stream_state, frame_status |

Each node card should include:

| Field | Purpose |
|---|---|
| Node ID | Stable protocol identity |
| Human name | Readable module name |
| Online status | ONLINE or OFFLINE |
| State badge | READY, IDLE, RUNNING, WARNING, ERROR, SAFE_MODE |
| Last seen | Last heartbeat or telemetry time |
| Last command | Most recent command sent |
| Last response | Most recent response received |
| Error field | Last error code |
| Quick actions | PING, STATUS and node-specific actions |

## 9. Command Panel

The Command Panel is where the operator sends actions.

Global commands:

| Command | Target | Purpose |
|---|---|---|
| PING_MASTER | NODE_00_MASTER | Check connection |
| STATUS_MASTER | NODE_00_MASTER | Read Master state |
| SCAN_NODES | NODE_00_MASTER | Check node availability |
| GET_NODE_TABLE | NODE_00_MASTER | Display node list |
| STOP_ALL | NODE_00_MASTER | Stop active actions |
| EMERGENCY_STOP | NODE_00_MASTER | Enter emergency state |
| RESET_MASTER | NODE_00_MASTER | Reset Master state |

Node commands:

| Command | Target | Purpose |
|---|---|---|
| SET_LED | NODE_01_LED_STATE | Change visual state |
| READ_DISTANCE | NODE_02_PROXIMITY_SAFETY | Read proximity sensor |
| READ_MAGNETIC | NODE_03_MAGNETIC_DOCKING | Read magnetic field or docking state |
| SET_SERVO | NODE_04_MOTION_ACTUATOR | Move servo with timeout |
| SET_VIBRATION | NODE_04_MOTION_ACTUATOR | Activate vibration with timeout |
| READ_TELEMETRY | NODE_05_TELEMETRY_SENSOR | Read IMU or telemetry values |
| CAMERA_STATUS | NODE_06_VISION_CAMERA | Read camera state |
| START_STREAM | NODE_06_VISION_CAMERA | Start stream if available |
| STOP_STREAM | NODE_06_VISION_CAMERA | Stop stream |

Every command sent from the dashboard must be logged.

## 10. Terminal and Raw Log

The terminal is essential for debugging.

It should show:

| Log Type | Example |
|---|---|
| Outgoing command | PC -> Master: PING |
| Incoming response | Master -> PC: PONG |
| Telemetry packet | NODE_05 sent IMU data |
| Warning | NODE_02 distance below warning threshold |
| Error | UNKNOWN_COMMAND or TARGET_OFFLINE |
| Safety event | STOP or EMERGENCY_STOP triggered |
| Connection event | Serial connected or disconnected |

The terminal should support:

| Feature | Purpose |
|---|---|
| Clear log | Clean the interface during testing |
| Export log | Save test evidence |
| Filter by node | Debug one node at a time |
| Filter by type | Show only command, telemetry, error or safety |
| Raw mode | Display exact protocol packet |
| Parsed mode | Display readable interpretation |

## 11. Telemetry Panel

The telemetry panel should transform protocol data into readable values.

Recommended telemetry categories:

| Category | Source |
|---|---|
| Distance | NODE_02_PROXIMITY_SAFETY |
| Magnetic field | NODE_03_MAGNETIC_DOCKING |
| Motion state | NODE_04_MOTION_ACTUATOR |
| IMU data | NODE_05_TELEMETRY_SENSOR |
| Camera state | NODE_06_VISION_CAMERA |
| Master state | NODE_00_MASTER |
| Safety state | Master and all nodes |
| Heartbeat | Master and nodes |
| Errors | Any device |

Telemetry should be displayed as:

| UI Form | Use |
|---|---|
| Numeric value | distance_mm, magnetic_level, current_ma |
| Badge | READY, WARNING, ERROR |
| Mini log | recent events |
| Simple chart | distance, acceleration or current over time |
| Simulation update | state mapped into visual representation |

## 12. Safety Panel

The safety panel is mandatory.

It should show:

| Safety Item | Meaning |
|---|---|
| Global safety state | NORMAL, WARNING, SAFE_MODE, EMERGENCY |
| Emergency stop button | Manual global stop |
| Last safety event | Most recent STOP, timeout or warning |
| Offline nodes | Nodes not responding |
| Active actuators | Servo, vibration, coil or stream currently active |
| Timeouts | Active timeout counters |
| Power warnings | Low voltage or unstable power if measured |
| Sensor errors | Failed sensor readings |
| Recovery action | Reset, acknowledge or return to safe state |

Emergency stop must be visually obvious and always reachable.

Required behavior:

| Condition | Dashboard Behavior |
|---|---|
| Master disconnected | Disable unsafe commands |
| Node offline | Mark card OFFLINE |
| Timeout | Show warning and stop affected operation |
| EMERGENCY_STOP active | Disable all non-recovery commands |
| SAFE_MODE active | Allow STATUS, PING, RESET and safe diagnostics |
| Unknown error | Highlight system warning and log raw packet |

## 13. Simulation Panel

The simulation panel maps protocol data into a visual representation.

The first simulation does not need advanced physics. It must make states understandable.

Recommended visual mapping:

| Protocol Data | Visual Meaning |
|---|---|
| Node ID | Virtual MicroBot identity |
| State | Color, glow, opacity or animation |
| Distance | Proximity circle or warning radius |
| Magnetic level | Docking field or attraction indicator |
| Docked | Connected or locked visual state |
| Servo angle | Motion indicator |
| Vibration level | Oscillation effect |
| IMU data | Orientation or movement marker |
| Camera state | Vision module icon |
| Safety state | Overlay, warning border or red lock state |

The simulation layer should be described as a parametric visualization of system state. It should not be presented as a physical proof of higher dimensions.

## 14. Camera and Vision Panel

The camera panel is optional in the first dashboard but should be planned.

It may include:

| Field | Meaning |
|---|---|
| Camera state | OFF, READY, STREAMING, ERROR |
| Stream state | OFF or ON |
| Frame status | AVAILABLE or UNAVAILABLE |
| Last frame time | Last received frame marker |
| Privacy mode | Public-safe demo mode |
| Camera error | Error code from NODE_06 |

Public v0.1 privacy rule:

The camera panel must not require real biometric storage. Public demos should use controlled scenes, test objects or camera-status simulation unless explicit consent and privacy handling exist.

## 15. Demo Mode

Demo Mode is a simplified operating mode for presentations.

It should provide a guided sequence:

| Step | Dashboard Action | Expected Output |
|---:|---|---|
| 1 | Connect to Master | Master status appears |
| 2 | PING Master | PONG response |
| 3 | SCAN_NODES | Node table appears |
| 4 | Activate NODE_01 | LED state changes |
| 5 | Read NODE_02 | Distance value appears |
| 6 | Read NODE_03 | Magnetic state appears |
| 7 | Move NODE_04 | Motion state appears |
| 8 | Read NODE_05 | Telemetry appears |
| 9 | Check NODE_06 | Camera state appears |
| 10 | Update simulation | Visual nodes change |
| 11 | STOP_ALL | System returns to safe state |

Demo Mode should never hide errors. If something fails, the dashboard should show a clear fallback state.

## 16. Data Model

The dashboard should maintain a central state object.

Conceptual fields:

| Field | Purpose |
|---|---|
| connection | Serial or bridge connection status |
| master | Master state and metadata |
| nodes | Dictionary of node cards |
| telemetry | Latest telemetry packets |
| logs | Command, response, error and event history |
| safety | Global and node-specific safety state |
| simulation | Visual state mapped from telemetry |
| demo | Current demo step and checklist |

A simple internal model can be used before adding complex frameworks.

Example conceptual state:

{
  "connection": {
    "status": "CONNECTED",
    "transport": "USB_SERIAL"
  },
  "master": {
    "id": "NODE_00_MASTER",
    "state": "READY",
    "online_nodes": 1
  },
  "nodes": {
    "NODE_01_LED_STATE": {
      "online": true,
      "state": "ACTIVE",
      "last_seen_ms": 1000
    }
  },
  "safety": {
    "global_state": "NORMAL",
    "emergency": false
  }
}

## 17. Event Handling

Every incoming protocol packet should be processed through the same sequence.

| Step | Action |
|---:|---|
| 1 | Receive raw message |
| 2 | Validate JSON or message format |
| 3 | Check message type |
| 4 | Identify source and target |
| 5 | Update node or master state |
| 6 | Update telemetry values |
| 7 | Update safety state if needed |
| 8 | Add event to log |
| 9 | Update simulation |
| 10 | Refresh UI |

If a message cannot be parsed, it should be logged as a protocol error.

## 18. Error Handling

The dashboard should recognize standard protocol errors.

| Error Code | Dashboard Behavior |
|---|---|
| UNKNOWN_COMMAND | Show command error in terminal |
| INVALID_TARGET | Mark target issue |
| TARGET_OFFLINE | Mark node as OFFLINE |
| INVALID_PAYLOAD | Show payload error |
| UNSAFE_COMMAND | Show safety block |
| TIMEOUT | Show timeout warning |
| SENSOR_ERROR | Mark sensor warning |
| ACTUATOR_ERROR | Mark actuator warning |
| POWER_WARNING | Show power warning |
| OVERTEMP_WARNING | Show temperature warning |
| EMERGENCY_ACTIVE | Lock interface in emergency mode |
| SAFE_MODE_ACTIVE | Limit commands to safe diagnostics |

Errors must not disappear silently. Every error should be visible and logged.

## 19. User Interface Style

The UI should be technical, dark, clean and readable.

Recommended style:

| Element | Direction |
|---|---|
| Background | Dark technical interface |
| Cards | Rounded panels with clear labels |
| Status colors | Green ready, blue active, yellow warning, red emergency |
| Typography | Clear sans-serif, readable sizes |
| Terminal | Monospace log area |
| Buttons | Large enough for demo use |
| Emergency button | Visually distinct and always visible |
| Diagrams | Connected to architecture and README |
| Animation | Useful but not excessive |

The dashboard should feel like an engineering cockpit, not a decorative website.

## 20. Repository Direction

The dashboard may later become a separate repository.

Possible future repository:

microbot-dashboard

Recommended future structure:

microbot-dashboard/
  README.md
  public/
    index.html
    favicon.svg
  src/
    css/
    js/
      app.js
      state.js
      protocol.js
      serial_bridge.js
      telemetry.js
      command_panel.js
      safety_panel.js
      simulation_bridge.js
      demo_mode.js
  server/
    websocket_server.py
    serial_bridge.py
  docs/
    dashboard_overview.md
    command_flow.md
    telemetry_mapping.md
  screenshots/

For now, the public specification remains inside microbot-labs as a planning document.

## 21. Minimum Dashboard v0.1

The minimum dashboard should include:

| Feature | Required |
|---|---|
| Connect button | yes |
| Disconnect button | yes |
| PING Master | yes |
| STATUS Master | yes |
| STOP_ALL | yes |
| EMERGENCY_STOP | yes |
| Node cards | yes |
| Raw terminal | yes |
| Parsed log | yes |
| Safety status | yes |
| Simulation placeholder | yes |

The first dashboard is successful when it can show:

PC command -> Master response -> node state -> telemetry log -> simulation update.

## 22. Testing Checklist

| Test | Expected Result |
|---|---|
| Open dashboard | UI loads without errors |
| Connect to Master | Connection state becomes CONNECTED |
| Send PING | Master returns PONG |
| Send STATUS | Master state appears |
| Scan nodes | Node cards update |
| Send SET_LED | NODE_01 state changes |
| Receive telemetry | Telemetry panel updates |
| Trigger STOP | Active action stops |
| Trigger EMERGENCY_STOP | Safety panel enters emergency |
| Disconnect Master | Dashboard marks system disconnected |
| Invalid packet | Protocol error appears in log |

## 23. Public Demo Criteria

The dashboard is ready for the first public demo when:

| Criterion | Success Condition |
|---|---|
| Clarity | External viewer understands the system from UI |
| Control | Commands can be sent reliably |
| Observability | States and responses are visible |
| Safety | STOP and emergency state are visible |
| Telemetry | At least one live or simulated telemetry value appears |
| Simulation | At least one node state updates visually |
| Logging | Demo events are recorded |
| Fallback | Offline nodes are shown clearly, not hidden |

## 24. Version Notes

Version: v0.1  
Repository: microbot-labs  
Document role: Public dashboard and PC Controller specification  
Project phase: Pre-startup foundation / physical demonstrator planning  
Main scope: dashboard, command panel, node cards, telemetry, safety, logs, simulation bridge and demo mode  
Next document: testing_validation_checklist_v0_1.md
