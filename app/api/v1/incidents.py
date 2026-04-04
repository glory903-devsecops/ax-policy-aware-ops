from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import Incident, System, ChangeEvent
from pydantic import BaseModel
from typing import List
from datetime import datetime

from app.services.ax_engine import AXPolicyEngine
from sqlalchemy import func

router = APIRouter(tags=["Incidents"])

class IncidentCreate(BaseModel):
    system_name: str
    title: str
    severity: str
    summary: str

class IncidentRead(BaseModel):
    id: str
    system_name: str
    title: str
    severity: str
    status: str
    detected_at: datetime
    summary: str
    # AX Fields
    priority_score: int
    is_vip: bool
    is_poc: bool
    contract_value: float

    class Config:
        from_attributes = True

@router.get("/incidents", response_model=List[IncidentRead])
async def list_incidents(db: AsyncSession = Depends(get_db)):
    # Join with System to get all details
    stmt = select(Incident, System).join(Incident.system)
    result = await db.execute(stmt)
    rows = result.all()
    
    incidents = []
    for row in rows:
        incident, system = row
        
        # Calculate recurring count for scoring
        stmt_count = select(func.count(ChangeEvent.id)).where(ChangeEvent.system_id == system.id)
        count_result = await db.execute(stmt_count)
        recurring_count = count_result.scalar() or 0
        
        # Evaluate AX Score
        ax_insight = AXPolicyEngine.evaluate(incident, system, recurring_count)
        
        incidents.append(IncidentRead(
            id=str(incident.id),
            system_name=system.name,
            title=incident.title,
            severity=incident.severity,
            status=incident.status,
            detected_at=incident.detected_at,
            summary=incident.summary,
            priority_score=ax_insight["score"],
            is_vip=system.is_vip,
            is_poc=system.is_poc,
            contract_value=float(system.contract_value)
        ))
    
    # Sort by priority score descending
    incidents.sort(key=lambda x: x.priority_score, reverse=True)
    return incidents

@router.post("/incidents", response_model=IncidentRead)
async def create_incident(data: IncidentCreate, db: AsyncSession = Depends(get_db)):
    # 1. Find or create the System
    stmt = select(System).where(System.name == data.system_name)
    result = await db.execute(stmt)
    system = result.scalar_one_or_none()
    
    if not system:
        system = System(
            name=data.system_name,
            environment="production",
            owner_team="기술지원팀",
            criticality="medium"
        )
        db.add(system)
        await db.flush() # Get the system ID
        
    # 2. Create the Incident
    new_incident = Incident(
        system_id=system.id,
        title=data.title,
        severity=data.severity,
        summary=data.summary,
        status="investigating",
        detected_at=datetime.utcnow()
    )
    db.add(new_incident)
    await db.commit()
    await db.refresh(new_incident)
    
    return IncidentRead(
        id=str(new_incident.id),
        system_name=system.name,
        title=new_incident.title,
        severity=new_incident.severity,
        status=new_incident.status,
        detected_at=new_incident.detected_at,
        summary=new_incident.summary
    )
