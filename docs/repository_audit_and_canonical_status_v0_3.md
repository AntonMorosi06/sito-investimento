# MicroBot Labs — Repository Audit and Canonical Status v0.3

Status: canonical status document  
Created: 2026-05-16  
Primary repository: `AntonMorosi06/microbot-labs`  
Current phase: v0.3 planning and hardware-integration preparation  
Hardware validation status: not yet hardware-validated

## 1. Purpose

This document defines the current truth-state of `microbot-labs` after the repository audit and after consolidation of the MicroBot documentation base.

The goal is to prevent confusion between documentation, mock systems, offline validation, dashboard evidence, firmware skeletons, hardware-ready plans, real hardware tests, visual assets, portfolio material, and large private archives.

This document should be treated as the canonical status reference for the next development steps.

## 2. Source hierarchy

MicroBot Labs now uses a layered source hierarchy.

The first source of truth is the actual `microbot-labs` repository. The repository state matters more than ambition, memory, or future plans. If a feature is not present in the repository, in a test report, in a log, or in committed evidence, it must not be described as completed.

The second source of truth is the repository audit. The audit identifies all currently known repositories under `AntonMorosi06`, classifies them by role, counts their files, detects broad content categories, and flags potential privacy or secret findings.

The third source of truth is the MicroBot documentation base. This includes the main MicroBot documentation, physical prototype and theoretical foundation document, home lab acquisition plan, MicroBot OS documentation, the operational Document 01-12 series, the six-month roadmap, the final book index, the GitHub publication plan, and the one-page pitch.

The fourth source is external research or online technical documentation. Online sources should be used only when needed for component specs, ESP32 behavior, Web Serial support, protocol references, safety practices, standards, or current library/tool information.

## 3. Current repository state

The current audited repository system contains eleven repositories.

| Repository | Canonical role | Tags | Files | Size MB | Docs | Code | Assets | Archives | Privacy findings |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| `ai-data-lab` | AI/data lab repository | general | 19 | 0.003 | 0 | 0 | 0 | 0 | 0 |
| `antonmorosi06-repo-rebuild-workspace` | repository rebuild and audit workspace | microbot, dashboard/web, firmware/embedded, os/kernel | 943 | 0.991 | 0 | 213 | 0 | 0 | 0 |
| `BLACKHOLE_SIMULATION_SYSTEM` | physics/simulation demo repository | simulation/physics | 59 | 0.26 | 4 | 34 | 0 | 0 | 0 |
| `certificate` | portfolio/certification website and private/public launch material | microbot, certificate/portfolio | 54 | 19.568 | 4 | 8 | 1 | 0 | 0 |
| `drone` | drone / GLB / Blender asset repository | microbot, 3d-assets/drone | 66 | 251.923 | 3 | 7 | 44 | 0 | 0 |
| `finefine` | large curated/legacy MicroBot source workspace candidate | microbot, 3d-assets/drone, dashboard/web, firmware/embedded, os/kernel | 10194 | 284.962 | 4 | 2466 | 505 | 1 | 4 |
| `glb_totali_micro_drone` | release-asset control repository for large GLB/micro-drone library | 3d-assets/drone | 7 | 0.007 | 3 | 0 | 0 | 0 | 0 |
| `microbot-labs` | central public/private MicroBot repository baseline | microbot, dashboard/web, firmware/embedded | 77 | 1.222 | 34 | 9 | 5 | 0 | 0 |
| `Microbot-Simulation-Core` | MicroBot simulation core repository | microbot | 125 | 0.257 | 6 | 62 | 0 | 0 | 0 |
| `MICROBOT-ULTRA-WEBSITE` | MicroBot web presentation/demo repository | microbot, dashboard/web | 40 | 0.138 | 4 | 17 | 0 | 0 | 0 |
| `MicroBot_Web` | MicroBot web presentation/demo repository | microbot, dashboard/web, firmware/embedded | 43 | 0.11 | 4 | 26 | 0 | 0 | 0 |

The key interpretation is that `microbot-labs` is the central curated repository, while `finefine`, `drone`, `glb_totali_micro_drone`, `certificate`, `MicroBot_Web`, `MICROBOT-ULTRA-WEBSITE`, `Microbot-Simulation-Core`, `BLACKHOLE_SIMULATION_SYSTEM`, `ai-data-lab`, and `antonmorosi06-repo-rebuild-workspace` are satellite, archive, portfolio, simulation, asset, or rebuild repositories.

## 4. Canonical maturity language

MicroBot Labs must use precise maturity language.

| Status | Meaning | Allowed claim |
|---|---|---|
| Planned | Described in roadmap or documentation but not implemented | “planned” |
| Prepared | Folder, document, skeleton, checklist, or design exists | “prepared” |
| Mocked | Behavior is simulated manually, visually, or in a browser/app without real hardware | “mocked” |
| Validated offline | A local script, dashboard, browser mock, log, or report validates structure or behavior without hardware | “validated offline” |
| Hardware-ready | Firmware, checklist, wiring plan, or test procedure is ready for hardware testing | “hardware-ready” |
| Hardware-validated | Real hardware has been tested, logged, photographed or documented against expected criteria | “hardware-validated” |
| Released | A tagged release, release note, or public baseline exists | “released” |

This language is mandatory. It prevents inflated claims and makes the project more professional.

## 5. Current canonical phase

`microbot-labs` is currently between v0.2 and v0.3.

v0.1 is the documentation and public foundation baseline. It includes project overview, architecture overview, roadmap, prototype description, BOM direction, communication protocol documentation, dashboard specification, testing checklist, safety summary, demo runbook, GitHub publication readiness, and release notes.

v0.2 is the offline validation and mock-dashboard baseline. It includes the Offline Protocol Lab, PC Controller Dashboard mock mode, structured dashboard logs, screenshots, dashboard mode clarification, Web Serial preparation, firmware skeletons, serial test tooling, hardware serial checklist, NODE_01 LED checklist, and v0.2 completion summary.

v0.3 is the hardware-integration preparation phase. It should focus on moving from mock/offline validation to real ESP32 evidence. The target is not “complete swarm robotics.” The target is a clean and documented chain:

PC Controller -> Web Serial or serial tool -> ESP32 NODE_00_MASTER -> PING/STATUS response -> STOP/RESET behavior -> dashboard/log evidence -> future NODE_01 LED hardware response.

## 6. What is real now

The following elements are real in the repository system:

- The GitHub account and repository structure.
- The `microbot-labs` central repository.
- The MicroBot documentation base.
- The v0.1 documentation baseline.
- The v0.2 offline/mock dashboard and protocol evidence.
- The dashboard code baseline.
- The Web Serial preparation files.
- The firmware skeletons for NODE_00_MASTER and NODE_01_LED_STATE.
- The Python serial test tool.
- The hardware checklist documents for future ESP32 tests.
- The repository audit of the wider AntonMorosi06 project ecosystem.
- The asset repositories and portfolio repositories as separate satellite repositories.

## 7. What is mocked or offline-validated

The following elements are mocked or offline-validated:

- Offline Protocol Lab.
- Browser-based mock Master behavior.
- Browser-based mock NODE_01 behavior.
- Dashboard command flow in offline/mock mode.
- Dashboard safety state transitions in mock mode.
- Structured JSONL dashboard/mock logs.
- Simulation placeholder state changes.
- v0.2 offline evidence screenshots and reports.

These elements are valuable, but they must be described as mock or offline validation.

## 8. What is hardware-ready but not yet hardware-validated

The following elements are hardware-ready or near hardware-ready:

- NODE_00_MASTER firmware skeleton.
- NODE_01_LED_STATE firmware skeleton.
- Serial PING/STATUS Python test tool.
- Hardware serial test checklist.
- NODE_01 LED hardware test checklist.
- Web Serial adapter preparation.
- Dashboard protocol parser.
- Dashboard hardware-only button and serial mode concept.

These elements prepare real hardware tests, but they are not proof that real hardware has already passed the tests.

## 9. What is not yet validated

The following elements are not yet hardware-validated:

- Real ESP32 Master upload and response log.
- Real NODE_01 LED state test.
- Real Web Serial dashboard-to-ESP32 connection.
- Real sensor telemetry.
- Real magnetic docking.
- Real movement or actuator control.
- Real battery safety.
- Real camera/vision integration.
- Real multi-node wireless swarm.
- Real synchronization between multiple physical nodes.
- Real hardware-to-simulation state update.

These are next-stage milestones, not completed claims.

## 10. Relationship to the six-month roadmap

The six-month roadmap defines the long operational path: PC Controller, Master ESP32, six prototypal nodes, simulation 3D/4D/5D/6D, realistic black mockup, demo video, documentation and GitHub/portfolio publication.

The current `microbot-labs` v0.3 work corresponds to the first concrete segment of that roadmap: making the chain PC -> Master -> Node -> Response -> Simulation real and documentable.

The correct next proof is not a full final MicroBot. The correct next proof is a small but real test: the PC sends a command to an ESP32 Master, receives a structured response, logs it, and maps it to dashboard state.

## 11. Relationship to the physical prototype document

The physical prototype document defines the correct progression: start from LED/ESP32 validation, evolve toward firmware-structured nodes, later wireless communication, later real sensors and telemetry, and only later real magnetic actuation.

This confirms that the current v0.3 focus must stay on real ESP32 command/response and first visible LED-state behavior. Magnetic actuation is not the next proof. It is a later phase.

## 12. Relationship to the dimensional engine documentation

The dimensional engine must be treated as a computational and visual state model.

3D represents spatial visualization. 4D can represent time/state evolution. Higher layers represent parameters such as vibration, energy, information, docking, safety, and telemetry. They are not proof of physical higher dimensions.

Any future simulation document, dashboard panel, or demo script must preserve this distinction.

## 13. Relationship to the GitHub publication plan

The GitHub publication plan states that MicroBot Labs should not publish the entire internal archive. It should publish curated, readable, technically credible material.

That rule is now mandatory for repository management.

The public story should be:

MicroBot Labs is an experimental modular robotics and simulation ecosystem. It has documentation, dashboard, firmware skeletons, offline validation, and a roadmap toward physical ESP32 validation.

It should not be:

A finished commercial robot, a completed swarm, a physical programmable-matter product, or a validated magnetic microbot system.

## 14. Required privacy controls

The audit identified potential sensitive findings in `finefine`. They must be reviewed before using that repository as a public source.

Before publication or import, review:

- potential secret/API/token patterns;
- certificates and personal documents;
- screenshots with private information;
- `.env` or config files;
- raw archive content;
- generated dependency folders;
- large binary assets;
- old duplicated material;
- files copied from third-party sources without clear license.

## 15. Next v0.3 actions

The next v0.3 actions should be narrow, testable and evidence-based.

Recommended order:

1. Create this repository map and canonical status document.
2. Review and clean the `microbot-labs` README/current status so the phase is not ambiguous.
3. Prepare real ESP32 upload instructions for NODE_00_MASTER.
4. Run NODE_00_MASTER serial PING/STATUS test.
5. Save the serial log as evidence.
6. Add a hardware test report.
7. Connect dashboard Web Serial to the real Master when browser support allows it.
8. Test NODE_01 LED state firmware.
9. Save photo/video/log evidence.
10. Only then mark specific components as hardware-validated.

## 16. Canonical statement for external readers

MicroBot Labs is currently a structured experimental robotics ecosystem with a completed documentation baseline, an offline/mock validation baseline, firmware skeletons, dashboard preparation, and a clear roadmap toward ESP32 hardware validation. The next objective is to document a real PC-to-ESP32 command/response chain and use that evidence to transition from offline validation to early hardware validation.

## 17. Summary

The repository ecosystem is now mapped. The documentation base is complete enough to support serious development. The next risk is not lack of material; the next risk is uncontrolled expansion.

The correct path is disciplined reduction: choose the smallest real next test, document it, commit the evidence, update the status, and only then expand.
