## Objective

Add a Wokwi ESP32 simulation bridge for `NODE_00_MASTER`.

## Tasks

- [ ] Create `demos/demo_v0_4/wokwi_esp32_node00_master/`.
- [ ] Add Wokwi `sketch.ino`.
- [ ] Add Wokwi `diagram.json`.
- [ ] Add expected serial output documentation.
- [ ] Add validation notes.
- [ ] Add run guide.
- [ ] Update README, CHANGELOG and current status.
- [ ] Preserve the distinction between Wokwi simulation and real hardware validation.

## Acceptance Criteria

This issue can be closed when the repository contains a Wokwi ESP32 `NODE_00_MASTER` simulation that emits boot, heartbeat, status, scan, ping/pong, LED, safe stop and reset-ready serial packets.

This issue does not close real ESP32 hardware validation.
