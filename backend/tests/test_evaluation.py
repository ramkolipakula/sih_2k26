import pytest
import io
import uuid
from app.models.proposal import Proposal, ProposalExtraction, ProcessingJob, JobType, JobStatus
from worker.evaluation_tasks import evaluate_proposal_task
from app.evaluation.models.evaluation import EvaluationRule, FindingCategory, FindingSeverity
from app.evaluation.services.proposal_analyzer import ProposalAnalyzerService

def test_evaluation_task_updates_job_status(client, db_session):
    prop_id = uuid.uuid4()
    prop = Proposal(id=prop_id, uploaded_file_name="test.pdf", file_path="/fake", file_type="pdf", file_size=100)
    db_session.add(prop)
    
    ext = ProposalExtraction(proposal_id=prop_id, raw_text="Title: AI Mining\nBudget: 5000000\nDuration: 40 months")
    db_session.add(ext)
    db_session.commit()
    
    # Trigger API
    res = client.post(f"/api/v1/evaluation/{prop_id}/analyze")
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["status"] == "QUEUED"
    job_id = data["job_id"]
    
    # Run task synchronously
    evaluate_proposal_task(job_id, str(prop_id))
    
    # Check job status
    job = db_session.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
    assert job.status == JobStatus.COMPLETED

def test_finding_contains_universal_evidence(client, db_session):
    prop_id = uuid.uuid4()
    prop = Proposal(id=prop_id, uploaded_file_name="test.pdf", file_path="/fake", file_type="pdf", file_size=100)
    db_session.add(prop)
    ext = ProposalExtraction(proposal_id=prop_id, raw_text="Duration: 40 months")
    db_session.add(ext)
    
    job_id = uuid.uuid4()
    job = ProcessingJob(id=job_id, proposal_id=prop_id, job_type=JobType.EVALUATION, status=JobStatus.QUEUED)
    db_session.add(job)
    
    rule = EvaluationRule(
        rule_code="R001", name="Max Duration", category=FindingCategory.COMPLIANCE,
        description="Must be <= 36 months", severity=FindingSeverity.HIGH,
        condition_json={"operator": "LESS_THAN_EQUAL", "field": "duration_months", "value": 36},
        active=True
    )
    db_session.add(rule)
    db_session.commit()
    
    evaluate_proposal_task(str(job_id), str(prop_id))
    
    res = client.get(f"/api/v1/evaluation/{prop_id}")
    assert res.status_code == 200
    
    findings = res.json()["data"]["findings"]
    assert len(findings) > 0
    
    # Check rule finding evidence
    rule_finding = next((f for f in findings if f["category"] == "COMPLIANCE"), None)
    assert rule_finding is not None
    assert rule_finding["confidence"] == 1.0
    assert len(rule_finding["evidence"]) > 0
    assert rule_finding["evidence"][0]["type"] == "RULE"
    assert rule_finding["evidence"][0]["source"] == "R001"
    
    # Check gap finding evidence
    gap_finding = next((f for f in findings if f["category"] == "GAP"), None)
    assert gap_finding is not None
    assert gap_finding["confidence"] == 1.0
    assert len(gap_finding["evidence"]) > 0
    assert gap_finding["evidence"][0]["type"] == "INTERNAL_ANALYSIS"
