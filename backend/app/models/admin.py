import uuid
from datetime import datetime
import enum
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base


class ReviewDecisionEnum(str, enum.Enum):
    APPROVE = "APPROVE"
    REJECT = "REJECT"
    REVISION_REQUESTED = "REVISION_REQUESTED"


class ReviewDecision(Base):
    __tablename__ = "review_decisions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id"), index=True, nullable=False)
    reviewer_id = Column(String, nullable=False)
    decision = Column(Enum(ReviewDecisionEnum), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    proposal = relationship("Proposal", backref="review_decisions")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id"), index=True, nullable=True)
    actor_id = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    metadata_ = Column("metadata", JSONB, nullable=True)  # Using metadata_ to avoid conflict with SQLAlchemy Base.metadata
    created_at = Column(DateTime, default=datetime.utcnow)

    proposal = relationship("Proposal", backref="audit_events")
