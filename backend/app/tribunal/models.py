"""
Database models for the Tribunal system, LLM audit trail,
external research, and human review.
"""
import uuid
from datetime import datetime
import enum
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, Text, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base


class TribunalStatus(str, enum.Enum):
    PENDING = "PENDING"
    EVIDENCE_RETRIEVAL = "EVIDENCE_RETRIEVAL"
    AI_ANALYSIS = "AI_ANALYSIS"
    ADVOCATE_RUNNING = "ADVOCATE_RUNNING"
    CRITIC_RUNNING = "CRITIC_RUNNING"
    JUDGE_RUNNING = "JUDGE_RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class TribunalDecision(str, enum.Enum):
    APPROVE = "APPROVE"
    REJECT = "REJECT"
    REVIEW = "REVIEW"


class ReviewAction(str, enum.Enum):
    APPROVE = "APPROVE"
    REJECT = "REJECT"
    REQUEST_MORE_INFO = "REQUEST_MORE_INFO"


class TribunalSession(Base):
    __tablename__ = "tribunal_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id"), index=True, nullable=False)
    evidence_package_id = Column(UUID(as_uuid=True), nullable=True)
    status = Column(Enum(TribunalStatus), default=TribunalStatus.PENDING, nullable=False)
    decision = Column(Enum(TribunalDecision), nullable=True)
    confidence = Column(Float, nullable=True)

    advocate_argument = Column(JSONB, nullable=True)
    critic_argument = Column(JSONB, nullable=True)
    judge_verdict = Column(JSONB, nullable=True)

    evidence_package_snapshot = Column(JSONB, nullable=True)

    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    llm_runs = relationship("LLMRun", back_populates="tribunal_session", cascade="all, delete-orphan")
    human_review = relationship("HumanReview", back_populates="tribunal_session", uselist=False, cascade="all, delete-orphan")


class LLMRun(Base):
    __tablename__ = "llm_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tribunal_session_id = Column(UUID(as_uuid=True), ForeignKey("tribunal_sessions.id"), index=True, nullable=True)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id"), index=True, nullable=True)
    agent_role = Column(String, nullable=False)  # extraction, novelty, progressive_rd, gap_detection, advocate, critic, judge
    provider = Column(String, nullable=False)
    model = Column(String, nullable=False)
    prompt_version = Column(String, default="1.0", nullable=False)
    system_prompt_hash = Column(String, nullable=True)
    input_tokens = Column(Integer, nullable=True)
    output_tokens = Column(Integer, nullable=True)
    total_tokens = Column(Integer, nullable=True)
    latency_ms = Column(Float, nullable=True)
    output_json = Column(JSONB, nullable=True)
    status = Column(String, default="success", nullable=False)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    tribunal_session = relationship("TribunalSession", back_populates="llm_runs")


class ExternalResearch(Base):
    __tablename__ = "external_research"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id"), index=True, nullable=False)
    url = Column(String, nullable=False)
    title = Column(String, nullable=True)
    source = Column(String, nullable=True)
    snippet = Column(Text, nullable=True)
    publication_date = Column(String, nullable=True)
    retrieved_at = Column(DateTime, default=datetime.utcnow)
    trust_level = Column(String, default="LOW")
    relevance_score = Column(Float, nullable=True)


class HumanReview(Base):
    __tablename__ = "human_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tribunal_session_id = Column(UUID(as_uuid=True), ForeignKey("tribunal_sessions.id"), index=True, nullable=False)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id"), index=True, nullable=False)
    action = Column(Enum(ReviewAction), nullable=False)
    reviewer_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    tribunal_session = relationship("TribunalSession", back_populates="human_review")
