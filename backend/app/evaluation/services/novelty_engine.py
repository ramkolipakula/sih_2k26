from typing import Dict, Any
from app.knowledge.services.retrieval_service import RetrievalService
from app.knowledge.schemas.knowledge import SearchFilter, SourceType
from app.evaluation.models.evaluation import NoveltyLevel
from app.evaluation.schemas.evaluation import EvidenceType

class NoveltyAnalysisEngine:
    def __init__(self):
        self.retrieval_service = RetrievalService()

    def analyze(self, objectives: list, novelty_claim: str) -> Dict[str, Any]:
        query = ""
        if objectives:
            query += " ".join(objectives) + " "
        if novelty_claim:
            query += novelty_claim
            
        if not query.strip():
            return {
                "similar_projects": [],
                "similarity_score": 0.0,
                "similarity_interpretation": "NO_SIMILARITY",
                "semantic_novelty": "UNDETERMINED",
                "difference_analysis": None,
                "novelty_level": None
            }
            
        filters = SearchFilter(source_type=SourceType.PROJECT)
        search_response = self.retrieval_service.search_knowledge(query, filters, limit=3)
        
        results = search_response.get("results", [])
        
        max_score = 0.0
        similar_projects = []
        for res in results:
            if res.similarity > max_score:
                max_score = res.similarity
            

            similar_projects.append({
                "type": EvidenceType.DOCUMENT.value,
                "source": res.source,
                "document_id": res.document_id,
                "organization": res.organization,
                "version": res.version,
                "effective_date": res.effective_date,
                "trust_level": res.trust_level,
                "verified": res.verified,
                "page": res.page,
                "section": res.section,
                "quote": res.content,
                "confidence": res.similarity
            })
            
        if max_score > 0.85:
            similarity_interpretation = "HIGH_SIMILARITY"
        elif max_score > 0.65:
            similarity_interpretation = "MODERATE_SIMILARITY"
        else:
            similarity_interpretation = "LOW_SIMILARITY"
            
        return {
            "similar_projects": similar_projects,
            "similarity_score": max_score,
            "similarity_interpretation": similarity_interpretation,
            "semantic_novelty": "UNDETERMINED",
            "difference_analysis": None,
            "novelty_level": None
        }
