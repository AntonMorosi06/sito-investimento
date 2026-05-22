# MicroBot Labs — Documentation Viewer / Reference Library Upgrade v0.3

Status: dashboard documentation viewer upgrade  
Created: 2026-05-17  
Hardware validation status: not hardware-validated  
Dashboard path: `web/dashboard/`

## Purpose

This upgrade adds an internal Documentation Viewer to the MicroBot Labs dashboard.

The goal is to make the web app usable not only as a control surface, but also as a project knowledge map for Anton, Andrea, collaborators, professors and future reviewers.

## What the viewer includes

The viewer includes:

- local repository documentation;
- current evidence and onboarding files;
- dashboard/parser/telemetry/gesture docs;
- NODE_00/NODE_01 validation documents;
- purchase/BOM references;
- MicroBot operational document series 01-12;
- roadmap and book-index references;
- mother documentation exported from Pages/PDF;
- MicroBot OS references;
- Dimension Engine / 4D-16D references;
- telemetry, camera, AI, cybersecurity and portfolio references;
- drone/GLB/Blender asset library references.

## Important privacy/evidence rule

The Documentation Viewer does not publish private PDFs.

It records private or external source documents as reference-base entries so that the project can keep intellectual continuity without accidentally exposing private files.

Local repo documents open directly only when they are present in the repository.

## Correct interpretation

This is a documentation navigation layer.

It does not validate:

- real hardware;
- real telemetry;
- real ESP32 firmware;
- real gesture-to-hardware control;
- real drone behavior.

## How to run

From the repository root:

    python3 -m http.server 8000

Open:

    http://localhost:8000/web/dashboard/index.html

Then open the sidebar item:

    Docs Viewer

## Next possible upgrade

A future upgrade can add a MicroBot OS Console or a Drone Perimeter Preview section.
