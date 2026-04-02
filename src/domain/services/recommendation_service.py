from src.domain.entities.incident import Incident
from src.domain.entities.change_event import ChangeEvent
from src.domain.entities.recommendation import Recommendation

class RecommendationService:
    def generate(self, incident: Incident, changes: list[ChangeEvent]) -> list[Recommendation]:
        """
        장애 유형과 최근 변경 이력을 분석하여 대응 권고안 리스트를 생성합니다.
        """
        recommendations: list[Recommendation] = []

        # 1. 미승인 변경 연관 분석 (Change Correlation)
        recent_unapproved_change = any(
            c.system_name == incident.system_name and not c.approved
            for c in changes
        )

        if recent_unapproved_change:
            recommendations.append(
                Recommendation(
                    incident_id=incident.id,
                    recommendation_type="rollback_review",
                    action_text="최근 미승인 변경사항을 우선 검토하고 롤백 가능성을 확인하세요.",
                    confidence_score=0.92,
                    rationale="장애 발생 직전 동일 시스템에서 미승인 설정 변경이 탐지되었습니다."
                )
            )

        # 2. 기본 가이드 권고 (SLA 기반 등 추가 가능)
        if not recommendations:
            recommendations.append(
                Recommendation(
                    incident_id=incident.id,
                    recommendation_type="standard_runbook",
                    action_text="기본 운영 런북에 따라 시스템 로그와 자원 상태를 우선 점검하세요.",
                    confidence_score=0.75,
                    rationale="직접적인 변경 연관 정보가 없으므로 표준 대응 절차를 권고합니다."
                )
            )

        return recommendations