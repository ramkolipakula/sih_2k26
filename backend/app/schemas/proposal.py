from pydantic import BaseModel, Field
from typing import List, Optional, Any, Generic, TypeVar
from uuid import UUID
from datetime import datetime
from app.models.proposal import ProposalStatus, JobStatus

T = TypeVar('T')

class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    error: Optional[str] = None

class ProposalBase(BaseModel):
    title: Optional[str] = None
    uploaded_file_name: str
    file_path: str
    file_type: str
    file_size: int

class ProposalCreate(ProposalBase):
    pass

class ProposalResponseData(BaseModel):
    id: UUID
    filename: str
    status: ProposalStatus
    
    @classmethod
    def from_orm_model(cls, obj: Any):
        return cls(id=obj.id, filename=obj.uploaded_file_name, status=obj.status)

class ProposalDetail(ProposalBase):
    id: UUID
    status: ProposalStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ExtractionSchema(BaseModel):
    title: Optional[str] = None
    problem_definition: Optional[str] = None
    objectives: List[str] = Field(default_factory=list)
    justification: Optional[str] = None
    industry_benefit: Optional[str] = None
    methodology: Optional[str] = None
    work_plan: Optional[str] = None
    timeline: Optional[str] = None
    budget: Optional[str] = None
    team_details: Optional[str] = None
    novelty_statement: Optional[str] = None

class ProposalExtractionResponseData(BaseModel):
    id: UUID
    proposal_id: UUID
    raw_text: Optional[str] = None
    extracted_json: Optional[Any] = None
    page_count: Optional[int] = None
    extraction_status: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class JobStatusResponseData(BaseModel):
    job_id: UUID
    proposal_id: UUID
    status: JobStatus
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    message: Optional[str] = None
