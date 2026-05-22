# MicroBot Labs — External Repository Map v0.3

Status: canonical repository map  
Created: 2026-05-16  
Scope: AntonMorosi06 GitHub repositories connected to MicroBot Labs  
Primary repository: `AntonMorosi06/microbot-labs`  
Audit source: Generated from local audit summary: `/Users/antonmorosi/antonmorosi06_repo_audit/reports/all_repositories_summary.json`

## 1. Purpose

This document defines the canonical relationship between `microbot-labs` and the other repositories currently present under the `AntonMorosi06` GitHub account. Its purpose is to prevent the MicroBot ecosystem from becoming an uncontrolled merge of old archives, web experiments, asset folders, simulation branches, certificate material, drone models, and documentation fragments.

The correct repository strategy is not to move everything into `microbot-labs`. The correct strategy is to keep `microbot-labs` as the clean central repository and use the other repositories as satellites, source pools, asset repositories, portfolio repositories, or private archives depending on their content and maturity.

This document should be used before adding links, importing code, copying assets, creating issues, opening public releases, or making any repository public.

## 2. Canonical rule

`microbot-labs` is the public-facing and technically curated MicroBot baseline. It should contain only material that is clear, documented, versioned, defensible, and useful for understanding the MicroBot architecture.

The external repositories may support `microbot-labs`, but they must not be blindly merged into it. A file from another repository can enter `microbot-labs` only when its role is known, its status is clear, its privacy risk has been reviewed, and its relation to the current milestone is explicit.

This repository map therefore separates the ecosystem into layers: core MicroBot, source and legacy archive, web/demo layer, simulation layer, asset and drone layer, portfolio/certificate layer, external research simulation layer, and rebuild/control workspace.

## 3. Repository index

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

## 4. Repository roles

### 4.1 `microbot-labs`

`microbot-labs` is the canonical central repository. It contains the public and technical baseline: README, current status, roadmap, architecture notes, offline validation material, dashboard baseline, firmware skeletons, demo evidence, testing checklists, GitHub milestone documents, and the controlled v0.3 transition toward ESP32 hardware validation.

This repository must stay clean. It is not a dumping ground for all MicroBot material. It should contain curated documentation, runnable or inspectable examples, explicit evidence, and links to satellite repositories.

Current canonical maturity: v0.1 documentation baseline completed, v0.2 offline/mock validation completed as a baseline, v0.3 hardware-integration planning active.

### 4.2 `finefine`

`finefine` is the large curated and legacy MicroBot source workspace. It contains the largest amount of source material, code, assets, web material, simulation branches, firmware-related material, OS/kernel-related material, and historical project layers.

It is valuable because it preserves a broad source base. It is risky because it is large, mixed, and contains potential privacy or secret findings that must be reviewed before public use. It should be treated as a source pool, not as a public polished repository.

No direct merge into `microbot-labs` is allowed. Any extraction from `finefine` must pass through a small review: file role, duplicate status, privacy status, project maturity, dependency check, and destination path.

### 4.3 `MicroBot_Web`

`MicroBot_Web` is a MicroBot web presentation and demo repository. It belongs to the web/demo layer. It may contain useful UI concepts, dashboard ideas, simulation pages, presentation language, and early web assets.

It can support future documentation and dashboard work, but it should not be treated as the single official MicroBot dashboard unless it is reviewed, cleaned, and aligned with the current `microbot-labs` protocol and v0.3 status.

### 4.4 `MICROBOT-ULTRA-WEBSITE`

`MICROBOT-ULTRA-WEBSITE` is a more presentation-oriented MicroBot website branch. It belongs to the showcase layer. It can be used for design language, high-impact UI, portfolio pages, and future public communication.

It should not be used as evidence of hardware validation. It is a visual and web-facing layer unless specific files are later connected to real protocol logs, real dashboard evidence, or documented simulation behavior.

### 4.5 `Microbot-Simulation-Core`

`Microbot-Simulation-Core` is the most natural satellite repository for the simulation branch. It can become the future dedicated repository for MicroBot node simulation, state updates, swarm behavior, telemetry visualization, scenario logic, and dimensional/state modeling.

Its content should be linked from `microbot-labs` only after the main entry points, data model, dependencies, and runnable commands are documented.

### 4.6 `drone`

`drone` is a curated drone, GLB, Blender, and 3D asset repository. It belongs to the asset and micro-drone branch of the ecosystem. It should remain separate from `microbot-labs` because binary assets, `.blend` files, `.glb` files, render images, and model sources can quickly make a repository heavy and harder to review.

`microbot-labs` may link to this repository as a visual asset or drone-integration repository, but it should not import large GLB/Blend files directly unless there is a small curated preview or documentation reason.

### 4.7 `glb_totali_micro_drone`

`glb_totali_micro_drone` is a release-asset control repository for a larger GLB and micro-drone library. Its Git tree is intentionally small, while the heavy content belongs in release assets or archive-controlled storage.

This repository should be treated as preservation and reconstruction infrastructure. It is not the place where the public MicroBot story should begin, but it is important for long-term 3D asset traceability.

### 4.8 `certificate`

`certificate` is a portfolio and certification repository. It may contain website material, certificate PDFs, profile content, and public presentation assets. It requires privacy review before publication or before being linked prominently.

This repository is not part of the MicroBot technical core, but it can support Anton's broader professional profile and portfolio. It must remain separated from technical validation claims.

### 4.9 `BLACKHOLE_SIMULATION_SYSTEM`

`BLACKHOLE_SIMULATION_SYSTEM` is an external physics/simulation project. It is useful for portfolio and simulation credibility, especially as evidence of visual physics, graphics, interface work, and experimentation.

It should not be merged into MicroBot core. It can be referenced as an adjacent research/demo project.

### 4.10 `ai-data-lab`

`ai-data-lab` is currently a low-priority AI/data laboratory repository. It can become useful later if it receives real notebooks, datasets, analysis workflows, ML demos, or telemetry analysis connected to MicroBot.

Until then, it should not be treated as a core MicroBot repository.

### 4.11 `antonmorosi06-repo-rebuild-workspace`

`antonmorosi06-repo-rebuild-workspace` is a control and reconstruction workspace. It is useful for organizing many repositories, skeletons, project maps, and portfolio reconstruction efforts.

It should be treated as an operational workspace, not as the polished final destination. Its role is to help rebuild, classify, and prepare repositories.

## 5. Import policy

A file from another repository can be copied into `microbot-labs` only if all of the following conditions are satisfied:

1. The source repository is identified.
2. The source file path is recorded.
3. The destination path in `microbot-labs` is justified.
4. The file is not private, sensitive, credential-bearing, or certificate/personal-data material.
5. The file is not a duplicate of an already cleaner document.
6. The file status is clear: planned, prepared, mocked, validated-offline, hardware-ready, or hardware-validated.
7. The file supports the current MicroBot roadmap rather than adding unrelated noise.
8. The README or relevant documentation is updated if the import affects public understanding.

## 6. Linking policy

Most satellite repositories should be linked, not merged.

`microbot-labs` may link to:

- `Microbot-Simulation-Core` for simulation engine work.
- `drone` for curated drone and 3D model assets.
- `glb_totali_micro_drone` for large GLB archive and release reconstruction.
- `MicroBot_Web` and `MICROBOT-ULTRA-WEBSITE` for web/demo history and presentation layer.
- `BLACKHOLE_SIMULATION_SYSTEM` for adjacent simulation work.
- `certificate` only after privacy review.
- `finefine` only as private source archive or internal reference, not as public polished proof.

## 7. Privacy and publication warnings

The repository audit found potential privacy or secret findings in `finefine`. These may be false positives, but they must be reviewed before any public release, public link, or file import.

Repositories that contain certificates, PDFs, personal profile material, archive material, screenshots, generated dependency folders, or raw legacy source must not be made public without review.

The publication principle is simple: publish what demonstrates competence, order, and direction; keep private what is raw, personal, duplicated, sensitive, or not yet verified.

## 8. Relationship to MicroBot documentation

This repository map is supported by the broader MicroBot documentation base: the main MicroBot documentation, the physical prototype document, the home lab and acquisition plan, the MicroBot OS documentation, the Roadmap 6 months, the Documentation 01-12 series, the GitHub publication plan, and the one-page pitch.

The documentation base defines the project vision. The repository map defines how the code and public GitHub surface should be organized.

## 9. Next actions

The next practical actions are:

1. Keep `microbot-labs` as the central canonical repository.
2. Add this repository map to the v0.3 documentation set.
3. Add a canonical status document explaining what is real, mocked, offline-validated, hardware-ready, and not yet hardware-validated.
4. Review the potential findings in `finefine`.
5. Avoid making `certificate`, `finefine`, or heavy asset repositories public until privacy and curation are complete.
6. Continue `microbot-labs` v0.3 with ESP32 hardware integration evidence, not with uncontrolled archive imports.
