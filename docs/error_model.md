# Error / Alert Severity & "Error Bubble" Model

This document explains the severity mapping used across OBINexus projects and the error-bubble model for event-loop observation. Keep this public and technical; do not include legal trigger values here.

## Severity scale (human-friendly mapping)

We use two complementary scales: **operational severity** (production) and **development severity** (R&D / model testing).

### Production (active systems)
- **Level 1–3:** Low — monitor only; automated self-heal permitted.
- **Level 4–7:** Moderate — requires HOTL review and mitigation plan.
- **Level 8–11:** High — escalate to HITL; temporary roll-back or freeze likely.
- **Level 12–15:** Critical — governance notification; cross-team action required.
- **Level 16–20:** Emergency — invoke contingency protocols and external auditors.

*(Map numeric to labels in dashboards for readability.)*

### Development / Model testing (DAG / experiment)
- **1–3:** Low — expected noise; log and continue.
- **4–7:** Medium — investigate model drift and false positives/negatives.
- **8–11:** Elevated — test data integrity and gating logic.
- **12–15:** Warning — pause experiment, triage.
- **16–20+:** Panic — suspend model, post-mortem required.

## Error Bubble — event-loop observation model (plain English)

OBINexus systems treat errors as *bubbles* that form around an event and either dissipate or expand across cycles:

1. **Bubble formation (tick N):** an event/exception occurs (e.g., failed verification, timeout).
2. **Bubble state:** the error stores context (actor, loop type, severity score, timestamps).
3. **Bubble bubbling (tick N+1…N+k):** subsequent events referencing the same context increase the bubble size (severity increases) — repeated silence or contradictions enlarge it faster.
4. **Intervention thresholds:** when the bubble crosses configured thresholds (per severity mapping), different actors intervene:
   - small bubble → automated retry/self-heal (HOUTL)
   - medium bubble → HOTL review (audit, log enrichment)
   - large bubble → HITL escalation (governance, legal hold)
5. **Resolution / Dissipation:** corrective actions or evidence are attached; the bubble shrinks and finally closes to `COMPLETED` or becomes `BREACH_ENFORCEMENT`.

## Why this matters
- Prevents one-off errors from becoming systemic collapse by tracking contextual accumulation.
- Maps naturally to HITL / HOTL / HOUTL roles.
- Gives governance measurable signals (bubble growth rate, time-to-intervention).

## Implementation notes
- Store bubbles as small JSON objects attached to each milestone/event with GUID/UID and decay rules.
- Bubble growth factor example: `growth = base + 0.5 * repeated_occurrences + 0.2 * days_silent`
- Visualize bubbles on dashboards as concentric rings; red when critical.

