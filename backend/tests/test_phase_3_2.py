import pytest
from uuid import uuid4
from app.knowledge.models.knowledge import SourceRegistry, TrustLevel, KnowledgeDocument, SourceType, KnowledgeStatus
from app.knowledge.repositories.knowledge_repository import KnowledgeRepository
from app.evaluation.repositories.evaluation_repository import EvaluationRepository
from app.repositories.proposal_repository import ProposalRepository
from app.schemas.proposal import ProposalCreate
from app.knowledge.schemas.knowledge import KnowledgeDocumentCreate
from app.evaluation.services.novelty_engine import NoveltyAnalysisEngine
from worker.tasks import process_document_task
from worker.knowledge_tasks import ingest_document_task
from worker.evaluation_tasks import evaluate_proposal_task
from app.evaluation.services.evidence_package_service import EvidencePackageService

def test_unverified_user_document(db_session):
    repo = KnowledgeRepository(db_session)
    doc_data = KnowledgeDocumentCreate(
        title="User Provided Spec",
        source_type=SourceType.PROJECT,
        organization="Random Corp"
    )
    doc = repo.create_document(doc_data, "/tmp/fake.txt")
    assert doc.verified is False
    assert doc.source_registry_id is None

def test_verified_official_source(db_session):
    # Setup official registry
    registry = SourceRegistry(source_name="Gov Dept", trust_level=TrustLevel.HIGH, verified=True)
    db_session.add(registry)
    db_session.commit()
    
    repo = KnowledgeRepository(db_session)
    doc_data = KnowledgeDocumentCreate(
        title="Official Guidelines",
        source_type=SourceType.GUIDELINE,
        organization="Gov Dept"
    )
    doc = repo.create_document(doc_data, "/tmp/fake2.txt")
    assert doc.source_registry_id == registry.id
    # Verified should still be False natively until confirmed, but trust level via registry is HIGH
    
def test_idempotent_task_execution(db_session, mocker):
    # Mock ExtractionService and Qdrant
    mocker.patch("app.services.extraction_service.ExtractionService.process_document", return_value=([{"text": "Sample", "page_number": 1}], 1, "SUCCESS"))
    qdrant_mock = mocker.patch("app.knowledge.services.ingestion_service.QdrantClient")
    
    repo = KnowledgeRepository(db_session)
    doc_data = KnowledgeDocumentCreate(
        title="Idempotent Test",
        source_type=SourceType.REPORT
    )
    doc = repo.create_document(doc_data, "test.pdf")
    
    # First run
    ingest_document_task(str(doc.id))
    
    # Second run
    ingest_document_task(str(doc.id))
    
    # Check that it cleared chunks
    from app.knowledge.models.knowledge import KnowledgeChunk
    chunks = db_session.query(KnowledgeChunk).filter(KnowledgeChunk.document_id == doc.id).all()
    # It should only have chunks from the second run (1 chunk)
    assert len(chunks) == 1

def test_novelty_score_defers_semantic(db_session, mocker):
    # Mock Qdrant retrieval
    class MockResult:
        def __init__(self, content, source, score):
            self.content = content
            self.source = source
            self.similarity = score
            self.document_id = str(uuid4())
            self.organization = "Org"
            self.version = "1.0"
            self.effective_date = None
            self.trust_level = "HIGH"
            self.verified = True
            self.page = 1
            self.section = "Summary"

    mocker.patch("app.knowledge.services.retrieval_service.RetrievalService.search_knowledge", return_value={"results": [MockResult("text", "doc", 0.9)]})
    
    engine = NoveltyAnalysisEngine()
    result = engine.analyze(["Test objective"], "Novelty claim")
    
    assert result["similarity_score"] == 0.9
    assert result["similarity_interpretation"] == "HIGH_SIMILARITY"
    assert result["semantic_novelty"] == "UNDETERMINED"
    assert result["novelty_level"] is None

def test_evidence_package_contains_required_evidence(db_session):
    prop_repo = ProposalRepository(db_session)
    prop = prop_repo.create_proposal(ProposalCreate(
        title="Package Test",
        description="Testing Evidence Package",
        submitter_id="user-1"
    ))
    
    eval_repo = EvaluationRepository(db_session)
    eval_repo.save_analysis({
        "proposal_id": prop.id,
        "domain": "AI",
        "objectives": []
    })
    
    service = EvidencePackageService(db_session)
    package = service.generate_package(prop.id)
    
    assert package.proposal_id == prop.id
    assert package.proposal["title"] == "Package Test"
    assert "metadata" in package.model_dump()
    assert package.novelty.semantic_novelty == "UNDETERMINED"
