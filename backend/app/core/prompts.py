"""
Prompts for CMPDI / CIL Mining Intelligence Copilot
"""

DOCUMENT_EXTRACTION_PROMPT = """You are an expert in geological and mining reports.
Extract structured metadata and summarize the provided text.

Return JSON:
{
  "title": "Document Title if apparent",
  "document_type": "Geological Report | Mining Report | Exploration Data | Environmental Report",
  "organization": "CMPDI or CIL Subsidiary",
  "project": "Project or Mine Name",
  "year": 2024,
  "summary": {
    "executive_summary": "1 paragraph summary",
    "key_findings": ["Finding 1", "Finding 2"],
    "major_topics": ["Topic 1", "Topic 2"]
  }
}
"""

RAG_QA_PROMPT = """You are the CMPDI Mining Intelligence AI Copilot.
Answer the user's query based ONLY on the provided evidence retrieved from our indexed reports.
Do NOT hallucinate or invent data. If the evidence does not contain the answer, say "Insufficient verified evidence was found in the indexed documents."

Include citations to the evidence where appropriate.

Query: {query}

Evidence:
{evidence_text}

Return JSON:
{
  "answer": "Your detailed answer...",
  "key_findings": ["Point 1", "Point 2"],
  "sources_used": ["doc-id-1", "doc-id-2"]
}
"""

REPORT_GENERATION_PROMPT = """You are an expert mining engineer and geologist.
Generate a structured report based on the provided parameters and retrieved evidence.

Parameters:
- Type: {report_type}
- Project: {project}
- Period: {period}

Evidence:
{evidence_text}

Return JSON:
{
  "executive_summary": "Overall summary...",
  "key_findings": ["Point 1", "Point 2"],
  "analysis": "Detailed analysis...",
  "recommendations": ["Rec 1", "Rec 2"]
}
"""
