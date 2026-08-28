from typing import Dict, Any, List
from app.evaluation.models.evaluation import FindingCategory, FindingSeverity, FindingStatus
from app.evaluation.schemas.evaluation import EvidenceType

class EvidenceGapDetectorService:
    def detect_gaps(self, analysis_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        gaps = []
        
        methodology = analysis_data.get("methodology", "")
        if not methodology or len(methodology) < 50:
            gaps.append({
                "category": FindingCategory.GAP,
                "finding_type": "MISSING_METHODOLOGY",
                "severity": FindingSeverity.HIGH,
                "status": FindingStatus.FAIL,
                "description": "Methodology section is missing or insufficiently detailed.",
                "confidence": 1.0,
                "evidence_reference": [{
                    "type": EvidenceType.INTERNAL_ANALYSIS.value,
                    "source": "ProposalAnalyzer",
                    "quote": "Methodology field empty or too short.",
                    "confidence": 1.0
                }]
            })
            
        objectives = analysis_data.get("objectives", [])
        if not objectives:
            gaps.append({
                "category": FindingCategory.GAP,
                "finding_type": "MISSING_OBJECTIVES",
                "severity": FindingSeverity.HIGH,
                "status": FindingStatus.FAIL,
                "description": "No concrete objectives extracted from the proposal.",
                "confidence": 1.0,
                "evidence_reference": [{
                    "type": EvidenceType.INTERNAL_ANALYSIS.value,
                    "source": "ProposalAnalyzer",
                    "quote": "Objectives array is empty.",
                    "confidence": 1.0
                }]
            })
            
        budget = analysis_data.get("budget", {})
        if not budget:
            gaps.append({
                "category": FindingCategory.GAP,
                "finding_type": "MISSING_BUDGET",
                "severity": FindingSeverity.MEDIUM,
                "status": FindingStatus.FAIL,
                "description": "Financial details are missing.",
                "confidence": 1.0,
                "evidence_reference": [{
                    "type": EvidenceType.INTERNAL_ANALYSIS.value,
                    "source": "ProposalAnalyzer",
                    "quote": "Budget field is empty.",
                    "confidence": 1.0
                }]
            })
            
        return gaps
