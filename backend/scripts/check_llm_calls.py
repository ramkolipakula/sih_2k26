import sys
import os
import json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.tribunal.models import TribunalSession, LLMRun

db = SessionLocal()

ts = db.query(TribunalSession).order_by(TribunalSession.created_at.desc()).first()
if ts:
    print(f"TribunalSession {ts.id} - Status: {ts.status.value}")
    runs = db.query(LLMRun).filter(LLMRun.tribunal_session_id == ts.id).all()
    print(f"Total LLM calls for this session: {len(runs)}")
    for run in runs:
        print(f" - {run.agent_role}: {run.total_tokens} tokens ({run.latency_ms}ms)")
        if run.agent_role == 'judge':
            print(f"   Judge Verdict: {json.dumps(run.output_json)}")
else:
    print("No TribunalSession found")
