import uuid
from datetime import datetime
import enum
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, Text, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class FindingCategory(str, enum.Enum):
    COMPLIANCE = "COMPLIANCE"
    NOVELTY = "NOVELTY"
    FEASIBILITY = "FEASIBILITY"
    IMPACT = "IMPACT"
    FINANCIAL = "FINANCIAL"
    GAP = "GAP"

class FindingSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class FindingStatus(str, enum.Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    WARNING = "WARNING"

class NoveltyLevel(str, enum.Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"

class ProposalAnalysis(Base):
    __tablename__ = "proposal_analysis"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id"), index=True, nullable=False)
    title = Column(String, nullable=True)
    domain = Column(String, nullable=True)
    problem_statement = Column(Text, nullable=True)
    objectives = Column(JSONB, nullable=True)
    methodology = Column(Text, nullable=True)
    timeline = Column(String, nullable=True)
    duration_months = Column(Integer, nullable=True)
    budget = Column(JSONB, nullable=True)
    expected_benefits = Column(Text, nullable=True)
    novelty_claim = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    findings = relationship("EvaluationFinding", back_populates="analysis", cascade="all, delete-orphan")
    novelty = relationship("NoveltyAnalysis", back_populates="analysis", uselist=False, cascade="all, delete-orphan")

class EvaluationRule(Base):
    __tablename__ = "evaluation_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rule_code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(Enum(FindingCategory), nullable=False)
    description = Column(String, nullable=False)
    severity = Column(Enum(FindingSeverity), nullable=False)
    condition_json = Column(JSONB, nullable=False)
    active = Column(Boolean, default=True, nullable=False)

class EvaluationFinding(Base):
    __tablename__ = "evaluation_findings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("proposal_analysis.id"), index=True, nullable=False)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id"), index=True, nullable=False)
    category = Column(Enum(FindingCategory), nullable=False)
    finding_type = Column(String, nullable=False)
    severity = Column(Enum(FindingSeverity), nullable=False)
    status = Column(Enum(FindingStatus), nullable=False)
    description = Column(Text, nullable=False)
    confidence = Column(Float, nullable=True)
    evidence_reference = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    analysis = relationship("ProposalAnalysis", back_populates="findings")

class NoveltyAnalysis(Base):
    __tablename__ = "novelty_analysis"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("proposal_analysis.id"), index=True, nullable=False)
    proposal_id = Column(UUID(as_uuid=True), ForeignKey("proposals.id"), index=True, nullable=False)
    similar_projects = Column(JSONB, nullable=True)
    similarity_score = Column(Float, nullable=True)
    similarity_interpretation = Column(String, nullable=True)
    semantic_novelty = Column(String, default="UNDETERMINED")
    difference_analysis = Column(Text, nullable=True)
    novelty_level = Column(Enum(NoveltyLevel), nullable=True)
    confidence = Column(Float, nullable=True)
    progressive_assessment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("ProposalAnalysis", back_populates="novelty")
