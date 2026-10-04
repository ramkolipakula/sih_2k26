import uuid
from datetime import datetime
import enum
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, Text, Float, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    document_type = Column(String, nullable=False)
    organization = Column(String, nullable=True)
    project = Column(String, nullable=True)
    mine = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    file_type = Column(String, default="PDF")
    page_count = Column(Integer, nullable=True)
    status = Column(String, default="UPLOADED")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    description = Column(Text, nullable=True)
    metadata_ = Column("metadata", JSONB, default={})

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    source_type = Column(String, nullable=False)
    department = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")
    document_count = Column(Integer, default=0)
    last_synced = Column(DateTime, nullable=True)
    description = Column(Text, nullable=True)

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    report_type = Column(String, nullable=False)
    project = Column(String, nullable=True)
    period = Column(String, nullable=True)
    status = Column(String, default="DRAFT")
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    summary = Column(JSONB, default={})

class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    task_type = Column(String, nullable=False)
    priority = Column(String, default="Medium")
    status = Column(String, default="PENDING")
    assigned_to = Column(String, nullable=True)
    related_document = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)

class Topic(Base):
    __tablename__ = "topics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic = Column(String, nullable=False)
    category = Column(String, nullable=True)
    document_count = Column(Integer, default=0)
    importance = Column(String, default="Medium")
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
