# 00 — Start Here, Andrea

Status: onboarding overview  
Created: 2026-05-16

## What this repository is

This repository, `microbot-labs`, is the current clean technical baseline for Anton's MicroBot project.

The project is about building a staged MicroBot ecosystem: first documentation and architecture, then offline/mock validation, then simulated nodes, then dashboard/parser validation, then real ESP32 validation, and only later physical node expansion.

It is not currently a finished robot. It is not currently a validated physical swarm. It is a structured pre-hardware and hardware-ready repository.

## What Anton has already done

Anton has already built a strong foundation:

- a clean repository structure;
- a v0.3 status model;
- a current evidence page;
- a map of external/satellite repositories;
- NODE_00_MASTER firmware target;
- NODE_01_LED_STATE firmware target;
- NODE_00 pre-hardware simulation;
- NODE_01 pre-hardware simulation;
- generated simulated logs and reports;
- dashboard/mock-output integration notes;
- offline dashboard parser validation;
- ESP32 setup and purchase readiness documents.

## What still needs hardware

The next real transition requires ESP32 hardware.

The first real hardware milestone is:

    PC -> USB Serial -> ESP32 NODE_00_MASTER -> structured response -> hardware log/report

The second real hardware milestone is:

    PC or Master -> ESP32 NODE_01_LED_STATE -> visible LED state -> serial/log/photo evidence

## What Andrea should check first

Andrea should check whether the project is understandable, whether the claims are honest, whether the validation method makes sense, and whether the first hardware milestone is realistic.
