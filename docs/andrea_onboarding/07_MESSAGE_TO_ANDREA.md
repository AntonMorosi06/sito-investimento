# 07 — Message to Andrea

Andrea,

ti lascio questa cartella come mappa leggibile del progetto MicroBot Labs.

La cosa importante è questa: la repo non vuole fingere che l’hardware sia già validato. In questo momento il progetto è in una fase v0.3 pre-hardware: ci sono documentazione, firmware target, simulazioni dei nodi, report, parser validation e guide per arrivare al primo test ESP32, ma non ci sono ancora log reali da una scheda fisica.

La logica attuale è:

```text
documentazione
-> simulazione NODE_00_MASTER
-> validazione parser/dashboard
-> simulazione NODE_01_LED_STATE
-> evidence page
-> piano per ESP32 reale
```

Il primo obiettivo fisico sarà piccolo:

```text
PC -> USB Serial -> ESP32 NODE_00_MASTER -> risposta strutturata -> log/report
```

Il secondo sarà:

```text
ESP32 NODE_01_LED_STATE -> LED visibile -> log/report/foto o video
```

Quello che ti chiedo di controllare non è se “il robot è già finito”, perché non lo è. Ti chiedo di guardare se la struttura ha senso, se la documentazione si capisce, se la roadmap verso il primo prototipo fisico è credibile, e se secondo te manca qualcosa prima di comprare o collegare l’hardware.

Il file più importante è:

```text
docs/current_evidence_v0_3.md
```

La cartella che stai leggendo serve solo a farti orientare più velocemente.
