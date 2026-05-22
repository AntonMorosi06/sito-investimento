## Objective

Create and validate a pre-hardware simulated NODE_01_LED_STATE responder for MicroBot Labs v0.3.

This issue is for simulated preparation only. It does not validate a real ESP32 board or a real LED.

## Context

NODE_01_LED_STATE is the first visible output node. The firmware target uses an onboard LED to represent MicroBot state and supports commands such as PING, STATUS, ACTIVE, IDLE, WARNING, ERROR, STOP and RESET.

The project can prepare this node before hardware by simulating its command/state behavior.

## Tasks

- [ ] Add NODE_01 pre-hardware simulation documentation.
- [ ] Add NODE_01 expected output specification.
- [ ] Add mock NODE_01_LED_STATE responder script.
- [ ] Generate simulated raw log.
- [ ] Generate simulated JSONL log.
- [ ] Generate simulated Markdown report.
- [ ] Generate expected-output examples.
- [ ] Update Current Evidence page.
- [ ] Update README/current status/changelog.
- [ ] Confirm no hardware-validation claim is made.

## Acceptance Criteria

This issue can be closed when:

- the mock responder runs locally;
- the simulated report is generated;
- output is explicitly marked PRE_HARDWARE_SIMULATED;
- ACTIVE, IDLE, WARNING, ERROR, STOP and RESET transitions are represented;
- the repository remains clear that no real LED has been validated.

## Evidence

Expected files:

- `tools/offline/mock_node01_led_state_responder.py`
- `docs/node_01_led_state_pre_hardware_simulation_v0_3.md`
- `docs/node_01_led_state_expected_output_spec_v0_3.md`
- `demos/demo_v0_3/pre_hardware_mock_node01_led_state/logs/`
- `demos/demo_v0_3/pre_hardware_mock_node01_led_state/reports/`
- `demos/demo_v0_3/pre_hardware_mock_node01_led_state/expected_outputs/`

## Notes

This simulated workflow should later be compared with real serial and visual LED evidence from `firmware/esp32/NODE_01_LED_STATE/NODE_01_LED_STATE.ino`.
