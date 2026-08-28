import uuid
from datetime import datetime
import enum
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, Text, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class SourceType(str, enum.Enum):
    GUIDELINE = "GUIDELINE"
    PROJECT = "PROJECT"
    PAPER = "PAPER"
    REPORT = "REPORT"
    PATENT = "PATENT"

class KnowledgeStatus(str, enum.Enum):
    PROCESSING = "PROCESSING"
    READY = "READY"
    FAILED = "FAILED"

class ProjectStatus(str, enum.Enum):
    COMPLETED = "COMPLETED"
    ONGOING = "ONGOING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    source_type = Column(Enum(SourceType), nullable=False)
    source_url = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    version = Column(String, nullable=True)
    effective_date = Column(DateTime, nullable=True)
    description = Column(Text, nullable=True)
    file_path = Column(String, nullable=False)
    status = Column(Enum(KnowledgeStatus), default=KnowledgeStatus.PROCESSING, nullable=False)
    source_registry_id = Column(UUID(as_uuid=True), ForeignKey("source_registry.id"), nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    chunks = relationship("KnowledgeChunk", back_populates="document", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="source_document", cascade="all, delete-orphan")
    sources = relationship("EvidenceSource", back_populates="document", cascade="all, delete-orphan")
    registry_entry = relationship("SourceRegistry")

class TrustLevel(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    UNKNOWN = "UNKNOWN"

class SourceRegistry(Base):
    __tablename__ = "source_registry"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_name = Column(String, nullable=False)
    domain = Column(String, nullable=True)
    trust_level = Column(Enum(TrustLevel), default=TrustLevel.MEDIUM, nullable=False)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("knowledge_documents.id"), index=True, nullable=False)
    chunk_text = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)
    section_name = Column(String, nullable=True)
    chunk_index = Column(Integer, nullable=False)
    qdrant_point_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("KnowledgeDocument", back_populates="chunks")

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_code = Column(String, nullable=True)
    title = Column(String, nullable=False)
    organization = Column(String, nullable=True)
    status = Column(Enum(ProjectStatus), nullable=True)
    year = Column(Integer, nullable=True)
    domain = Column(String, nullable=True)
    objectives = Column(Text, nullable=True)
    methodology = Column(Text, nullable=True)
    outcomes = Column(Text, nullable=True)
    industry_benefit = Column(Text, nullable=True)
    novelty_information = Column(Text, nullable=True)
    source_document_id = Column(UUID(as_uuid=True), ForeignKey("knowledge_documents.id"), nullable=True)

    source_document = relationship("KnowledgeDocument", back_populates="projects")

class EvidenceSource(Base):
    __tablename__ = "sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("knowledge_documents.id"), nullable=False)
    source_name = Column(String, nullable=False)
    source_type = Column(String, nullable=False)
    citation_text = Column(Text, nullable=False)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("KnowledgeDocument", back_populates="sources")
