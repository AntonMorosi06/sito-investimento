## Objective

Create and validate a pre-hardware simulated NODE_00_MASTER responder for MicroBot Labs v0.3.

This issue is for simulated preparation only. It does not validate real ESP32 hardware.

## Context

The project can continue without physical hardware by creating a clearly labeled mock responder that simulates the expected NODE_00_MASTER command/response behavior.

The simulated output must always be labeled:

`PRE_HARDWARE_SIMULATED`

## Tasks

- [ ] Add pre-hardware simulation bridge documentation.
- [ ] Add expected output specification for NODE_00_MASTER.
- [ ] Add mock NODE_00_MASTER responder script.
- [ ] Generate simulated raw log.
- [ ] Generate simulated JSONL log.
- [ ] Generate simulated Markdown report.
- [ ] Generate expected-output examples.
- [ ] Update README/current status/changelog.
- [ ] Confirm no hardware-validation claim is made.

## Acceptance Criteria

This issue can be closed when:

- the mock responder runs locally;
- the simulated report is generated;
- the simulated output is explicitly marked `PRE_HARDWARE_SIMULATED`;
- the repository remains clear that ESP32 hardware has not yet been validated.

## Evidence

Expected paths:

- `tools/offline/mock_node00_master_responder.py`
- `docs/pre_hardware_simulation_bridge_v0_3.md`
- `docs/node_00_master_expected_output_spec_v0_3.md`
- `demos/demo_v0_3/pre_hardware_mock_node00_master/logs/`
- `demos/demo_v0_3/pre_hardware_mock_node00_master/reports/`
- `demos/demo_v0_3/pre_hardware_mock_node00_master/expected_outputs/`

## Notes

This simulated workflow should later be compared with real serial evidence from:

`tools/serial/capture_node00_master_validation.py`
