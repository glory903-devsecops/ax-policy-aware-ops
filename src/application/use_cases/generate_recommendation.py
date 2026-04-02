from src.domain.entities.incident import Incident
from src.domain.entities.change_event import ChangeEvent
from src.domain.entities.recommendation import Recommendation
from src.domain.services.recommendation_service import RecommendationService

class GenerateRecommendationUseCase:
    def __init__(self, recommendation_service: RecommendationService):
        self._recommendation_service = recommendation_service

    def execute(self, incident: Incident, changes: list[ChangeEvent]) -> Recommendation:
        return self._recommendation_service.generate(incident, changes)