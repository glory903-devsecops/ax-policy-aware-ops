from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4
from sqlalchemy import String, Text, Boolean, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class System(Base):
    __tablename__ = "systems"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    environment: Mapped[str] = mapped_column(String(30), nullable=False)
    owner_team: Mapped[str] = mapped_column(String(100), nullable=False)
    criticality: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    incidents: Mapped[List["Incident"]] = relationship(back_populates="system")
    change_events: Mapped[List["ChangeEvent"]] = relationship(back_populates="system")

class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    system_id: Mapped[UUID] = mapped_column(ForeignKey("systems.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text)
    root_cause: Mapped[Optional[str]] = mapped_column(Text)
    detected_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    system: Mapped["System"] = relationship(back_populates="incidents")
    tickets: Mapped[List["Ticket"]] = relationship(back_populates="incident")
    evidences: Mapped[List["Evidence"]] = relationship(back_populates="incident")
    evaluations: Mapped[List["PolicyEvaluation"]] = relationship(back_populates="incident")
    recommendations: Mapped[List["Recommendation"]] = relationship(back_populates="incident")

class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    incident_id: Mapped[UUID] = mapped_column(ForeignKey("incidents.id"), nullable=False)
    external_ref: Mapped[Optional[str]] = mapped_column(String(100))
    source: Mapped[str] = mapped_column(String(50), nullable=False)
    assignee: Mapped[Optional[str]] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    incident: Mapped["Incident"] = relationship(back_populates="tickets")

class ChangeEvent(Base):
    __tablename__ = "change_events"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    system_id: Mapped[UUID] = mapped_column(ForeignKey("systems.id"), nullable=False)
    change_type: Mapped[str] = mapped_column(String(50), nullable=False)
    deployment_id: Mapped[Optional[str]] = mapped_column(String(100))
    changed_by: Mapped[str] = mapped_column(String(100), nullable=False)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
    changed_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    system: Mapped["System"] = relationship(back_populates="change_events")

class Evidence(Base):
    __tablename__ = "evidences"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    incident_id: Mapped[UUID] = mapped_column(ForeignKey("incidents.id"), nullable=False)
    evidence_type: Mapped[str] = mapped_column(String(50), nullable=False)
    source_uri: Mapped[Optional[str]] = mapped_column(Text)
    snippet: Mapped[Optional[str]] = mapped_column(Text)
    collected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    incident: Mapped["Incident"] = relationship(back_populates="evidences")

class PolicyRule(Base):
    __tablename__ = "policy_rules"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[str] = mapped_column(String(30), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    rego_package: Mapped[str] = mapped_column(String(150), nullable=False)
    rego_rule: Mapped[str] = mapped_column(String(100), nullable=False)

    evaluations: Mapped[List["PolicyEvaluation"]] = relationship(back_populates="rule")

class PolicyEvaluation(Base):
    __tablename__ = "policy_evaluations"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    incident_id: Mapped[UUID] = mapped_column(ForeignKey("incidents.id"), nullable=False)
    policy_rule_id: Mapped[UUID] = mapped_column(ForeignKey("policy_rules.id"), nullable=False)
    result: Mapped[str] = mapped_column(String(50), nullable=False)
    score: Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    rationale: Mapped[Optional[str]] = mapped_column(Text)
    evaluated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    incident: Mapped["Incident"] = relationship(back_populates="evaluations")
    rule: Mapped["PolicyRule"] = relationship(back_populates="evaluations")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    incident_id: Mapped[UUID] = mapped_column(ForeignKey("incidents.id"), nullable=False)
    recommendation_type: Mapped[str] = mapped_column(String(50), nullable=False)
    action_text: Mapped[str] = mapped_column(Text, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    rationale: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="created")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    incident: Mapped["Incident"] = relationship(back_populates="recommendations")
    workflow_executions: Mapped[List["WorkflowExecution"]] = relationship(back_populates="recommendation")

class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    recommendation_id: Mapped[UUID] = mapped_column(ForeignKey("recommendations.id"), nullable=False)
    workflow_type: Mapped[str] = mapped_column(String(50), nullable=False)
    state: Mapped[str] = mapped_column(String(30), nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    recommendation: Mapped["Recommendation"] = relationship(back_populates="workflow_executions")
