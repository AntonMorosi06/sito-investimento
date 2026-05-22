# MicroBot Labs — Demo Runbook v0.1

## 1. Purpose

This document defines the first public demo runbook for MicroBot Labs v0.1.

The goal of the runbook is to transform the MicroBot architecture into a concrete, repeatable and recordable demonstration.

The demo must not be a long chaotic explanation. It must be a short, clear and controlled sequence showing that MicroBot is an ecosystem where hardware, firmware, dashboard, telemetry, simulation, safety and documentation work together.

The core chain to demonstrate is:

PC Controller -> Dashboard -> Master ESP32 -> Nodes -> Response -> Telemetry -> Simulation -> Public Output

The demo must make one idea obvious:

MicroBot is not a single isolated robot. It is a modular ecosystem for distributed robotic nodes, real-time control, telemetry and simulation.

## 2. Source Alignment

This runbook is aligned with the full MicroBot documentation base.

| Source Document | Role in this runbook |
|---|---|
| MicroBot_Documento_10_Demo_Script_Runbook.pdf | Primary source for demo structure, storyboard, spoken script, setup, fallback, safety and publishable outputs |
| MicroBot_Documento_11_Pitch_Deck_Content_Strategy.pdf | Source for presentation language, demo integration, pitch structure and public communication |
| MicroBot_Roadmap_6_Mesi_Prototipi_Reali.pdf | Source for six-month demo target, Master, six nodes, dashboard, simulation, mockup and output expectations |
| MicroBot_Documento_05_PC_Controller_Dashboard_Specification.pdf | Source for dashboard panels, demo mode, serial connection and telemetry visualization |
| MicroBot_Documento_04_Firmware_Communication_Protocol.pdf | Source for PING, STATUS, SET_MODE, STOP, telemetry, heartbeat and node identity |
| MicroBot_Documento_07_Testing_Validation_Plan.pdf | Source for validation criteria and repeatable testing |
| MicroBot_Documento_09_Risk_Safety_Document.pdf | Source for safe demo procedure, STOP, timeout, safe mode and camera/privacy rules |
| Documentazione_microbot.pdf | Mother document for MicroBot as distributed architecture and ecosystem |
| prototipo_fisico e fondamento teorico del sistema.pdf | Source for LED/ESP32 prototype progression and physical validation logic |
| piano di acquisto e organizzazione microbot.pdf | Source for Home Lab setup, bench organization and documentation workflow |
| Senza nome.pdf | Source for cautious dimensional language and distinction between model, visualization and physical claim |

External references used as practical anchors:

| External Area | Role |
|---|---|
| OBS Studio recording workflow | Practical reference for screen/camera/audio source separation during demo recording |
| GitHub README rendering | Practical reference for creating assets that are useful when the repository is viewed publicly |

## 3. Demo Positioning

The public demo must be honest and technically defensible.

Correct statement:

MicroBot v0.1 is a laboratory demonstrator that validates the basic control chain between a PC Controller, an ESP32 Master, specialized nodes, telemetry, dashboard state and simulation.

Incorrect statement:

MicroBot v0.1 is already a finished miniaturized programmable matter product.

Correct statement:

The simulation maps physical and virtual node states into spatial, temporal, configurational, energetic and informational variables.

Incorrect statement:

The simulation physically proves higher dimensions.

Correct statement:

The black MicroBot shell is a visual and CAD direction, while the functional electronics may be larger and easier to debug.

Incorrect statement:

The small visual mockup already contains the complete final electronics.

## 4. Demo Versions

The demo should exist in multiple versions.

| Version | Duration | Use |
|---|---:|---|
| Short video | 90-120 seconds | Portfolio, LinkedIn, GitHub README and quick sharing |
| Technical video | 5-10 minutes | Professors, collaborators, university presentation and technical review |
| Live demo | 5-15 minutes | In-person explanation, lab meeting or pitch |
| Offline fallback demo | 2-5 minutes | When hardware is incomplete or unavailable |
| Full internal rehearsal | 20-40 minutes | Debugging, validation and recording preparation |

The first public version should be the short video.

The technical video can be produced after the first working chain is stable.

## 5. Core Message

The central spoken message is:

MicroBot Labs is an experimental platform for studying distributed robotic systems. In this demo, a PC Controller sends commands to an ESP32 Master. The Master coordinates specialized nodes for state, proximity, docking, motion, telemetry and vision. The dashboard shows commands, logs and safety state, while the simulation maps the physical and virtual node states into a visual environment.

Short version:

MicroBot connects hardware, firmware, dashboard and simulation into one observable distributed robotics ecosystem.

One-line version:

MicroBot is a modular robotics platform where simple nodes become a coordinated system through software, telemetry and simulation.

## 6. Demo Architecture

The demo must make the architecture visible.

| Layer | Function | Visible Output |
|---|---|---|
| Physical Layer | Master ESP32 and node prototypes | LEDs, sensors, servo, OLED, camera, mockup |
| Firmware Layer | Commands, states, heartbeat and node responses | Serial output, node state, STOP response |
| Dashboard Layer | User control, logs, node cards and telemetry | UI panels, terminal, safety panel |
| Simulation Layer | Visual mapping of system state | 3D/4D/5D/6D node representation |
| Documentation Layer | GitHub, README, runbook and evidence | Screenshots, logs, videos and notes |

Minimum visible chain:

Dashboard command -> Master response -> Node output -> Dashboard update -> Simulation update

## 7. Demo Material

Required material for the complete v0.1 demo:

| Item | Required | Notes |
|---|---|---|
| Mac or PC | yes | Runs dashboard, serial bridge, simulation and recording |
| ESP32 Master | yes | NODE_00_MASTER |
| USB data cable | yes | Must support data, not only charging |
| NODE_01_LED_STATE | yes for first demo | Minimum physical node |
| NODE_02_PROXIMITY_SAFETY | optional/next | Can be simulated initially |
| NODE_03_MAGNETIC_DOCKING | optional/next | Can use Hall sensor and magnet |
| NODE_04_MOTION_ACTUATOR | optional/next | Servo/vibration must be safely powered |
| NODE_05_TELEMETRY_SENSOR | optional/next | IMU/OLED telemetry |
| NODE_06_VISION_CAMERA | optional/next | Camera status or fallback webcam |
| Dashboard | yes | Command, telemetry, log and safety interface |
| Simulation | yes | At least virtual node state mapping |
| Black MicroBot mockup | recommended | Visual concept and pitch asset |
| Phone or camera | yes | Table shot or secondary angle |
| Screen recorder | yes | Records dashboard and simulation |
| Microphone | recommended | Spoken explanation |
| Lighting | recommended | Clean video |
| Labels | recommended | NODE_00 to NODE_06 physical labels |

Minimum demo material:

PC + dashboard + Master ESP32 + NODE_01 LED + simulation placeholder + STOP button.

## 8. Workbench Setup

The workbench should be clean, understandable and safe.

| Zone | Content |
|---|---|
| Left side | PC or laptop showing dashboard |
| Center | Master ESP32 and primary node |
| Right side | Additional nodes or mockup |
| Background | Neutral surface |
| Front area | Labels visible to camera |
| Separate area | Magnets, batteries, tools and spare components |

Workbench rules:

| Rule | Reason |
|---|---|
| No liquids | Protect electronics |
| No loose metal objects | Avoid shorts and magnet issues |
| Cables organized | Avoid confusion and accidental unplugging |
| Node labels visible | Make the video understandable |
| STOP visible | Show safety and control |
| Mockup separated if unpowered | Avoid confusing visual concept with functional hardware |

## 9. Recording Setup

The demo should produce usable video evidence.

Recommended recording sources:

| Source | Purpose |
|---|---|
| Screen recording | Dashboard, terminal and simulation |
| Phone or camera | Physical prototype, LEDs, sensors and mockup |
| Microphone | Spoken explanation |
| Optional second camera | Close-up on node behavior |
| Screenshot capture | README, pitch and GitHub assets |

Recommended recording layout:

| Scene | Sources |
|---|---|
| Scene 1 — Intro | MicroBot mockup or render, title overlay |
| Scene 2 — Architecture | README diagram or architecture SVG |
| Scene 3 — Dashboard | Screen capture of dashboard |
| Scene 4 — Hardware close-up | Phone/camera view of Master and nodes |
| Scene 5 — Simulation | Screen capture of simulation panel |
| Scene 6 — Safety | Dashboard STOP and safe mode view |
| Scene 7 — Roadmap | GitHub README or roadmap slide |

If using OBS or another recorder, separate scenes should be created for screen, camera, audio and close-up. This makes the recording easier to repeat and edit.

## 10. Preflight Checklist

Before recording or presenting, complete this checklist.

| Check | Required Result | Status |
|---|---|---|
| Repository clean | git status is clean | To do |
| README opens | README shows title, diagrams and docs | To do |
| Dashboard opens | No critical console errors | To do |
| Serial connection ready | Master port visible | To do |
| Master firmware loaded | NODE_00_MASTER boots | To do |
| NODE_01 ready | LED state node connected or simulated | To do |
| Additional nodes ready | Nodes connected, simulated or marked as fallback | To do |
| STOP tested | STOP changes system state | To do |
| Emergency stop tested | Emergency state visible | To do |
| Simulation opens | Nodes visible or placeholder available | To do |
| Camera privacy checked | No accidental recording of private data | To do |
| Screen recorder ready | Correct screen and audio selected | To do |
| Table camera ready | Prototype visible and focused | To do |
| Output folder ready | screenshots, video and logs can be saved | To do |
| Fallback mode ready | Offline demo can run if hardware fails | To do |

Do not start the public recording if STOP and fallback are not ready.

## 11. Demo Storyboard

The recommended public storyboard has 14 scenes.

| Scene | Action | Purpose | Suggested Overlay |
|---:|---|---|---|
| 0 | Show title and black MicroBot mockup | Establish concept and identity | MicroBot Labs — Demo v0.1 |
| 1 | Explain the vision briefly | Show that this is an ecosystem | From idea to distributed prototype |
| 2 | Show architecture diagram | Give mental order | PC Controller / Master / Nodes / Simulation |
| 3 | Open dashboard and connect Master | Show PC talks to hardware | Master online |
| 4 | Run PING or SCAN | Show identity and state | NODE_00_MASTER ready |
| 5 | Activate NODE_01 LED state | Validate visible command output | NODE_01 ACTIVE |
| 6 | Demonstrate NODE_02 proximity | Show sensing or fallback | Distance warning |
| 7 | Demonstrate NODE_03 docking | Show magnet or simulated docking | Docking state detected |
| 8 | Demonstrate NODE_04 motion | Show actuator or simulated motion | Motion active |
| 9 | Demonstrate NODE_05 telemetry | Show IMU/OLED/sensor packet | Telemetry streaming |
| 10 | Demonstrate NODE_06 vision | Show camera status or fallback | Vision node ready |
| 11 | Show simulation update | Link physical state to virtual state | Dimensional engine active |
| 12 | Press STOP or EMERGENCY_STOP | Show safety and control | Global STOP complete |
| 13 | Show roadmap and GitHub | Close with next steps | Toward programmable matter |

The demo can be shortened by using only scenes 0, 2, 3, 5, 11, 12 and 13.

## 12. Spoken Script — Short Version

This is the recommended 90-120 second spoken script.

Scene 0:

This is MicroBot Labs v0.1, an experimental platform for connecting physical prototypes, a central controller, a PC dashboard and a simulation layer.

Scene 1:

The goal is not to present a finished industrial micro-robot. The goal is to validate the first working chain of a modular robotic ecosystem.

Scene 2:

The architecture is simple: the PC Controller sends commands to an ESP32 Master. The Master coordinates specialized nodes, each responsible for one function: state, proximity, docking, motion, telemetry and vision.

Scene 3:

Here I connect the Master to the dashboard. The dashboard shows connection state, commands, logs, node cards, telemetry and safety state.

Scene 4:

The first physical node is the LED State Node. When I send a command, the node changes state and the dashboard records the response.

Scene 5:

Other nodes validate the next functions: sensing, magnetic docking, motion, telemetry and camera status. Some can be physical and some can be simulated during the early v0.1 phase.

Scene 6:

The simulation maps the system state into a visual model. It represents position, time evolution, configuration, vibration, energy, information and safety as computational layers.

Scene 7:

Finally, the STOP command demonstrates that safety is part of the architecture. The system must always remain observable and controllable.

Scene 8:

This demo is the first step toward a larger MicroBot platform: physical prototypes, dashboard, simulation, documentation and future swarm behavior.

## 13. Spoken Script — Technical Version

This version can be used for a 5-10 minute technical video.

MicroBot Labs is an experimental robotics and simulation project focused on modular robotic nodes, embedded systems, telemetry dashboards and simulation.

The key idea is to avoid starting from a single complex robot. Instead, the system is decomposed into a Master controller and specialized nodes. Each node validates one function that will later contribute to a larger distributed system.

The v0.1 architecture starts with a PC Controller. The PC runs the dashboard, serial bridge, logs and simulation. The dashboard sends commands using a structured protocol. The ESP32 Master receives those commands, maintains the system state, routes messages to nodes and reports telemetry back to the dashboard.

The six node roles are LED State, Proximity Safety, Magnetic Docking, Motion Actuator, Telemetry Sensor and Vision Camera. In the early prototype, not every node must be fully physical. The system can work in hybrid mode, with one real node and several simulated nodes.

The first physical validation is the LED State Node. This is intentionally simple, because it proves the essential chain: software command, firmware state, electrical output and visible physical result.

The dashboard is the operator cockpit. It must show connection state, node state, command history, telemetry, errors, safety mode and simulation mapping. The dashboard is not only a UI; it is part of the observability and safety layer.

The simulation engine maps physical and virtual node states into a visual environment. The dimensional language is used as a computational model: 3D for position, 4D for time evolution, 5D for configuration or vibration, and 6D for energy, information and safety. This is not a claim of new physics; it is a way to visualize a complex state space.

The safety layer is mandatory. STOP, timeout, heartbeat, safe mode and offline detection are part of the demo. If a node does not respond or an actuator remains active too long, the system must enter a safe state and show it clearly.

The final output of this demo is not only the video. The output is a documented validation package: screenshots, logs, README updates, diagrams, test results and a roadmap toward v0.2.

## 14. Technical Demo Sequence

Use this sequence when recording the first real video.

| Step | Action | Expected Output | Evidence |
|---:|---|---|---|
| 1 | Show mockup or render | Viewer sees MicroBot concept | Video intro |
| 2 | Show README architecture diagram | Viewer understands system structure | Screen recording |
| 3 | Open dashboard | UI appears without error | Screen recording |
| 4 | Connect Master | Dashboard state becomes CONNECTED | Log screenshot |
| 5 | Send PING | Master returns OK/PONG | Terminal log |
| 6 | Send STATUS | Master returns READY | Node card screenshot |
| 7 | Send SCAN_NODES | Node table appears | Dashboard screenshot |
| 8 | Send SET_LED to NODE_01 | LED changes state | Camera close-up |
| 9 | Send READ_DISTANCE or simulated packet | Proximity panel updates | Dashboard screenshot |
| 10 | Send READ_MAGNETIC or simulated packet | Docking state updates | Dashboard screenshot |
| 11 | Send SET_SERVO or simulated motion | Motion panel updates | Video clip |
| 12 | Send READ_TELEMETRY | Telemetry panel/log updates | Log evidence |
| 13 | Send CAMERA_STATUS | Vision panel shows ready/offline/fallback | Screenshot |
| 14 | Show simulation | Virtual nodes update | Screen recording |
| 15 | Press STOP_ALL | System returns safe | Safety log |
| 16 | Show roadmap | Viewer understands next phase | README/slide capture |

## 15. Fallback Demo

The fallback demo is not a failure. It is a controlled demonstration mode.

Use fallback mode when hardware is incomplete, disconnected or unstable.

| Missing Element | Fallback |
|---|---|
| Master unavailable | Use simulated Master response |
| NODE_01 unavailable | Use dashboard mock state and explain physical target |
| NODE_02 unavailable | Inject sample distance telemetry |
| NODE_03 unavailable | Inject magnetic_level and docked values |
| NODE_04 unavailable | Use visual servo indicator only |
| NODE_05 unavailable | Use recorded IMU or mock telemetry |
| NODE_06 unavailable | Use camera status placeholder or PC webcam panel |
| Simulation unavailable | Show architecture diagrams and dashboard logs |
| Camera recording fails | Use screen recording and photos |

Fallback rule:

Always say what is real, what is simulated and what is planned.

## 16. Safety During Demo

Safety must appear inside the demo.

| Safety Action | Why It Matters |
|---|---|
| Show STOP button | Proves the system is controllable |
| Use low power first | Reduces electrical risk |
| Keep actuator movement short | Prevents overheating and mechanical stress |
| Avoid uncontrolled coil activation | Reduces thermal and inductive risk |
| Keep camera demo privacy-safe | Avoids real biometric data in public assets |
| Mark offline nodes clearly | Prevents fake completeness |
| Use labels and organized wiring | Reduces confusion and improves video clarity |
| Log errors instead of hiding them | Makes the demo technically credible |

Safety line to say during demo:

The system is designed to fail safely. If a node is offline, if a command times out, or if STOP is pressed, the dashboard and simulation show the protected state.

## 17. Camera and Privacy Rules

The camera part of the demo must remain controlled.

| Rule | Meaning |
|---|---|
| Use camera status first | Prove NODE_06 state before streaming |
| Do not store face datasets | Not needed for v0.1 |
| Use controlled scene | Prototype object, desk or mock target |
| Show privacy-safe mode | Camera can be OFFLINE or READY without recording |
| Avoid accidental background | Keep private space out of frame |
| Mention fallback | Webcam or placeholder can replace ESP32-CAM in v0.1 |

Camera statement:

In this v0.1 demo, the vision node is treated as a camera-status and controlled vision module. It is not a finished biometric security system.

## 18. Output Folder Structure

The demo should produce organized files.

Recommended future output structure:

demos/
  demo_v0_1/
    README.md
    video/
      short_demo_90s.mp4
      technical_demo_5min.mp4
    screenshots/
      dashboard_master_online.png
      node_grid.png
      simulation_state.png
      safety_stop.png
    photos/
      master_esp32.jpg
      node_01_led_state.jpg
      microbot_black_mockup.jpg
    logs/
      serial_demo_log.txt
      telemetry_demo_log.json
    notes/
      demo_script.md
      issues_found.md
      next_actions.md

The public repository may include screenshots and notes first. Large videos can be linked later from a portfolio or release page.

## 19. Public Assets to Produce

| Asset | Use |
|---|---|
| Short demo video | Portfolio, LinkedIn, README |
| Technical demo video | Professors, collaborators, GitHub |
| Dashboard screenshot | README and pitch deck |
| Architecture screenshot | README and presentation |
| Simulation screenshot | README and pitch deck |
| Hardware photo | Portfolio and documentation |
| Mockup photo | Visual identity |
| Serial log | Validation evidence |
| Telemetry log | Testing report |
| One-page demo summary | External sharing |

Minimum public asset set:

| Asset | Required Before Public GitHub |
|---|---|
| README with diagrams | yes |
| One dashboard screenshot | recommended |
| One prototype photo | recommended |
| One simulation screenshot | recommended |
| One short demo note | yes |
| One safety note | yes |

## 20. Demo README Template

When the first demo folder is created, it should include this structure.

Title:

MicroBot Labs Demo v0.1

Sections:

| Section | Content |
|---|---|
| Goal | What the demo validates |
| Setup | Hardware, dashboard and simulation setup |
| Sequence | Step-by-step demo flow |
| Evidence | Screenshots, photos, logs and video |
| What is real | Physical components currently working |
| What is simulated | Virtual nodes, fallback states and demo packets |
| Safety | STOP, safe mode and privacy notes |
| Limitations | What is not yet implemented |
| Next steps | What v0.2 will improve |

## 21. Demo Success Criteria

The demo is successful when:

| Criterion | Success Condition |
|---|---|
| Understandability | Viewer understands the project in less than 2 minutes |
| Architecture clarity | PC, Master, nodes, dashboard and simulation are visible |
| Hardware evidence | At least one real physical output is shown |
| Protocol evidence | Command and response are visible |
| Dashboard evidence | State/log/telemetry updates are visible |
| Simulation evidence | Virtual state changes after command or telemetry |
| Safety evidence | STOP or SAFE_MODE is demonstrated |
| Honesty | Real and simulated parts are clearly distinguished |
| Publishability | Screenshots, video and notes can be reused |
| Next-step clarity | Viewer understands the roadmap |

Minimum success for v0.1:

A PC command changes NODE_01 state, the dashboard logs the event, and the simulation reflects the state change.

## 22. Common Failure Cases

| Failure | Public Handling |
|---|---|
| Master does not connect | Show fallback mode and explain serial connection target |
| Node does not respond | Mark OFFLINE and show node card behavior |
| LED does not change | Show log, debug state and explain expected behavior |
| Sensor noisy | Show WARNING or uncertain state |
| Simulation not synced | Show manual state mapping and explain next step |
| Camera fails | Use CAMERA_STATUS fallback |
| Servo unstable | Keep in simulated mode until power is safe |
| STOP not working | Do not record public demo until fixed |
| Video recording bad | Re-record after fixing lighting/audio |
| Demo too long | Cut to short version and move detail into technical video |

Failure rule:

A controlled failure with clear logs is better than hiding a broken state.

## 23. Release Gate Before Publishing Demo

Before publishing any demo asset, check:

| Check | Required |
|---|---|
| No private files visible | yes |
| No personal addresses visible | yes |
| No private browser tabs visible | yes |
| No secret tokens visible | yes |
| No uncontrolled face/camera data | yes |
| No unsafe wiring presented as final | yes |
| No false claim of finished product | yes |
| Simulation described as model | yes |
| STOP/safety mentioned | yes |
| GitHub README updated | yes |
| Screenshots readable | yes |
| Audio understandable | yes |

## 24. Short Demo Video Structure

Recommended 90-120 second structure:

| Time | Content |
|---:|---|
| 0-10 s | Title, mockup or render, one-line project identity |
| 10-25 s | Architecture diagram: PC -> Master -> Nodes -> Simulation |
| 25-40 s | Dashboard connects to Master |
| 40-55 s | NODE_01 changes state |
| 55-70 s | One sensor/telemetry or simulated node update |
| 70-90 s | Simulation changes state |
| 90-105 s | STOP / safety |
| 105-120 s | Roadmap and GitHub/portfolio closing |

## 25. Technical Demo Video Structure

Recommended 5-10 minute structure:

| Section | Duration |
|---|---:|
| Project overview | 30-60 s |
| Architecture | 60-90 s |
| Hardware setup | 60-120 s |
| Dashboard and protocol | 60-120 s |
| Node demonstrations | 2-4 min |
| Simulation mapping | 60-120 s |
| Safety and STOP | 30-60 s |
| Roadmap and next steps | 30-60 s |

## 26. Demo Notes for Different Audiences

| Audience | Emphasis |
|---|---|
| Professor | Technical method, documentation, validation and roadmap |
| Collaborator | Architecture, modules, repository and tasks |
| Investor | Vision, staged roadmap, demo evidence and educational/prototyping direction |
| Maker community | Buildability, ESP32, sensors, dashboard and open documentation |
| GitHub visitor | README clarity, diagrams, screenshots and reproducibility |
| Boston/networking contact | Short pitch, GitHub link, demo video and technical identity |

## 27. Next Implementation Step

After this file, the next public document should be:

docs/github_publication_readiness_v0_1.md

That file should define what remains before pushing the repository to GitHub:

- README rendering check
- diagram rendering check
- no private files
- screenshots
- repository topics
- description
- GitHub private/public decision
- first release notes
- pinned repository strategy
- portfolio link strategy

The demo runbook defines how to show MicroBot.

The publication readiness file defines when the repository is ready to be pushed and shared.

## 28. Version Notes

Version: v0.1  
Repository: microbot-labs  
Document role: Public demo runbook  
Project phase: Pre-startup foundation / physical demonstrator planning  
Main scope: demo setup, storyboard, spoken script, hardware-dashboard-simulation sequence, fallback mode, recording, safety and publishable outputs  
Next document: github_publication_readiness_v0_1.md
