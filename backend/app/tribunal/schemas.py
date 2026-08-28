"""
Pydantic schemas for the Tribunal system.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from enum import Enum


class TribunalStatusEnum(str, Enum):
    PENDING = "PENDING"
    EVIDENCE_RETRIEVAL = "EVIDENCE_RETRIEVAL"
    AI_ANALYSIS = "AI_ANALYSIS"
    ADVOCATE_RUNNING = "ADVOCATE_RUNNING"
    CRITIC_RUNNING = "CRITIC_RUNNING"
    JUDGE_RUNNING = "JUDGE_RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class EvidenceCitation(BaseModel):
    document_id: Optional[str] = None
    quote: Optional[str] = None
    trust_level: Optional[str] = None
    page: Optional[int] = None
    section: Optional[str] = None
    relevance: Optional[str] = None


class AdvocateStrength(BaseModel):
    claim: str
    evidence: List[EvidenceCitation] = Field(default_factory=list)
    confidence: float = 0.5


class AdvocateWeakness(BaseModel):
    weakness: str
    mitigation: Optional[str] = None
    severity: str = "MEDIUM"


class AdvocateResult(BaseModel):
    position: str = "FOR"
    executive_summary: str
    strengths: List[AdvocateStrength] = Field(default_factory=list)
    acknowledged_weaknesses: List[AdvocateWeakness] = Field(default_factory=list)
    acknowledged_gaps: List[str] = Field(default_factory=list)
    failed_rules_acknowledged: List[str] = Field(default_factory=list)
    recommendation_reasoning: str = ""
    overall_confidence: float = 0.5


class CriticChallenge(BaseModel):
    claim: str
    counterargument: str
    evidence: List[EvidenceCitation] = Field(default_factory=list)
    severity: str = "MEDIUM"
    confidence: float = 0.5


class DuplicationConcern(BaseModel):
    existing_work: str
    overlap: str
    is_true_duplicate: bool = False
    reasoning: str = ""


class HistoricalRejection(BaseModel):
    rejected_proposal: str
    rejection_reason: str
    new_proposal_addresses_it: bool = False
    explanation: str = ""


class RiskItem(BaseModel):
    risk: str
    severity: str = "MEDIUM"
    evidence: Optional[str] = None


class AdvocateRebuttal(BaseModel):
    advocate_claim: str
    rebuttal: str
    evidence: List[EvidenceCitation] = Field(default_factory=list)


class CriticResult(BaseModel):
    position: str = "AGAINST"
    executive_summary: str
    challenges: List[CriticChallenge] = Field(default_factory=list)
    duplication_concerns: List[DuplicationConcern] = Field(default_factory=list)
    historical_rejections: List[HistoricalRejection] = Field(default_factory=list)
    risk_assessment: List[RiskItem] = Field(default_factory=list)
    advocate_rebuttals: List[AdvocateRebuttal] = Field(default_factory=list)
    overall_confidence: float = 0.5


class DecisiveFactor(BaseModel):
    factor: str
    weight: str = "MEDIUM"
    favors: str = "APPROVE"
    evidence: List[EvidenceCitation] = Field(default_factory=list)


class AgentEvaluation(BaseModel):
    accepted_claims: List[str] = Field(default_factory=list)
    rejected_claims: List[Dict[str, str]] = Field(default_factory=list)


class ComplianceSummary(BaseModel):
    passed_rules: int = 0
    failed_rules: int = 0
    critical_failures: List[str] = Field(default_factory=list)


class JudgeResult(BaseModel):
    decision: str  # APPROVE | REJECT | REVIEW
    confidence: float = 0.5
    executive_summary: str
    decisive_factors: List[DecisiveFactor] = Field(default_factory=list)
    advocate_evaluation: Optional[AgentEvaluation] = None
    critic_evaluation: Optional[AgentEvaluation] = None
    compliance_summary: Optional[ComplianceSummary] = None
    novelty_verdict: str = "UNCERTAIN"
    progressive_rd_verdict: str = "INCREMENTAL"
    unresolved_concerns: List[str] = Field(default_factory=list)
    recommendation: str = ""
    conditions: List[str] = Field(default_factory=list)


class TribunalSessionResponse(BaseModel):
    id: UUID
    proposal_id: UUID
    status: str
    decision: Optional[str] = None
    confidence: Optional[float] = None
    advocate_argument: Optional[Dict[str, Any]] = None
    critic_argument: Optional[Dict[str, Any]] = None
    judge_verdict: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HumanReviewRequest(BaseModel):
    action: str  # APPROVE | REJECT | REQUEST_MORE_INFO
    reviewer_notes: Optional[str] = None


class HumanReviewResponse(BaseModel):
    id: UUID
    tribunal_session_id: UUID
    proposal_id: UUID
    action: str
    reviewer_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ExternalResearchResult(BaseModel):
    url: str
    title: Optional[str] = None
    source: Optional[str] = None
    snippet: Optional[str] = None
    publication_date: Optional[str] = None
    trust_level: str = "LOW"
    relevance_score: Optional[float] = None


class FullReportResponse(BaseModel):
    proposal_id: UUID
    proposal: Dict[str, Any]
    extraction: Optional[Dict[str, Any]] = None
    analysis: Optional[Dict[str, Any]] = None
    evidence_package: Optional[Dict[str, Any]] = None
    tribunal: Optional[TribunalSessionResponse] = None
    human_review: Optional[HumanReviewResponse] = None
    external_research: List[ExternalResearchResult] = Field(default_factory=list)
    pipeline_status: Dict[str, str] = Field(default_factory=dict)
