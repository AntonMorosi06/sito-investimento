# MicroBot Public Website — Content Safety Audit

Date: 2026-05-22  
Repository: `AntonMorosi06/sito-investimento`  
Branch: `gh-pages`  
Audit type: public repository / GitHub Pages exposure review  
Status: reviewed, public-safe with minor tightening recommended

## 1. Purpose

This document records a public-content safety review of the MicroBot investment / portfolio website.

The goal is to distinguish between material that is safe to keep public and material that should remain private because it may expose intellectual property, personal data, business strategy, unfinished claims, hardware replication details, or non-validated technical statements.

This audit does not replace legal advice, patent advice, or a formal intellectual property review. It is an operational publication-control document for repository hygiene and portfolio safety.

## 2. Executive finding

The repository can remain public as a portfolio and demonstration website.

No obvious API tokens, passwords, private keys, identity documents, personal addresses, phone numbers, or private administrative documents were identified during this audit pass.

The main risk is not secret leakage. The main risk is interpretation: the public website contains strong visual claims, simulated dashboard values, live-style labels, investment language, performance numbers, and technical sections that could be misread as hardware-validated results.

This risk is mitigated by the existing `LICENSE`, `NOTICE.md`, `PUBLICATION_NOTICE.md`, and README notices. The next improvement should be to add an even more visible on-page notice near the hero/dashboard sections explaining that values are simulated, conceptual, or target values unless supported by validation evidence.

## 3. Repository-level status

Current publication boundary:

- Public website: acceptable for portfolio, demonstration, project presentation, collaborator review, and early concept communication.
- Private repositories: should continue to hold full firmware, final CAD, detailed internal schematics, investor strategy, proprietary algorithms, private business planning, and sensitive documents.
- Public documentation: acceptable when it remains clearly marked as prototype, pre-hardware, planned, simulated, or non-final.

## 4. Files and areas reviewed

Reviewed or sampled areas:

- `index.html`
- `README.md`
- `LICENSE`
- `NOTICE.md`
- `PUBLICATION_NOTICE.md`
- `dashboard/index.html`
- `docs/current_status.md`
- `docs/business/README.md`
- `docs/hardware_bill_of_materials_v0_1.md`
- `docs/purchase/minimum_bom_amazon_search_list_v0_3.md`
- `js/main.js`

## 5. Positive findings

### 5.1 License and rights notice

The repository now includes an All Rights Reserved license. This is appropriate for a public MicroBot presentation repository because the project is not intended to be freely reused, copied, modified, sold, or redistributed.

### 5.2 Publication notice

`PUBLICATION_NOTICE.md` correctly states that this repository is a public portfolio and demonstration version of MicroBot. It correctly explains that the material is intended to communicate vision, architecture, interface design, simulation concepts, documentation structure, and selected prototype work, not to release the complete private technical implementation.

### 5.3 Dashboard truth-state

The dashboard is one of the strongest publication-safe areas because it explicitly marks itself as:

- `v0.3 PRE-HARDWARE`
- `PRE_HARDWARE_SIMULATED`
- `NOT HARDWARE-VALIDATED`
- `SIX NODE MOCK ACTIVE`

This is the correct language. It protects the project from inflated claims and makes the evidence boundary clear.

### 5.4 Business package boundary

The business package README correctly states that the project is pre-company, pre-revenue, not hardware-validated, and should not be presented as having paying customers, signed partnerships, validated hardware, industrial readiness, or certified educational adoption.

### 5.5 BOM boundary

The public BOM is detailed enough to be useful for a laboratory demonstrator but does not appear to expose final proprietary design files, final electrical schematics, final CAD, final firmware, or a complete industrial replication package.

It is acceptable to keep this BOM public if the goal is educational transparency and portfolio credibility. If the project later moves toward patenting, startup formation, external funding, or productization, the public BOM should be reviewed again.

## 6. Risks found

### 6.1 Strong hero and dashboard metrics

The public landing page currently uses very strong visual values such as active bot counts, tracking FPS, precision, latency, unit cost, packet rate, RSSI, battery assumptions, terminal status, and other live-style metrics.

These values are visually useful, but they should be interpreted as demo values, simulated states, targets, or non-final assumptions unless accompanied by test evidence.

Recommended improvement: add a visible note in the landing page near the hero/dashboard sections:

> Public demo notice: values shown on this page are simulated, conceptual, or target values unless explicitly linked to hardware validation logs or measurement reports.

### 6.2 Investment language

The website includes an `Investor Control Room` section and business-related links. This is acceptable for a portfolio/pitch website, but the public copy should avoid implying formed company status, revenue, customers, validated product readiness, or protected IP unless those facts are documented.

Recommended wording discipline:

- Use: project, prototype, pre-company, pre-revenue, public demo, portfolio evidence, early-stage technical project.
- Avoid: product-ready, industrial-ready, validated swarm, guaranteed performance, patented system, deployable platform, investor-ready company.

### 6.3 Public BOM and component lists

The public BOM is not a severe leak because it uses generic components and educational/lab items. However, it still makes the first physical prototype path easier to reproduce.

Recommended boundary:

- Keep public: minimum lab BOM, generic ESP32 starter list, safety checklist, test evidence requirements.
- Keep private: final component selection, exact dimensions, final wiring diagrams, PCB files, final CAD, detailed coil/magnet geometry, tuned control parameters, supplier-specific procurement strategy.

### 6.4 Old wording in current status

`docs/current_status.md` still mentions `MIT License` in its historical public foundation list. Since the active license is now All Rights Reserved, future cleanup should update that historical wording to avoid confusion.

## 7. Recommended changes

Priority 1 — high value, low risk:

- Keep the repository public.
- Keep `LICENSE`, `NOTICE.md`, and `PUBLICATION_NOTICE.md`.
- Add or preserve a visible website notice explaining simulated/target values.
- Update any old `MIT License` references in documentation.

Priority 2 — portfolio polish:

- Add a `Public Demo / Not Hardware Validated` badge near the hero and dashboard sections.
- Add a link from the landing page to `PUBLICATION_NOTICE.md`.
- Add a link from the README to this audit file.
- Keep the dashboard labels because they are already correctly marked as simulated/pre-hardware.

Priority 3 — future IP safety:

- Move final firmware, final CAD, full schematics, tuned magnetic parameters, exact geometry, and business strategy into private repositories only.
- Review the public repository again before sharing with investors, incubators, professors, or external collaborators.
- If patenting is considered, pause publication of new detailed technical material and consult a qualified IP professional before disclosure.

## 8. Public/private classification

| Area | Public status | Recommendation |
|---|---|---|
| Landing page vision | Public-safe | Keep, add demo/target caveat |
| Dashboard mock | Public-safe | Keep, already says pre-hardware/simulated |
| Business README | Public-safe | Keep, conservative and honest |
| Current status | Public-safe | Update old MIT wording later |
| Public BOM | Acceptable with caution | Keep generic, do not add final design secrets |
| Hardware validation plans | Public-safe | Keep if marked not hardware-validated |
| Full firmware | Private | Do not publish final deployment version |
| Final CAD / PCB / schematics | Private | Do not publish until strategy is decided |
| Investor strategy | Private | Keep internal |
| Personal documents | Private | Never publish |
| Certificates with sensitive metadata | Private or curated public | Publish only cleaned showcase assets |

## 9. Final audit conclusion

The public site is useful and should not be taken down. It is good for visibility, portfolio value, collaborator discovery, and project credibility.

The repository is now substantially safer because it has All Rights Reserved licensing and a publication notice. The remaining work is mainly copy discipline: make sure public visitors understand that MicroBot is an early-stage, pre-hardware / partially simulated project with selected public documentation, not a finished industrial product or a complete release of private implementation details.
