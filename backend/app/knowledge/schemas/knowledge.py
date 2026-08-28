from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date
from app.knowledge.models.knowledge import SourceType, KnowledgeStatus

class KnowledgeDocumentCreate(BaseModel):
    title: str
    source_type: SourceType
    source_url: Optional[str] = None
    organization: Optional[str] = None
    year: Optional[int] = None
    version: Optional[str] = None
    effective_date: Optional[date] = None
    description: Optional[str] = None

class KnowledgeDocumentResponseData(BaseModel):
    document_id: UUID
    status: str

    @classmethod
    def from_orm_model(cls, obj):
        return cls(document_id=obj.id, status=obj.status)

class KnowledgeDocumentDetail(BaseModel):
    id: UUID
    title: str
    source_type: SourceType
    organization: Optional[str] = None
    year: Optional[int] = None
    version: Optional[str] = None
    status: KnowledgeStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class SearchFilter(BaseModel):
    source_type: Optional[SourceType] = None
    organization: Optional[str] = None
    year: Optional[int] = None

class SearchQuery(BaseModel):
    query: str
    filters: Optional[SearchFilter] = None
    limit: int = 5

class SearchResult(BaseModel):
    content: str
    source: str
    document_id: Optional[str] = None
    organization: Optional[str] = None
    page: Optional[int] = None
    section: Optional[str] = None
    version: Optional[str] = None
    effective_date: Optional[str] = None
    trust_level: Optional[str] = None
    verified: Optional[bool] = None
    similarity: float

class SearchResponseData(BaseModel):
    results: List[SearchResult]
    message: Optional[str] = None

class EvidenceModel(BaseModel):
    evidence: str
    source: str
    page: Optional[int] = None
    similarity: float
