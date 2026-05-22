# MicroBot Labs — Communication Protocol v0.1

## 1. Purpose

This document defines the first public communication protocol for MicroBot Labs v0.1.

The goal of this protocol is to define a simple, readable and testable language between the PC Controller, the ESP32 Master, the MicroBot nodes, the dashboard, the telemetry layer and the simulation engine.

The protocol is intentionally simple in v0.1. It must support debugging, learning, testing and public demonstration before the project moves toward more advanced transport layers such as ESP-NOW, Wi-Fi, UDP or WebSocket.

The first operational chain is:

PC Controller -> Bridge -> NODE_00_MASTER -> Nodes -> Telemetry -> Dashboard -> Simulation

The communication protocol must make this chain observable and repeatable.

## 2. Design Principles

The protocol follows a small set of principles.

| Principle | Meaning |
|---|---|
| Human-readable first | Messages should be readable during debugging |
| JSON-like structure | Messages should be easy to parse and map to dashboard state |
| Stable node identity | Every node must have a clear logical ID |
| Explicit command type | Every message must say what it is asking |
| Observable response | Every command should produce a response or error |
| Heartbeat and timeout | The system must detect disconnected or frozen nodes |
| Safe by default | Unknown or unsafe commands must be rejected |
| Simulation-ready | Every telemetry packet should be mappable to the visual simulation |
| Transport-independent | The same logical protocol should work over USB serial first and later over wireless or WebSocket |

The protocol does not aim to be industrial or final. It is a v0.1 prototype specification designed for clarity and progressive validation.

## 3. System Roles

| Role | ID | Description |
|---|---|---|
| PC Controller | PC_CONTROLLER | User interface, dashboard, serial bridge, logs and simulation |
| Master | NODE_00_MASTER | Central ESP32 controller, command router, node table and telemetry aggregator |
| LED State Node | NODE_01_LED_STATE | Visual state and status feedback |
| Proximity Safety Node | NODE_02_PROXIMITY_SAFETY | Distance sensing and safety threshold logic |
| Magnetic Docking Node | NODE_03_MAGNETIC_DOCKING | Magnetic detection, docking state and future coil logic |
| Motion Actuator Node | NODE_04_MOTION_ACTUATOR | Servo, vibration or simple actuation |
| Telemetry Sensor Node | NODE_05_TELEMETRY_SENSOR | IMU, OLED, current or environmental telemetry |
| Vision Camera Node | NODE_06_VISION_CAMERA | ESP32-CAM status, stream or image capture tests |
| Dashboard | DASHBOARD | Visual interface for state, command, logs and telemetry |
| Simulation Engine | SIMULATION_ENGINE | Visual representation of node state and extended simulation parameters |

## 4. Transport Layers

The v0.1 protocol starts with USB serial communication.

| Version | Transport | Purpose |
|---|---|---|
| v0.1 | USB Serial | First reliable debugging and PC-Master communication |
| v0.2 | ESP-NOW | Wireless node communication experiments |
| v0.3 | WebSocket bridge | Dashboard and local server integration |
| Future | Wi-Fi / UDP / hybrid bridge | Larger distributed system experiments |

The logical message structure should remain stable even if the transport changes.

This means that a command such as PING or STATUS should have the same meaning whether it is sent through serial, ESP-NOW or WebSocket.

## 5. Message Envelope

Every protocol message should follow the same conceptual envelope.

| Field | Type | Required | Meaning |
|---|---|---|---|
| version | string | yes | Protocol version, initially v0.1 |
| type | string | yes | Message type: command, response, telemetry, error, heartbeat |
| id | string | yes | Message identifier |
| source | string | yes | Sender ID |
| target | string | yes | Receiver ID |
| command | string | conditional | Command name when type is command |
| status | string | conditional | Response status |
| timestamp | number/string | recommended | Time or sequence marker |
| seq | number | recommended | Sequence number |
| payload | object | yes | Command-specific or telemetry-specific data |

Example conceptual structure:

{
  "version": "v0.1",
  "type": "command",
  "id": "msg_0001",
  "source": "PC_CONTROLLER",
  "target": "NODE_00_MASTER",
  "command": "PING",
  "timestamp": 0,
  "seq": 1,
  "payload": {}
}

## 6. Message Types

| Type | Direction | Purpose |
|---|---|---|
| command | PC/Dashboard -> Master or Master -> Node | Request an action or status |
| response | Master/Node -> PC/Dashboard | Confirm command result |
| telemetry | Master/Node -> PC/Dashboard | Send state, sensor values or events |
| heartbeat | Master/Node -> PC/Dashboard | Confirm that a unit is alive |
| error | Any -> PC/Dashboard | Report invalid command, timeout or unsafe condition |
| event | Master/Node -> Dashboard | Report state change or significant system event |

## 7. Node IDs

Node IDs must remain stable across firmware, dashboard, simulation and documentation.

| Node ID | Role | Main Payload |
|---|---|---|
| NODE_00_MASTER | Master controller | node_table, system_state, error_log |
| NODE_01_LED_STATE | LED state node | mode, color, pattern, brightness |
| NODE_02_PROXIMITY_SAFETY | Proximity and safety node | distance_mm, threshold_mm, safety_state |
| NODE_03_MAGNETIC_DOCKING | Magnetic docking node | magnetic_level, docked, hall_raw |
| NODE_04_MOTION_ACTUATOR | Motion actuator node | servo_angle, vibration_level, actuator_state |
| NODE_05_TELEMETRY_SENSOR | Telemetry sensor node | acceleration, gyro, temperature, current |
| NODE_06_VISION_CAMERA | Vision camera node | camera_state, stream_state, frame_status |

## 8. Global System States

| State | Meaning |
|---|---|
| BOOT | Device has powered on and is initializing |
| READY | Device is initialized and ready to receive commands |
| IDLE | Device is active but not executing a command |
| RUNNING | Device is executing a command |
| WARNING | Device has detected a non-critical anomaly |
| ERROR | Device has detected a fault |
| SAFE_MODE | Device has entered protected behavior |
| EMERGENCY | Emergency stop or critical safety condition |
| OFFLINE | Device is not responding |
| UNKNOWN | Device state cannot be trusted |

These states should be used consistently in firmware, dashboard and simulation.

## 9. Core Commands

| Command | Target | Purpose |
|---|---|---|
| PING | Any node | Check if the unit is alive |
| STATUS | Any node | Request current state |
| RESET | Master or node | Reset local state |
| STOP | Master or node | Stop current action immediately |
| EMERGENCY_STOP | Master | Stop all nodes and enter emergency state |
| SET_STATE | LED or generic node | Set logical or visual state |
| SET_LED | NODE_01 | Set color, brightness or pattern |
| READ_DISTANCE | NODE_02 | Read proximity sensor |
| READ_MAGNETIC | NODE_03 | Read Hall sensor or docking state |
| SET_SERVO | NODE_04 | Set servo angle |
| SET_VIBRATION | NODE_04 | Activate vibration for a limited duration |
| READ_TELEMETRY | NODE_05 | Read IMU or telemetry data |
| CAMERA_STATUS | NODE_06 | Read camera state |
| START_STREAM | NODE_06 | Start camera stream if supported |
| STOP_STREAM | NODE_06 | Stop camera stream |
| CALIBRATE | Sensor nodes | Run calibration routine |
| SCAN_NODES | Master | Check expected node availability |
| GET_NODE_TABLE | Master | Return known node list |

## 10. Command Rules

Every command should follow these rules.

| Rule | Explanation |
|---|---|
| Commands must have a target | The receiver must be explicit |
| Commands must be acknowledged | The sender should receive response or error |
| Unsafe commands must be rejected | Unknown or unsafe commands produce error |
| Actuator commands need duration or timeout | Motors, servos and coils cannot remain active indefinitely |
| STOP has priority | STOP must interrupt running actions |
| EMERGENCY_STOP has global priority | The Master must propagate emergency state |
| State changes must be logged | Dashboard and telemetry should show command results |
| Sensor commands must return value and unit | Example: distance_mm, magnetic_level, temperature_c |

## 11. Standard Response Format

A successful response should include:

{
  "version": "v0.1",
  "type": "response",
  "id": "msg_0001_response",
  "source": "NODE_00_MASTER",
  "target": "PC_CONTROLLER",
  "status": "OK",
  "timestamp": 0,
  "seq": 1,
  "payload": {
    "command": "PING",
    "message": "PONG",
    "state": "READY"
  }
}

An error response should include:

{
  "version": "v0.1",
  "type": "error",
  "id": "msg_0002_error",
  "source": "NODE_00_MASTER",
  "target": "PC_CONTROLLER",
  "status": "ERROR",
  "timestamp": 0,
  "seq": 2,
  "payload": {
    "error_code": "UNKNOWN_COMMAND",
    "message": "Command is not supported by target node",
    "safe_state": "READY"
  }
}

## 12. Error Codes

| Error Code | Meaning |
|---|---|
| UNKNOWN_COMMAND | Command is not recognized |
| INVALID_TARGET | Target node does not exist |
| TARGET_OFFLINE | Target node is not responding |
| INVALID_PAYLOAD | Payload is missing or invalid |
| UNSAFE_COMMAND | Command blocked by safety logic |
| TIMEOUT | No response within allowed time |
| SENSOR_ERROR | Sensor reading failed |
| ACTUATOR_ERROR | Actuator command failed |
| POWER_WARNING | Power instability or low voltage suspected |
| OVERCURRENT_WARNING | Current above safe threshold |
| OVERTEMP_WARNING | Temperature above safe threshold |
| EMERGENCY_ACTIVE | System is in emergency mode |
| SAFE_MODE_ACTIVE | System is in safe mode |
| INTERNAL_ERROR | Firmware or parser internal error |

## 13. Heartbeat

Heartbeat is required for observability and safety.

The Master should periodically send or answer heartbeat messages.

A basic heartbeat message is:

{
  "version": "v0.1",
  "type": "heartbeat",
  "id": "hb_0001",
  "source": "NODE_00_MASTER",
  "target": "PC_CONTROLLER",
  "timestamp": 0,
  "seq": 1,
  "payload": {
    "state": "READY",
    "uptime_ms": 1000,
    "known_nodes": 6,
    "online_nodes": 1,
    "safety_state": "NORMAL"
  }
}

Recommended v0.1 heartbeat logic:

| Parameter | Initial Value |
|---|---:|
| Master heartbeat interval | 1000 ms |
| Node heartbeat interval | 1000-2000 ms |
| Warning timeout | 3000 ms |
| Offline timeout | 5000 ms |
| Emergency timeout for critical actuator | 1000-2000 ms |

If a node misses heartbeat beyond the timeout, the dashboard should mark it as OFFLINE.

## 14. Telemetry Packet

Telemetry packets must make the system observable.

A generic telemetry packet should contain:

{
  "version": "v0.1",
  "type": "telemetry",
  "id": "tel_0001",
  "source": "NODE_05_TELEMETRY_SENSOR",
  "target": "PC_CONTROLLER",
  "timestamp": 0,
  "seq": 1,
  "payload": {
    "state": "RUNNING",
    "battery_v": null,
    "temperature_c": null,
    "accel": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "gyro": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    }
  }
}

Telemetry must be readable enough to support:

| Use | Requirement |
|---|---|
| Debugging | Show what the node is doing |
| Dashboard | Update cards, logs and indicators |
| Testing | Compare expected and actual results |
| Simulation | Map node state into visual representation |
| Safety | Detect warning, timeout or emergency condition |

## 15. NODE_01_LED_STATE Payload

SET_LED command:

{
  "version": "v0.1",
  "type": "command",
  "id": "msg_0101",
  "source": "PC_CONTROLLER",
  "target": "NODE_01_LED_STATE",
  "command": "SET_LED",
  "timestamp": 0,
  "seq": 101,
  "payload": {
    "mode": "ACTIVE",
    "color": {
      "r": 0,
      "g": 255,
      "b": 120
    },
    "brightness": 0.5,
    "pattern": "solid"
  }
}

Expected response:

{
  "version": "v0.1",
  "type": "response",
  "id": "msg_0101_response",
  "source": "NODE_01_LED_STATE",
  "target": "PC_CONTROLLER",
  "status": "OK",
  "timestamp": 0,
  "seq": 101,
  "payload": {
    "state": "ACTIVE",
    "led_applied": true
  }
}

## 16. NODE_02_PROXIMITY_SAFETY Payload

READ_DISTANCE command:

{
  "version": "v0.1",
  "type": "command",
  "id": "msg_0201",
  "source": "PC_CONTROLLER",
  "target": "NODE_02_PROXIMITY_SAFETY",
  "command": "READ_DISTANCE",
  "timestamp": 0,
  "seq": 201,
  "payload": {}
}

Expected telemetry:

{
  "version": "v0.1",
  "type": "telemetry",
  "id": "tel_0201",
  "source": "NODE_02_PROXIMITY_SAFETY",
  "target": "PC_CONTROLLER",
  "timestamp": 0,
  "seq": 201,
  "payload": {
    "distance_mm": 180,
    "threshold_warning_mm": 150,
    "threshold_danger_mm": 80,
    "safety_state": "SAFE"
  }
}

## 17. NODE_03_MAGNETIC_DOCKING Payload

READ_MAGNETIC command:

{
  "version": "v0.1",
  "type": "command",
  "id": "msg_0301",
  "source": "PC_CONTROLLER",
  "target": "NODE_03_MAGNETIC_DOCKING",
  "command": "READ_MAGNETIC",
  "timestamp": 0,
  "seq": 301,
  "payload": {}
}

Expected telemetry:

{
  "version": "v0.1",
  "type": "telemetry",
  "id": "tel_0301",
  "source": "NODE_03_MAGNETIC_DOCKING",
  "target": "PC_CONTROLLER",
  "timestamp": 0,
  "seq": 301,
  "payload": {
    "hall_raw": 512,
    "magnetic_level": 0.62,
    "docked": false,
    "state": "IDLE"
  }
}

Safety rule:

Active coils or electromagnets must not be enabled without MOSFET, flyback diode, current limit and timeout logic.

## 18. NODE_04_MOTION_ACTUATOR Payload

SET_SERVO command:

{
  "version": "v0.1",
  "type": "command",
  "id": "msg_0401",
  "source": "PC_CONTROLLER",
  "target": "NODE_04_MOTION_ACTUATOR",
  "command": "SET_SERVO",
  "timestamp": 0,
  "seq": 401,
  "payload": {
    "angle_deg": 45,
    "duration_ms": 1000
  }
}

SET_VIBRATION command:

{
  "version": "v0.1",
  "type": "command",
  "id": "msg_0402",
  "source": "PC_CONTROLLER",
  "target": "NODE_04_MOTION_ACTUATOR",
  "command": "SET_VIBRATION",
  "timestamp": 0,
  "seq": 402,
  "payload": {
    "level": 0.4,
    "duration_ms": 500
  }
}

Safety rule:

Every actuator command must include a duration or must be stopped automatically by firmware timeout.

## 19. NODE_05_TELEMETRY_SENSOR Payload

READ_TELEMETRY command:

{
  "version": "v0.1",
  "type": "command",
  "id": "msg_0501",
  "source": "PC_CONTROLLER",
  "target": "NODE_05_TELEMETRY_SENSOR",
  "command": "READ_TELEMETRY",
  "timestamp": 0,
  "seq": 501,
  "payload": {}
}

Expected telemetry:

{
  "version": "v0.1",
  "type": "telemetry",
  "id": "tel_0501",
  "source": "NODE_05_TELEMETRY_SENSOR",
  "target": "PC_CONTROLLER",
  "timestamp": 0,
  "seq": 501,
  "payload": {
    "imu": {
      "accel_x": 0.0,
      "accel_y": 0.0,
      "accel_z": 1.0,
      "gyro_x": 0.0,
      "gyro_y": 0.0,
      "gyro_z": 0.0
    },
    "display_state": "ON",
    "temperature_c": null,
    "current_ma": null
  }
}

## 20. NODE_06_VISION_CAMERA Payload

CAMERA_STATUS command:

{
  "version": "v0.1",
  "type": "command",
  "id": "msg_0601",
  "source": "PC_CONTROLLER",
  "target": "NODE_06_VISION_CAMERA",
  "command": "CAMERA_STATUS",
  "timestamp": 0,
  "seq": 601,
  "payload": {}
}

Expected response:

{
  "version": "v0.1",
  "type": "response",
  "id": "msg_0601_response",
  "source": "NODE_06_VISION_CAMERA",
  "target": "PC_CONTROLLER",
  "status": "OK",
  "timestamp": 0,
  "seq": 601,
  "payload": {
    "camera_state": "READY",
    "stream_state": "OFF",
    "frame_status": "AVAILABLE"
  }
}

Privacy rule:

In v0.1, camera tests should be treated as controlled vision/status tests. Public demos should avoid real biometric datasets, uncontrolled recording or private face data.

## 21. Master Routing Logic

The Master receives a command and decides what to do.

| Command target | Master behavior |
|---|---|
| NODE_00_MASTER | Execute locally |
| NODE_01 to NODE_06 | Route to node if online |
| BROADCAST | Send safe command to all compatible nodes |
| Unknown target | Return INVALID_TARGET |
| Offline node | Return TARGET_OFFLINE |
| Unsafe command | Return UNSAFE_COMMAND |

The Master should maintain a node table.

Example node table payload:

{
  "nodes": [
    {
      "id": "NODE_01_LED_STATE",
      "online": true,
      "state": "READY",
      "last_seen_ms": 1000
    },
    {
      "id": "NODE_02_PROXIMITY_SAFETY",
      "online": false,
      "state": "OFFLINE",
      "last_seen_ms": null
    }
  ]
}

## 22. Dashboard Mapping

The dashboard should map messages to visible interface areas.

| Message Field | Dashboard Use |
|---|---|
| source | Select node card |
| type | Choose log category |
| status | Show OK, warning or error |
| state | Update node state badge |
| payload.sensor values | Update telemetry panel |
| payload.safety_state | Update safety panel |
| error_code | Show warning/error log |
| timestamp or seq | Order messages |
| command | Show command history |

The dashboard must not only send commands. It must make the distributed system observable.

## 23. Simulation Mapping

Every node state should be mappable to the simulation layer.

| Protocol Data | Simulation Meaning |
|---|---|
| node ID | Virtual MicroBot identity |
| state | Visual color, activity or animation |
| distance_mm | Proximity field or warning radius |
| magnetic_level | Docking attraction visualization |
| docked | Coupling state |
| servo_angle | Actuator pose or motion indicator |
| vibration_level | Oscillation or activity parameter |
| IMU data | Orientation or movement visualization |
| camera_state | Vision module state |
| safety_state | Safety overlay or warning layer |

The simulation is a parametric visualization of system states. It is not a physical proof of higher dimensions. Its role is to make hardware state, time evolution, vibration, energy, information, docking and safety visually readable.

## 24. Safety Logic

Safety is part of the protocol, not an external note.

Required safety behavior:

| Condition | Required Behavior |
|---|---|
| Unknown command | Reject and return UNKNOWN_COMMAND |
| Missing payload | Reject and return INVALID_PAYLOAD |
| Lost node heartbeat | Mark OFFLINE |
| Lost Master heartbeat | Dashboard marks system disconnected |
| STOP command | Stop local action immediately |
| EMERGENCY_STOP | Master enters EMERGENCY and stops all nodes |
| Actuator duration exceeded | Firmware stops actuator |
| Unsafe coil command | Reject unless safety conditions are satisfied |
| Sensor failure | Return SENSOR_ERROR |
| Power warning | Return POWER_WARNING and reduce activity if needed |

Safety states should appear in telemetry and dashboard logs.

## 25. Minimum Test Sequence

The first test sequence should be small and repeatable.

| Step | Command | Expected Result |
|---:|---|---|
| 1 | PING Master | Master returns PONG |
| 2 | STATUS Master | Master returns READY |
| 3 | GET_NODE_TABLE | Master returns expected nodes |
| 4 | PING NODE_01 | NODE_01 returns READY or Master reports offline |
| 5 | SET_LED NODE_01 ACTIVE | LED changes state |
| 6 | READ_DISTANCE NODE_02 | Distance value or offline error |
| 7 | READ_MAGNETIC NODE_03 | Magnetic value or offline error |
| 8 | SET_SERVO NODE_04 | Servo moves with timeout |
| 9 | READ_TELEMETRY NODE_05 | Telemetry packet returned |
| 10 | CAMERA_STATUS NODE_06 | Camera state returned |
| 11 | STOP | Active action stops |
| 12 | EMERGENCY_STOP | System enters emergency state |

## 26. Acceptance Criteria

The protocol v0.1 is successful when:

| Criterion | Success Condition |
|---|---|
| Readability | Messages can be read and understood during debugging |
| Basic command flow | PC can send PING and STATUS |
| Master response | Master replies with valid response packet |
| Node routing | Master can route at least one node command |
| Telemetry | At least one telemetry packet reaches dashboard |
| Error handling | Invalid command produces structured error |
| Heartbeat | Offline state can be detected |
| STOP | STOP interrupts an active behavior |
| Dashboard mapping | Messages update UI state |
| Simulation mapping | At least one node state updates visual simulation |

## 27. Version Notes

Version: v0.1  
Repository: microbot-labs  
Document role: Public communication protocol  
Project phase: Pre-startup foundation / physical demonstrator planning  
Main scope: PC Controller, ESP32 Master, six nodes, telemetry, dashboard, simulation and safety  
Next document: dashboard_controller_specification_v0_1.md
