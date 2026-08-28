from typing import Dict, Any, List
from app.evaluation.models.evaluation import EvaluationRule, FindingStatus
from app.evaluation.schemas.evaluation import EvidenceType

class RuleEngineService:
    def evaluate(self, analysis_data: Dict[str, Any], rules: List[EvaluationRule]) -> List[Dict[str, Any]]:
        findings = []
        for rule in rules:
            condition = rule.condition_json
            field = condition.get("field")
            op = condition.get("operator")
            target_val = condition.get("value")
            
            actual_val = analysis_data.get(field)
            
            passed = True
            if actual_val is None:
                passed = False
            elif op == "LESS_THAN_EQUAL":
                passed = actual_val <= target_val
            elif op == "GREATER_THAN_EQUAL":
                passed = actual_val >= target_val
            elif op == "EQUALS":
                passed = actual_val == target_val
                
            evidence = []
            if not passed:
                evidence.append({
                    "type": EvidenceType.RULE.value,
                    "source": rule.rule_code,
                    "quote": f"Condition {op} {target_val} failed for value {actual_val}",
                    "confidence": 1.0
                })

            findings.append({
                "category": rule.category,
                "finding_type": rule.rule_code,
                "severity": rule.severity,
                "status": FindingStatus.PASS if passed else FindingStatus.FAIL,
                "description": f"Rule {rule.name}: {rule.description}",
                "confidence": 1.0,
                "evidence_reference": evidence
            })
            
        return findings
