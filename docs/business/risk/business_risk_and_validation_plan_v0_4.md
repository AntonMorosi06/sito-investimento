# MicroBot Labs — Business Risk and Validation Plan v0.4

Status: business risk analysis  
Created: 2026-05-18  
Hardware validation status: not hardware-validated

## 1. Purpose

This document identifies the main risks in turning MicroBot Labs from a technical project into a possible business.

## 2. Main risks

| Risk | Severity | Mitigation |
|---|---|---|
| Hardware not validated | High | Complete v0.4 real ESP32 serial validation |
| Scope too broad | High | Keep milestones narrow and evidence-based |
| No clear customer | High | Test with students, makers and educators |
| Too much documentation, not enough demo | Medium-high | Create short demo video after hardware validation |
| Overclaiming | High | Keep badges and docs honest |
| Not reproducible | High | Ask another person to run setup |
| No revenue validation | Medium | Start with workshop/tutorial experiment |
| Safety and liability | Medium-high | Stay low-power, educational, non-autonomous in early phase |
| Drone complexity | High | Keep drone as later roadmap, not first product |

## 3. Validation roadmap

| Stage | Validation question | Evidence |
|---|---|---|
| v0.4 | Can real ESP32 NODE_00_MASTER output be captured and validated? | Serial logs + report |
| v0.5 | Can NODE_01 physical LED state be controlled and documented? | Video/photo + log + report |
| v0.6 | Can another person reproduce the demo? | External reproduction notes |
| v0.7 | Do students/educators find it useful? | Feedback forms/interviews |
| v0.8 | Would anyone pay for workshop/tutorial? | Small paid test |
| v0.9 | Can the kit become repeatable? | BOM + setup time + failure rate |

## 4. Business evidence boundary

A business claim should never be stronger than the technical evidence.

Allowed now:

MicroBot Labs has a structured repository, dashboard, documentation, offline evidence and v0.4 hardware-validation scaffold.

Allowed after v0.4 PASS:

MicroBot Labs has validated the first real ESP32 NODE_00_MASTER serial-output path.

Not allowed yet:

MicroBot Labs has a complete physical swarm product.

