from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from app.evaluation.models.evaluation import (
    ProposalAnalysis, EvaluationRule, EvaluationFinding, NoveltyAnalysis
)

class EvaluationRepository:
    def __init__(self, db: Session):
        self.db = db

    def clear_evaluation(self, proposal_id: UUID):
        self.db.query(EvaluationFinding).filter(EvaluationFinding.proposal_id == proposal_id).delete(synchronize_session=False)
        self.db.query(NoveltyAnalysis).filter(NoveltyAnalysis.proposal_id == proposal_id).delete(synchronize_session=False)
        self.db.commit()

    def save_analysis(self, data: dict) -> ProposalAnalysis:
        analysis = self.db.query(ProposalAnalysis).filter(ProposalAnalysis.proposal_id == data.get("proposal_id")).first()
        if analysis:
            for k, v in data.items():
                if hasattr(analysis, k) and k != "id":
                    setattr(analysis, k, v)
        else:
            analysis = ProposalAnalysis(**data)
            self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        return analysis
        
    def get_analysis_by_proposal(self, proposal_id: UUID) -> Optional[ProposalAnalysis]:
        return self.db.query(ProposalAnalysis).filter(ProposalAnalysis.proposal_id == proposal_id).first()

    def get_active_rules(self) -> List[EvaluationRule]:
        return self.db.query(EvaluationRule).filter(EvaluationRule.active == True).all()

    def save_finding(self, data: dict) -> EvaluationFinding:
        finding = EvaluationFinding(**data)
        self.db.add(finding)
        self.db.commit()
        self.db.refresh(finding)
        return finding

    def save_novelty_analysis(self, data: dict) -> NoveltyAnalysis:
        novelty = NoveltyAnalysis(**data)
        self.db.add(novelty)
        self.db.commit()
        self.db.refresh(novelty)
        return novelty

    def get_findings(self, proposal_id: UUID) -> List[EvaluationFinding]:
        return self.db.query(EvaluationFinding).filter(EvaluationFinding.proposal_id == proposal_id).all()

    def get_novelty(self, proposal_id: UUID) -> Optional[NoveltyAnalysis]:
        return self.db.query(NoveltyAnalysis).filter(NoveltyAnalysis.proposal_id == proposal_id).first()
