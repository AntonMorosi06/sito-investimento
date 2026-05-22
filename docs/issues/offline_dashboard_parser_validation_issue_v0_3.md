## Objective

Add an offline dashboard parser validation step for the pre-hardware NODE_00_MASTER JSONL output.

This issue validates parser-facing compatibility only. It does not validate real ESP32 hardware or Web Serial hardware communication.

## Context

The repository now contains:

- pre-hardware NODE_00_MASTER mock responder;
- simulated JSONL output;
- dashboard parser and Web Serial preparation files;
- dashboard/mock-output integration notes;
- dashboard mock-output test plan.

The next step is to validate that simulated JSONL output can pass a parser model aligned with `web/dashboard/protocol_parser.js`.

## Tasks

- [ ] Add `tools/offline/validate_dashboard_mock_output.py`.
- [ ] Add dashboard parser validation notes.
- [ ] Generate offline parser validation report.
- [ ] Generate JSON validation summary.
- [ ] Create or update dashboard test fixture.
- [ ] Update README/current status/changelog.
- [ ] Confirm no hardware-validation claim is made.

## Acceptance Criteria

This issue can be closed when:

- the validator runs locally;
- the simulated JSONL output is parsed successfully;
- the report is generated;
- the result is labeled as offline parser validation;
- the repository remains clear that no real ESP32 hardware has been validated.

## Evidence

Expected files:

- `tools/offline/validate_dashboard_mock_output.py`
- `docs/dashboard_parser_validation_notes_v0_3.md`
- `demos/demo_v0_3/dashboard_mock_output_validation/reports/`
- `demos/demo_v0_3/dashboard_mock_output_validation/summaries/`
- `web/dashboard/test_fixtures/pre_hardware_node00_master_sample.jsonl`

## Notes

This issue prepares the dashboard for future fixture loading and later real Web Serial comparison.
