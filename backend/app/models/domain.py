import uuid
from datetime import datetime
import enum
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, Text, Float, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class DocumentStatus(str, enum.Enum):
    UPLOADED = "UPLOADED"
    PROCESSING = "PROCESSING"
    INDEXED = "INDEXED"
    FAILED = "FAILED"

class TaskStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    document_type = Column(String, nullable=False)  # Geological, Mining, Exploration, etc.
    organization = Column(String, nullable=True)
    project = Column(String, nullable=True)
    mine = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    version = Column(String, nullable=True, default="1.0")
    source_type = Column(String, nullable=True)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.UPLOADED, nullable=False)
    verified = Column(Boolean, default=False)
    trust_level = Column(String, default="STANDARD")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    indexed_at = Column(DateTime, nullable=True)
    
    page_count = Column(Integer, nullable=True)
    raw_text = Column(Text, nullable=True)
    extracted_json = Column(JSON, nullable=True)

    tasks = relationship("Task", back_populates="document", cascade="all, delete-orphan")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    topics = relationship("DocumentTopic", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), index=True, nullable=False)
    page_number = Column(Integer, nullable=True)
    section = Column(String, nullable=True)
    chunk_text = Column(Text, nullable=False)
    embedding_id = Column(String, nullable=True) # ID in Qdrant
    metadata_ = Column("metadata", JSON, nullable=True)

    document = relationship("Document", back_populates="chunks")

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_name = Column(String, nullable=False)
    source_category = Column(String, nullable=False)
    document_count = Column(Integer, default=0)
    last_indexed = Column(DateTime, nullable=True)
    status = Column(String, default="ACTIVE")
    verified = Column(Boolean, default=True)
    organization = Column(String, nullable=True)

class Topic(Base):
    __tablename__ = "topics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    frequency = Column(Integer, default=1)

class DocumentTopic(Base):
    __tablename__ = "document_topics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), index=True, nullable=False)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), index=True, nullable=False)
    relevance_score = Column(Float, nullable=True)

    document = relationship("Document", back_populates="topics")
    topic = relationship("Topic")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    report_type = Column(String, nullable=False)
    project = Column(String, nullable=True)
    period = Column(String, nullable=True)
    content = Column(JSON, nullable=False) # Structured content with sections
    created_at = Column(DateTime, default=datetime.utcnow)
    generated_by = Column(String, nullable=True)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), index=True, nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    task_type = Column(String, nullable=False) # e.g. "Review Extracted Data"
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    document = relationship("Document", back_populates="tasks")

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    metadata_ = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
