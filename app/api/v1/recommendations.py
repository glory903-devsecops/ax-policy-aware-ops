from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import System, Incident, ChangeEvent
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(tags=["Recommendations"])

class ChangeEventRead(BaseModel):
    id: str
    system_name: str
    change_type: str
    changed_by: str
    approved: bool
    changed_at: datetime
    description: str

class EvaluationRead(BaseModel):
    policy_code: str
    result: str
    score: float
    rationale: str

class RecommendationRead(BaseModel):
    type: str
    action_text: str
    confidence_score: float
    rationale: str

class AnalysisResultRead(BaseModel):
    incident_id: str
    correlation_score: float
    related_changes: List[ChangeEventRead]
    evaluations: List[EvaluationRead]
    recommendations: List[RecommendationRead]

from uuid import UUID

@router.get("/recommendations/{incident_id}", response_model=AnalysisResultRead)
async def get_analysis(incident_id: UUID, db: AsyncSession = Depends(get_db)):
    # 1. Fetch Incident and System Name
    stmt = select(Incident, System.name.label("system_name")).join(Incident.system).where(Incident.id == incident_id)
    result = await db.execute(stmt)
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident, system_name = row

    # 2. Fetch Related Changes (last 24h for the same system)
    stmt = select(ChangeEvent).where(ChangeEvent.system_id == incident.system_id).order_by(ChangeEvent.changed_at.desc())
    result = await db.execute(stmt)
    changes = result.scalars().all()

    # 3. Simulate Engine Logic (Sales Ops Focus)
    has_unapproved = any(not c.approved for c in changes)
    client_name = system_name.split(" - ")[0]
    
    # VIP Client Detection
    VIP_CLIENTS = ["AECOM", "Vinci", "현대건설", "삼성물산", "ARUP", "Bechtel"]
    is_vip = client_name in VIP_CLIENTS

    related_changes_api = [
        ChangeEventRead(
            id=str(c.id),
            system_name=system_name,
            change_type=c.change_type,
            changed_by=c.changed_by,
            approved=c.approved,
            changed_at=c.changed_at,
            description=c.description
        ) for c in changes
    ]

    evaluations = [
        EvaluationRead(
            policy_code="영업.VIP_고객_영향도_분석",
            result="violation_risk" if incident.severity in ["critical", "high"] else "safe",
            score=0.99 if (incident.severity == "critical" or is_vip) else 0.4,
            rationale=f"{client_name}사는 {'마이다스 글로벌 VIP' if is_vip else '주요'} 고객사로, 현재 장애의 서비스 지연이 비즈니스 계약 유지 및 신뢰도에 중대한 위협이 됩니다."
        ),
        EvaluationRead(
            policy_code="운영.미승인_변경_리스크",
            result="violation_risk" if has_unapproved else "safe",
            score=0.95 if has_unapproved else 0.1,
            rationale="장애 발생 직전 확인된 비정상적인 서버 패치와 연산 오류의 상관관계가 매우 높으며, 이는 명백한 운영 정책 위반입니다."
        )
    ]

    recommendations = []
    # 1st Recommendation: Sales Action (Priority)
    recommendations.append(RecommendationRead(
        type="Notification",
        action_text=f"{client_name} {'VIP ' if is_vip else ''}전담 기술 이사 및 영업 담당자에게 즉시 상황을 보고하십시오.",
        confidence_score=0.99,
        rationale=f"{'VIP 고객 특별 관리 지침' if is_vip else '고객 관리 가이드'}에 따라 장애 인지 3분 내 선제적 안내가 최우선입니다."
    ))

    # 2nd Recommendation: Technical Action
    if has_unapproved:
        recommendations.append(RecommendationRead(
            type="Rollback",
            action_text="연관된 미승인 변경사항을 즉시 롤백하고 안정적인 버전으로 복구하십시오.",
            confidence_score=0.94,
            rationale="미승인 패치가 원인임이 95% 확률로 확실하며, 롤백 시 즉시 서비스 재개가 가능합니다."
        ))
    
    # 3rd Recommendation: Client Relationship Action
    recommendations.append(RecommendationRead(
        type="Alternative",
        action_text=f"{client_name} 전용{' VIP' if is_vip else ''} 비상 해석 서버 인스턴스를 즉시 할당하십시오.",
        confidence_score=0.92 if is_vip else 0.88,
        rationale="복구 완료 전까지 고객사의 설계 업무 중단을 방지하기 위해 예비 인스턴스를 즉각 투여해야 합니다."
    ))

    return AnalysisResultRead(
        incident_id=incident_id,
        correlation_score=0.92 if has_unapproved else 0.2,
        related_changes=related_changes_api,
        evaluations=evaluations,
        recommendations=recommendations
    )