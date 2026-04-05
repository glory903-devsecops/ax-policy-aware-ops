from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlalchemy import select
from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import ClientInquiry, System, Incident
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.services.llm_processor import LLMProcessor

router = APIRouter(tags=["Inquiries"])

class InquiryCreate(BaseModel):
    raw_text: str

class InquiryRead(BaseModel):
    id: UUID
    raw_text: str
    extracted_client: Optional[str]
    extracted_vip: bool
    extracted_poc: bool
    extracted_value: float
    extracted_severity: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/inquiries", response_model=InquiryRead)
async def create_inquiry(data: InquiryCreate, db: AsyncSession = Depends(get_db)):
    # 1. AI Analysis (Simulated)
    analysis = LLMProcessor.process_inquiry(data.raw_text)
    
    # 2. Save Inquiry to DB
    new_inquiry = ClientInquiry(
        raw_text=data.raw_text,
        extracted_client=analysis["client"],
        extracted_vip=analysis["is_vip"],
        extracted_poc=analysis["is_poc"],
        extracted_value=analysis["contract_value"],
        extracted_severity=analysis["severity"],
        status="pending"
    )
    db.add(new_inquiry)
    await db.commit()
    await db.refresh(new_inquiry)
    return new_inquiry

@router.get("/inquiries", response_model=List[InquiryRead])
async def list_inquiries(db: AsyncSession = Depends(get_db)):
    stmt = select(ClientInquiry).order_by(ClientInquiry.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/inquiries/{inquiry_id}/process")
async def process_inquiry(inquiry_id: UUID, db: AsyncSession = Depends(get_db)):
    # 1. Get Inquiry
    stmt = select(ClientInquiry).where(ClientInquiry.id == inquiry_id)
    result = await db.execute(stmt)
    inquiry = result.scalar_one_or_none()
    
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    if inquiry.status == "processed":
        return {"message": "Already processed"}
        
    # 2. Find or Create System
    system_name = inquiry.extracted_client or "Unknown Client"
    stmt_system = select(System).where(System.name == system_name)
    result_system = await db.execute(stmt_system)
    system = result_system.scalar_one_or_none()
    
    if not system:
        system = System(
            name=system_name,
            environment="production",
            owner_team="기술지원팀",
            criticality="medium",
            is_vip=inquiry.extracted_vip,
            is_poc=inquiry.extracted_poc,
            contract_value=inquiry.extracted_value
        )
        db.add(system)
        await db.flush()
    else:
        # Update existing system metadata from ERP (Inquiry)
        system.is_vip = inquiry.extracted_vip
        system.is_poc = inquiry.extracted_poc
        system.contract_value = inquiry.extracted_value
        
    # 3. Create Incident
    new_incident = Incident(
        system_id=system.id,
        title=f"[AI추출] {inquiry.raw_text[:50]}...",
        severity=inquiry.extracted_severity,
        status="investigating",
        summary=inquiry.raw_text,
        detected_at=datetime.utcnow()
    )
    db.add(new_incident)
    
    # 4. Mark Inquiry as Processed
    inquiry.status = "processed"
    inquiry.processed_at = datetime.utcnow()
    
    await db.commit()
    return {"message": "Successfully processed and registered to ERP/AX"}
