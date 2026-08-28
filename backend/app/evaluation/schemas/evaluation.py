from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.evaluation.models.evaluation import FindingCategory, FindingSeverity, FindingStatus, NoveltyLevel
import enum

class EvidenceType(str, enum.Enum):
    DOCUMENT = "DOCUMENT"
    RULE = "RULE"
    INTERNAL_ANALYSIS = "INTERNAL_ANALYSIS"

class UniversalEvidenceReference(BaseModel):
    type: EvidenceType
    source: str
    document_id: Optional[str] = None
    organization: Optional[str] = None
    page: Optional[int] = None
    section: Optional[str] = None
    quote: Optional[str] = None
    version: Optional[str] = None
    effective_date: Optional[str] = None
    trust_level: Optional[str] = None
    verified: Optional[bool] = None
    rule_code: Optional[str] = None
    rule_name: Optional[str] = None
    confidence: float

class EvaluationFindingResponse(BaseModel):
    category: FindingCategory
    severity: FindingSeverity
    description: str
    confidence: Optional[float] = None
    evidence: Optional[List[UniversalEvidenceReference]] = []

class NoveltyAnalysisResponse(BaseModel):
    similar_projects: Optional[List[Dict[str, Any]]] = None
    similarity_score: float
    similarity_interpretation: str
    semantic_novelty: str
    difference_analysis: Optional[str] = None
    novelty_level: Optional[NoveltyLevel] = None

class ProgressiveAssessmentResponse(BaseModel):
    assessment: str

class GapResponse(BaseModel):
    issue: str
    severity: str

class EvaluationReportResponseData(BaseModel):
    proposal_id: UUID
    job_status: str
    proposal: Dict[str, Any]
    analysis: Dict[str, Any]
    findings: List[EvaluationFindingResponse]
    novelty: NoveltyAnalysisResponse
    historical_evidence: List[UniversalEvidenceReference]
    rules: List[UniversalEvidenceReference]
    evidence_gaps: List[GapResponse]
    source_provenance: List[Dict[str, Any]]
    metadata: Dict[str, Any]
