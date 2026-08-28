import sys
import os
import uuid
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.repositories.proposal_repository import ProposalRepository

db = SessionLocal()
repo = ProposalRepository(db)
try:
    extraction = repo.get_extraction(uuid.UUID("a6ee0540-9da7-4cb1-9542-ba2591cba827"))
    print(extraction)
except Exception as e:
    import traceback
    traceback.print_exc()
