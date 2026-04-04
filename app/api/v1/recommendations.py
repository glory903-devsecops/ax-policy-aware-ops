from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import System, Incident, ChangeEvent
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from app.services.ax_engine import AXPolicyEngine

router = APIRouter(tags=["Recommendations"])

class BusinessContext(BaseModel):
    is_vip: bool
    is_poc: bool
    contract_value: float
    recurring_count: int

class AnalysisResultRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    incident_id: UUID
    client_name: str
    priority_score: int
    response_level: str
    recommended_action: str
    rationale: str
    applied_rules: List[str]
    business_context: BusinessContext

@router.get("/recommendations/{incident_id}", response_model=AnalysisResultRead)
async def get_analysis(incident_id: UUID, db: AsyncSession = Depends(get_db)):
    # 1. Fetch Incident and System Details
    stmt = select(Incident, System).join(Incident.system).where(Incident.id == incident_id)
    result = await db.execute(stmt)
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident, system = row

    # 2. Calculate recurring_count (for Rule 4)
    # Count ChangeEvents or similar logs as recurring incident indicators for this prototype
    stmt_count = select(func.count(ChangeEvent.id)).where(ChangeEvent.system_id == system.id)
    count_result = await db.execute(stmt_count)
    recurring_count = count_result.scalar() or 0

    # 3. Evaluate via AX Policy Engine
    ax_result = AXPolicyEngine.evaluate(incident, system, recurring_count)

    return AnalysisResultRead(
        incident_id=incident.id,
        client_name=system.name,
        priority_score=ax_result["score"],
        response_level=ax_result["level"],
        recommended_action=ax_result["action"],
        rationale=ax_result["rationale"],
        applied_rules=ax_result["applied_rules"],
        business_context=BusinessContext(
            is_vip=system.is_vip,
            is_poc=system.is_poc,
            contract_value=float(system.contract_value),
            recurring_count=recurring_count
        )
    )