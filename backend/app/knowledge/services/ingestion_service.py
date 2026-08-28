import uuid
from typing import List, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from app.core.config import settings
from app.core.logging import logger
from app.knowledge.services.embedding_service import EmbeddingService
from app.knowledge.repositories.knowledge_repository import KnowledgeRepository
from app.knowledge.models.knowledge import KnowledgeDocument, KnowledgeStatus
from app.services.extraction_service import ExtractionService

class KnowledgeIngestionService:
    def __init__(self, db_session):
        self.repo = KnowledgeRepository(db_session)
        self.embed_service = EmbeddingService()
        self.qdrant = QdrantClient(url=settings.QDRANT_URL)
        
        # Ensure collection exists
        self._ensure_collection()
        
    def _ensure_collection(self):
        col_name = settings.QDRANT_COLLECTION_NAME
        try:
            self.qdrant.get_collection(col_name)
        except Exception:
            self.qdrant.create_collection(
                collection_name=col_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )

    def _chunk_text(self, text: str) -> List[str]:
        words = text.split()
        chunk_size = 600
        overlap = 100
        
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk_words = words[i:i + chunk_size]
            if not chunk_words:
                break
            chunks.append(" ".join(chunk_words))
        return chunks

    def ingest_document(self, document_id: uuid.UUID):
        doc = self.repo.get_document(document_id)
        if not doc:
            raise ValueError("Document not found")
            
        logger.info(f"Document ingestion started for {document_id}")
        
        try:
            # Idempotency: clear existing points in Qdrant and DB
            from qdrant_client.http.models import Filter, FieldCondition, MatchValue
            self.qdrant.delete(
                collection_name=settings.QDRANT_COLLECTION_NAME,
                points_selector=Filter(
                    must=[FieldCondition(key="document_id", match=MatchValue(value=str(doc.id)))]
                )
            )
            self.repo.clear_chunks(doc.id)
            
            ext_service = ExtractionService()
            ext = doc.file_path.split('.')[-1].lower()
            extracted_data, page_count, status = ext_service.process_document(doc.file_path, ext)
            logger.info(f"Text extracted for {document_id}")
            
            points = []
            chunk_idx = 0
            
            # Loop over pages/sections from extraction
            for block in extracted_data:
                page_number = block.get("page_number", 1)
                section_name = block.get("section_name", "Unknown Section")
                
                # Further chunk the text block if it exceeds 600 words
                text_chunks = self._chunk_text(block.get("text", ""))
                
                for text_chunk in text_chunks:
                    embedding = self.embed_service.generate_embedding(text_chunk)
                    
                    # Trust Model integration
                    trust_level = "UNKNOWN"
                    if doc.registry_entry:
                        trust_level = doc.registry_entry.trust_level.value
                    
                    point_id = str(uuid.uuid4())
                    payload = {
                        "document_id": str(doc.id),
                        "source_name": doc.title,
                        "source_type": doc.source_type.value,
                        "organization": doc.organization,
                        "year": doc.year,
                        "version": doc.version,
                        "effective_date": doc.effective_date.isoformat() if doc.effective_date else None,
                        "page_number": page_number,
                        "section": section_name,
                        "text": text_chunk,
                        "trust_level": trust_level,
                        "verified": doc.verified
                    }
                    
                    points.append(PointStruct(id=point_id, vector=embedding, payload=payload))
                    
                    self.repo.add_chunk(
                        document_id=doc.id,
                        chunk_text=text_chunk,
                        page_number=page_number,
                        section_name=section_name,
                        chunk_index=chunk_idx,
                        qdrant_point_id=uuid.UUID(point_id)
                    )
                    chunk_idx += 1
                
            if points:
                self.qdrant.upsert(
                    collection_name=settings.QDRANT_COLLECTION_NAME,
                    points=points
                )
                
            logger.info(f"Embeddings generated and vectors stored for {document_id}")
            
            self.repo.update_status(document_id, KnowledgeStatus.READY)
            logger.info(f"Document {document_id} ingestion completed successfully")
            
        except Exception as e:
            logger.error(f"Ingestion failed for {document_id}: {str(e)}")
            self.repo.update_status(document_id, KnowledgeStatus.FAILED)
            raise e
