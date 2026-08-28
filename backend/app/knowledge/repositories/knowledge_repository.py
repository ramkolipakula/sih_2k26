from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from app.knowledge.models.knowledge import KnowledgeDocument, KnowledgeChunk, KnowledgeStatus
from app.knowledge.schemas.knowledge import KnowledgeDocumentCreate
from datetime import datetime

class KnowledgeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_document(self, doc_data: KnowledgeDocumentCreate, file_path: str) -> KnowledgeDocument:
        from app.knowledge.models.knowledge import SourceRegistry
        
        # Try to find a registry entry by organization
        registry = None
        if doc_data.organization:
            registry = self.db.query(SourceRegistry).filter(SourceRegistry.source_name == doc_data.organization).first()
            
        db_obj = KnowledgeDocument(
            **doc_data.model_dump(),
            file_path=file_path,
            source_registry_id=registry.id if registry else None
            # verified remains False by default
        )
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
        
    def get_document(self, document_id: UUID) -> Optional[KnowledgeDocument]:
        return self.db.query(KnowledgeDocument).filter(KnowledgeDocument.id == document_id).first()

    def update_status(self, document_id: UUID, status: KnowledgeStatus):
        doc = self.get_document(document_id)
        if doc:
            doc.status = status
            doc.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(doc)
        return doc

    def clear_chunks(self, document_id: UUID):
        self.db.query(KnowledgeChunk).filter(KnowledgeChunk.document_id == document_id).delete()
        self.db.commit()

    def add_chunk(self, document_id: UUID, chunk_text: str, page_number: int, section_name: str, chunk_index: int, qdrant_point_id: UUID):
        chunk = KnowledgeChunk(
            document_id=document_id,
            chunk_text=chunk_text,
            page_number=page_number,
            section_name=section_name,
            chunk_index=chunk_index,
            qdrant_point_id=qdrant_point_id
        )
        self.db.add(chunk)
        self.db.commit()
        self.db.refresh(chunk)
        return chunk
