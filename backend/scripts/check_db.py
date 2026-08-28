import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.proposal import ProcessingJob
from app.tribunal.models import TribunalSession

db = SessionLocal()

print("--- Jobs ---")
for job in db.query(ProcessingJob).order_by(ProcessingJob.created_at.desc()).limit(5).all():
    print(f"[{job.created_at}] Type: {job.job_type} | Status: {job.status.value} | Error: {job.error_message}")

print("\n--- Tribunal Sessions ---")
for ts in db.query(TribunalSession).order_by(TribunalSession.created_at.desc()).limit(3).all():
    print(f"[{ts.created_at}] Status: {ts.status.value} | Decision: {ts.decision.value if ts.decision else 'None'}")
