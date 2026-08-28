import sys
import os
import uuid
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.proposal import Proposal, ProcessingJob
from app.tribunal.models import TribunalSession, LLMRun, HumanReview, ExternalResearch
from app.evaluation.models.evaluation import ProposalAnalysis, EvaluationFinding, NoveltyAnalysis

db = SessionLocal()
proposal_id = uuid.UUID("ecf56695-7ed8-47f0-b8c6-fbd546dbc804")

# Delete Jobs
db.query(ProcessingJob).filter(ProcessingJob.proposal_id == proposal_id).delete()

# Delete Tribunal sessions and related
db.query(LLMRun).filter(LLMRun.proposal_id == proposal_id).delete()
db.query(HumanReview).filter(HumanReview.proposal_id == proposal_id).delete()
db.query(TribunalSession).filter(TribunalSession.proposal_id == proposal_id).delete()

# Delete Evaluation Findings and Novelty Analysis
db.query(EvaluationFinding).filter(EvaluationFinding.proposal_id == proposal_id).delete(synchronize_session=False)
db.query(NoveltyAnalysis).filter(NoveltyAnalysis.proposal_id == proposal_id).delete(synchronize_session=False)

# Delete Proposal Analysis
db.query(ProposalAnalysis).filter(ProposalAnalysis.proposal_id == proposal_id).delete(synchronize_session=False)

db.commit()
print("Cleaned failed state for ecf56695-7ed8-47f0-b8c6-fbd546dbc804")
