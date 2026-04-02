from dataclasses import dataclass

@dataclass
class Recommendation:
    incident_id: str
    action_text: str
    confidence_score: float
    rationale: str