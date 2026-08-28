import re
from typing import Dict, Any

class ProposalAnalyzerService:
    def analyze(self, extracted_text: str) -> Dict[str, Any]:
        """
        Deterministically extracts structured fields using regex/keywords.
        No LLM calls allowed.
        """
        # Basic heuristic extraction
        data = {
            "title": self._extract_field(extracted_text, r"(?i)title:\s*(.*)"),
            "domain": self._extract_field(extracted_text, r"(?i)domain:\s*(.*)"),
            "problem_statement": self._extract_paragraph(extracted_text, r"(?i)problem statement\s*"),
            "objectives": self._extract_list(extracted_text, r"(?i)objectives?\s*"),
            "methodology": self._extract_paragraph(extracted_text, r"(?i)methodology\s*"),
            "timeline": self._extract_field(extracted_text, r"(?i)timeline:\s*(.*)"),
            "duration_months": self._extract_duration(extracted_text),
            "budget": self._extract_budget(extracted_text),
            "expected_benefits": self._extract_paragraph(extracted_text, r"(?i)expected benefits\s*"),
            "novelty_claim": self._extract_paragraph(extracted_text, r"(?i)novelty\s*")
        }
        return data

    def _extract_field(self, text: str, pattern: str) -> str:
        match = re.search(pattern, text)
        return match.group(1).strip() if match else None

    def _extract_paragraph(self, text: str, header_pattern: str) -> str:
        # Simplistic approach: find header, capture until double newline or next header
        match = re.search(f"{header_pattern}(.*?)(?:\n\n|\n[A-Z][a-z]+:)", text, re.DOTALL)
        return match.group(1).strip() if match else None

    def _extract_list(self, text: str, header_pattern: str) -> list:
        para = self._extract_paragraph(text, header_pattern)
        if not para:
            return None
        # split by newlines or dashes
        return [item.strip("- \n") for item in para.split("\n") if item.strip()]

    def _extract_duration(self, text: str) -> int:
        match = re.search(r"(?i)(\d+)\s*(months?|years?)", text)
        if match:
            val = int(match.group(1))
            if match.group(2).startswith("year"):
                return val * 12
            return val
        return None

    def _extract_budget(self, text: str) -> dict:
        match = re.search(r"(?i)budget:\s*([\d,]+)", text)
        if match:
            try:
                return {"total": int(match.group(1).replace(",", ""))}
            except ValueError:
                pass
        return None
