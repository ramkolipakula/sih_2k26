import uuid
import pytest
from app.evaluation.models.evaluation import ProposalAnalysis, EvaluationFinding, FindingCategory, FindingSeverity, FindingStatus
from app.evaluation.repositories.evaluation_repository import EvaluationRepository
from app.models.proposal import Proposal, ProposalStatus, ProcessingJob, JobType, JobStatus
from app.repositories.proposal_repository import ProposalRepository

def test_database_constraint(db_session):
    prop_id = uuid.uuid4()
    prop = Proposal(
        id=prop_id,
        title="Constraint Test Proposal",
        uploaded_file_name="test.pdf",
        file_path="/tmp/test.pdf",
        file_type="pdf",
        file_size=1000,
        status=ProposalStatus.UPLOADED
    )
    db_session.add(prop)
    db_session.commit()

    repo = EvaluationRepository(db_session)
    
    # 1. Create ProposalAnalysis
    analysis_data = {
        "proposal_id": prop_id,
        "title": "Analysis 1"
    }
    analysis = repo.save_analysis(analysis_data)
    
    # 2. Create EvaluationFinding referencing it
    finding_data = {
        "analysis_id": analysis.id,
        "proposal_id": prop_id,
        "category": FindingCategory.COMPLIANCE,
        "finding_type": "TEST",
        "severity": FindingSeverity.LOW,
        "status": FindingStatus.PASS,
        "description": "Test finding"
    }
    finding = repo.save_finding(finding_data)
    
    # 3. Run evaluation cleanup
    repo.clear_evaluation(prop_id)
    
    # Verify exact counts
    analyses = db_session.query(ProposalAnalysis).filter(ProposalAnalysis.proposal_id == prop_id).all()
    assert len(analyses) == 1
    
    findings = db_session.query(EvaluationFinding).filter(EvaluationFinding.proposal_id == prop_id).all()
    assert len(findings) == 0

def test_duplicate_task(db_session, client):
    prop_id = uuid.uuid4()
    prop = Proposal(
        id=prop_id,
        title="Duplicate Task Test",
        uploaded_file_name="test.pdf",
        file_path="/tmp/test.pdf",
        file_type="pdf",
        file_size=1000,
        status=ProposalStatus.UPLOADED
    )
    db_session.add(prop)
    db_session.commit()

    resp1 = client.post(f"/api/v1/evaluation/{prop_id}/analyze")
    resp2 = client.post(f"/api/v1/evaluation/{prop_id}/analyze")
    
    assert resp1.status_code == 202
    assert resp2.status_code == 202
    
    data1 = resp1.json()["data"]
    data2 = resp2.json()["data"]
    
    assert data1["job_id"] == data2["job_id"]
    
    jobs = db_session.query(ProcessingJob).filter(ProcessingJob.proposal_id == prop_id, ProcessingJob.job_type == JobType.EVALUATION).all()
    assert len(jobs) == 1

def test_retry_idempotency(db_session):
    prop_id = uuid.uuid4()
    prop = Proposal(
        id=prop_id,
        title="Retry Test Proposal",
        uploaded_file_name="test.pdf",
        file_path="/tmp/test.pdf",
        file_type="pdf",
        file_size=1000,
        status=ProposalStatus.UPLOADED
    )
    db_session.add(prop)
    db_session.commit()

    repo = EvaluationRepository(db_session)
    
    # Initial partial run
    analysis_data = {"proposal_id": prop_id, "title": "Run 1"}
    analysis1 = repo.save_analysis(analysis_data)
    
    repo.save_finding({
        "analysis_id": analysis1.id,
        "proposal_id": prop_id,
        "category": FindingCategory.COMPLIANCE,
        "finding_type": "TEST",
        "severity": FindingSeverity.LOW,
        "status": FindingStatus.PASS,
        "description": "Finding 1"
    })
    
    # Simulated worker crash...
    
    # Retry Run
    repo.clear_evaluation(prop_id)
    analysis_data2 = {"proposal_id": prop_id, "title": "Run 2"}
    analysis2 = repo.save_analysis(analysis_data2)
    
    repo.save_finding({
        "analysis_id": analysis2.id,
        "proposal_id": prop_id,
        "category": FindingCategory.COMPLIANCE,
        "finding_type": "TEST",
        "severity": FindingSeverity.LOW,
        "status": FindingStatus.PASS,
        "description": "Finding 2"
    })
    
    analyses = db_session.query(ProposalAnalysis).filter(ProposalAnalysis.proposal_id == prop_id).all()
    assert len(analyses) == 1
    assert analyses[0].title == "Run 2"
    
    findings = db_session.query(EvaluationFinding).filter(EvaluationFinding.proposal_id == prop_id).all()
    assert len(findings) == 1
    assert findings[0].description == "Finding 2"
    assert findings[0].analysis_id == analyses[0].id
