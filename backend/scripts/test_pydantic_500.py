import sys
import os
import uuid
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.repositories.proposal_repository import ProposalRepository
from app.schemas.proposal import ProposalExtractionResponseData

db = SessionLocal()
repo = ProposalRepository(db)
extraction = repo.get_extraction(uuid.UUID("64089f97-4f6e-4343-9e16-8fc0c1be9bfb"))
print("Extracted DB object:")
print(extraction.__dict__)

try:
    resp = ProposalExtractionResponseData.from_attributes(extraction)
    print("Serialized successfully!")
except Exception as e:
    import traceback
    traceback.print_exc()

try:
    resp2 = ProposalExtractionResponseData.model_validate(extraction)
    print("Serialized successfully with model_validate!")
except Exception as e:
    import traceback
    traceback.print_exc()
