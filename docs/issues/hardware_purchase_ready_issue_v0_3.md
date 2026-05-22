## Objective

Prepare MicroBot Labs for the first physical hardware purchase and make the repository hardware-purchase-ready.

This issue does not validate hardware. It prepares the purchase and setup path for the first ESP32 tests.

## Context

The repository already contains:

- v0.3 canonical repository map.
- v0.3 canonical status document.
- NODE_00_MASTER serial validation pack.
- NODE_00_MASTER firmware skeleton.
- Real serial capture script.
- Pre-hardware preparation documents.

## Tasks

- [ ] Review Arduino IDE setup guide.
- [ ] Review ESP32 serial port selection guide.
- [ ] Review ESP32 troubleshooting guide.
- [ ] Review hardware purchase readiness checklist.
- [ ] Review minimum BOM and Amazon search list.
- [ ] Decide minimum budget.
- [ ] Choose ESP32 DevKit board type.
- [ ] Confirm USB data cable requirement.
- [ ] Confirm no motors/coils/batteries are needed for first purchase.
- [ ] Buy minimum kit.
- [ ] After delivery, run NODE_00_MASTER upload test.
- [ ] After upload, run serial capture validation.
- [ ] Commit real hardware evidence only after the board is actually tested.

## Acceptance Criteria

This issue can be closed when:

- the minimum purchase list has been reviewed;
- the first hardware order has been planned or completed;
- the chosen ESP32 board type is known;
- required setup docs are present;
- the next issue is clearly the real NODE_00_MASTER upload/serial validation issue.

## Evidence To Commit Later

Do not commit fake hardware evidence.

After real hardware is available, evidence may include:

- `demos/demo_v0_3/node_00_master_serial/logs/`
- `demos/demo_v0_3/node_00_master_serial/reports/`
- optional setup photo;
- optional Arduino upload screenshot.

## Notes

This issue is about readiness and purchasing, not hardware validation.
