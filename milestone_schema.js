// Embedded in schema "definitions"
if (coherence_score >= 95.4) {
  human_review_required = false;
  routing = "AUTONOMOUS_FLOW";
  actor_type = "HOUTL";
  oversight = "HOTL monitoring only";
}

if (coherence_score < 95.4) {
  human_review_required = true;
  routing = "HUMAN_REVIEW_REQUIRED";
  actor_type = "HITL";
  timeline = "7 days (T1/T2) or 14 days (T3A/T3B)";
}

// Override conditions (force human review even if coherence ≥95.4)
if (entrapment_detected || policy_shuffle_level >= 6 || dignity_score < 85) {
  human_review_required = true;  // FORCED
  routing = "FORCED_HUMAN_REVIEW";
  priority = "HIGH";
}
