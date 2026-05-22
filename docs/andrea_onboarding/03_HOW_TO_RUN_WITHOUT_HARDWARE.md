# 03 — How to Run Without Hardware

Status: local run guide  
Audience: Andrea  
Hardware required: no

## Purpose

This file explains what Andrea can run without ESP32 hardware.

These commands generate or validate simulated output. They do not test real hardware.

## 1. Enter the repository

```bash
cd ~/microbot-labs
```

## 2. Run NODE_00_MASTER simulated responder

```bash
python3 tools/offline/mock_node00_master_responder.py
```

This generates simulated logs and reports under:

```text
demos/demo_v0_3/pre_hardware_mock_node00_master/
```

Expected interpretation:

```text
PRE_HARDWARE_SIMULATED
```

Not hardware validation.

## 3. Validate NODE_00 simulated JSONL against dashboard parser model

```bash
python3 tools/offline/validate_dashboard_mock_output.py
```

This generates reports under:

```text
demos/demo_v0_3/dashboard_mock_output_validation/
```

Expected result:

```text
PASS
```

Meaning:

```text
The simulated NODE_00 output is compatible with the dashboard-facing parser model.
```

Not meaning:

```text
ESP32 Web Serial has been tested.
```

## 4. Run NODE_01_LED_STATE simulated responder

```bash
python3 tools/offline/mock_node01_led_state_responder.py
```

This generates simulated logs and reports under:

```text
demos/demo_v0_3/pre_hardware_mock_node01_led_state/
```

Expected simulated states:

```text
READY
ACTIVE
WARNING
ERROR
IDLE
SAFE_MODE
```

Expected simulated virtual LED modes:

```text
OFF
ON
BLINK_SLOW
BLINK_FAST
BLINK_SAFETY
```

Not meaning:

```text
A real LED changed state.
```

## 5. Open dashboard manually

```bash
open web/dashboard/index.html
```

Current dashboard mode is offline/mock. It is not yet real ESP32 Web Serial validation.

## 6. Check Git status

```bash
git status
```

Expected clean state:

```text
nothing to commit, working tree clean
```
