## Objective

Document how the MicroBot dashboard should integrate with the pre-hardware NODE_00_MASTER mock output.

This issue is about dashboard/mock-output preparation. It does not validate real ESP32 hardware.

## Context

The repository now contains:

- NODE_00_MASTER serial validation pack;
- pre-hardware mock responder;
- simulated NODE_00_MASTER JSONL output;
- current evidence page;
- dashboard parser and Web Serial preparation modules.

## Tasks

- [ ] Add dashboard/mock-output integration notes.
- [ ] Add dashboard mock-output test plan.
- [ ] Explain how simulated JSONL should flow into parser/dashboard logic.
- [ ] Define state mapping for PING, STATUS, GET_NODE_TABLE, SCAN_NODES, STOP and RESET.
- [ ] Preserve `PRE_HARDWARE_SIMULATED` distinction.
- [ ] Update dashboard README.
- [ ] Update README/current status/changelog.

## Acceptance Criteria

This issue can be closed when:

- the integration notes exist;
- the test plan exists;
- the dashboard README points to the notes;
- the documentation clearly separates simulated packets from real Web Serial hardware packets.

## Evidence

Expected files:

- `docs/dashboard_mock_output_integration_notes_v0_3.md`
- `docs/dashboard_mock_output_test_plan_v0_3.md`
- `web/dashboard/README.md`
- `docs/current_evidence_v0_3.md`

## Notes

This issue prepares the next future step: an offline parser validation script or dashboard fixture that consumes the simulated JSONL output.
