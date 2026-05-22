# MicroBot Labs — Combined NODE_00 + NODE_01 Pre-Hardware Demo Report v0.3

Status: combined pre-hardware demo report  
Created: 2026-05-16  
Hardware validation status: not hardware-validated

## Purpose

This report summarizes the current MicroBot Labs v0.3 pre-hardware demonstration. It connects the simulated NODE_00_MASTER coordinator, the simulated NODE_01_LED_STATE visible output node, dashboard-facing parser validation and the current evidence page.

The demonstrated pre-hardware chain is:

    PC / local Python tools
        -> simulated NODE_00_MASTER
        -> simulated NODE_01_LED_STATE
        -> simulated JSONL/raw logs
        -> dashboard-facing parser validation
        -> evidence reports

The future hardware chain remains:

    PC dashboard / serial tool
        -> USB Serial / Web Serial
        -> ESP32 NODE_00_MASTER
        -> ESP32 NODE_01_LED_STATE
        -> visible LED state
        -> real logs and reports

## Current maturity

Current maturity:

    PRE_HARDWARE_SIMULATED + HARDWARE_READY

Not current maturity:

    HARDWARE_VALIDATED

## NODE_00_MASTER evidence

Latest NODE_00 report:

`demos/demo_v0_3/pre_hardware_mock_node00_master/reports/pre_hardware_mock_node00_master_report_20260516T141354Z.md`

NODE_00 demonstrates boot, heartbeat, PING/PONG, STATUS, GET_NODE_TABLE, SCAN_NODES, STOP -> SAFE_MODE, RESET -> READY, JSONL/raw logs and Markdown report generation.

## Dashboard parser evidence

Latest dashboard parser validation report:

`demos/demo_v0_3/dashboard_mock_output_validation/reports/dashboard_mock_output_parser_validation_20260516T142736Z.md`

This validates simulated NODE_00 JSONL against the dashboard-facing parser model. It does not validate Web Serial hardware.

## NODE_01_LED_STATE evidence

Latest NODE_01 report:

`demos/demo_v0_3/pre_hardware_mock_node01_led_state/reports/pre_hardware_mock_node01_led_state_report_20260516T143110Z.md`

NODE_01 demonstrates PING/PONG, STATUS, ACTIVE -> virtual LED ON, IDLE -> OFF, WARNING -> BLINK_SLOW, ERROR -> BLINK_FAST, STOP -> SAFE_MODE / BLINK_SAFETY, RESET -> READY.

## Honest external summary

Allowed claim:

    MicroBot Labs has a structured documentation baseline, pre-hardware simulated NODE_00/NODE_01 behavior, generated logs/reports, dashboard parser validation and a hardware-ready ESP32 validation path.

Not allowed claim:

    MicroBot Labs has a validated physical swarm or completed ESP32 hardware system.

## What remains for hardware validation

The first hardware claim requires real ESP32 upload, real serial logs, generated hardware reports, real visible LED behavior and evidence updates.
