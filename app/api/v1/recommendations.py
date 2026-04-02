from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

from src.domain.entities.incident import Incident
from src.domain.entities.change_event import ChangeEvent
from src.domain.services.recommendation_service import RecommendationService
from src.application.use_cases.generate_recommendation import GenerateRecommendationUseCase

router = APIRouter(tags=["recommendations"])

class RecommendationRequest(BaseModel):
    incident_id: str
    system_name: str
    severity: str
    title: str

@router.post("/recommendations")
def generate_recommendation(payload: RecommendationRequest) -> dict:
    incident = Incident(
        id=payload.incident_id,
        system_name=payload.system_name,
        severity=payload.severity,
        title=payload.title,
        detected_at=datetime.utcnow()
    )

    sample_changes = [
        ChangeEvent(
            id="chg-001",
            system_name=payload.system_name,
            changed_by="ops_admin",
            changed_at=datetime.utcnow(),
            description="Application config updated"
        )
    ]

    use_case = GenerateRecommendationUseCase(
        recommendation_service=RecommendationService()
    )
    recommendation = use_case.execute(incident, sample_changes)

    return {
        "incident_id": recommendation.incident_id,
        "action_text": recommendation.action_text,
        "confidence_score": recommendation.confidence_score,
        "rationale": recommendation.rationale
    }