from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from app.core.config import settings
from app.core.logging import logger
from app.knowledge.services.embedding_service import EmbeddingService
from app.knowledge.schemas.knowledge import SearchFilter, SearchResult

class RetrievalService:
    def __init__(self):
        self.embed_service = EmbeddingService()
        self.qdrant = QdrantClient(url=settings.QDRANT_URL, timeout=60.0)
        self.score_threshold = settings.QDRANT_SCORE_THRESHOLD
        
    def search_knowledge(self, query: str, filters: SearchFilter = None, limit: int = 5) -> dict:
        embedding = self.embed_service.generate_embedding(query)
        
        qdrant_filter = None
        if filters:
            conditions = []
            if filters.source_type:
                conditions.append(FieldCondition(key="source_type", match=MatchValue(value=filters.source_type.value)))
            if filters.organization:
                conditions.append(FieldCondition(key="organization", match=MatchValue(value=filters.organization)))
            if filters.year:
                conditions.append(FieldCondition(key="year", match=MatchValue(value=filters.year)))
                
            if conditions:
                qdrant_filter = Filter(must=conditions)
                
        results = self.qdrant.search(
            collection_name=settings.QDRANT_COLLECTION_NAME,
            query_vector=embedding,
            query_filter=qdrant_filter,
            limit=limit,
            score_threshold=self.score_threshold
        )
        
        if not results:
            return {
                "results": [],
                "message": "No verified evidence found"
            }
            
        search_results = []
        for hit in results:
            search_results.append(SearchResult(
                content=hit.payload.get("text", ""),
                source=f"Document ID: {hit.payload.get('document_id')} ({hit.payload.get('source_type')})",
                document_id=str(hit.payload.get("document_id")) if hit.payload.get("document_id") else None,
                organization=hit.payload.get("organization"),
                page=hit.payload.get("page_number"),
                section=hit.payload.get("section"),
                version=hit.payload.get("version"),
                effective_date=hit.payload.get("effective_date"),
                trust_level=hit.payload.get("trust_level"),
                verified=hit.payload.get("verified"),
                similarity=hit.score
            ))
            
        logger.info(f"Retrieval completed for query: '{query}', found {len(search_results)} results")
        return {
            "results": search_results,
            "message": None
        }
