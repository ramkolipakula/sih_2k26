from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class DocumentBase(BaseModel):
    title: Optional[str] = None
    document_type: str
    organization: Optional[str] = None
    project: Optional[str] = None
    mine: Optional[str] = None
    year: Optional[int] = None
    version: Optional[str] = "1.0"
    source_type: Optional[str] = None
    status: str
    verified: bool = False
    trust_level: str = "STANDARD"

class DocumentResponse(DocumentBase):
    id: UUID
    filename: str
    uploaded_at: datetime
    indexed_at: Optional[datetime] = None
    page_count: Optional[int] = None

    class Config:
        from_attributes = True

class ReportBase(BaseModel):
    title: str
    report_type: str
    project: Optional[str] = None
    period: Optional[str] = None
    content: Dict[str, Any]

class ReportResponse(ReportBase):
    id: UUID
    created_at: datetime
    generated_by: Optional[str] = None

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    document_id: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    task_type: str
    status: str

class TaskResponse(TaskBase):
    id: UUID
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SearchQuery(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    top_k: int = 5

class SearchResult(BaseModel):
    document_id: str
    title: str
    similarity: float
    page: Optional[int] = None
    section: Optional[str] = None
    content: str
    organization: Optional[str] = None
    verified: bool = False

class QAResponse(BaseModel):
    answer: str
    sources: List[SearchResult]

class DashboardStats(BaseModel):
    geological_reports: int
    mining_reports: int
    exploration_data: int
    pending_tasks: int

class TopicResponse(BaseModel):
    id: UUID
    name: str
    frequency: int
    
    class Config:
        from_attributes = True

class DataSourceResponse(BaseModel):
    id: UUID
    source_name: str
    source_category: str
    document_count: int
    last_indexed: Optional[datetime] = None
    status: str
    verified: bool
    organization: Optional[str] = None

    class Config:
        from_attributes = True
