# MicroBot v0.1 — Prototype Description

MicroBot v0.1 is the first technical demonstrator of MicroBot Labs.

The purpose of this prototype is not to create a final miniaturized robot. The purpose is to validate the basic operating architecture of the ecosystem.

The prototype must demonstrate that a computer can send commands to a master ESP32, that the master ESP32 can communicate with experimental nodes, that the nodes can respond with state information, and that the system can be visualized through a dashboard and a simulation layer.

The minimum prototype chain is:

Computer -> Master ESP32 -> Nodes -> Telemetry -> Dashboard -> Simulation

The first version may use simple node behavior, such as LEDs, vibration modules, sensors, OLED displays, or simulated status responses. The important point is not mechanical perfection. The important point is proving communication, telemetry, control, visualization, and documentation.

The prototype should include:

- One Master ESP32 controller.
- At least two or three experimental nodes.
- A simple communication protocol.
- A clear command format.
- A clear telemetry format.
- A PC or web dashboard.
- A simulation layer.
- A technical build log.
- A short demonstration video.

The prototype should be built progressively. Each part must be tested before adding complexity.

The first validation question is simple:

Can the system send a command, receive a response, display the state, and visualize the node?

If the answer is yes, MicroBot v0.1 has achieved its first technical milestone.
