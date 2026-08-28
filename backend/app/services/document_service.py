import os
import shutil
import uuid
import magic
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.logging import logger
from app.schemas.proposal import ProposalCreate
from app.repositories.proposal_repository import ProposalRepository
from app.models.proposal import Proposal

ALLOWED_MIME_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
}

class DocumentService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ProposalRepository(db)
    
    def validate_file(self, file: UploadFile) -> str:
        # Check size limitation by seeking to end
        file.file.seek(0, os.SEEK_END)
        size = file.file.tell()
        file.file.seek(0) # Reset pointer
        
        max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if size > max_size:
            logger.warning(f"File {file.filename} exceeded max size of {settings.MAX_UPLOAD_SIZE_MB}MB")
            raise HTTPException(status_code=400, detail=f"File exceeds maximum size of {settings.MAX_UPLOAD_SIZE_MB}MB")

        # Validate MIME type using python-magic
        header = file.file.read(2048)
        file.file.seek(0)
        
        mime_type = magic.from_buffer(header, mime=True)
        if mime_type not in ALLOWED_MIME_TYPES:
            logger.warning(f"Invalid MIME type {mime_type} for file {file.filename}")
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and DOCX are allowed.")
            
        return ALLOWED_MIME_TYPES[mime_type]

    def upload_document(self, file: UploadFile) -> Proposal:
        logger.info(f"Upload started for {file.filename}")
        ext = self.validate_file(file)
        
        # Generate unique filename for storage
        unique_id = str(uuid.uuid4())
        stored_filename = f"{unique_id}.{ext}"
        file_path = os.path.join(settings.STORAGE_PATH, stored_filename)
        
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            logger.error(f"Failed to save file {file.filename}: {e}")
            raise HTTPException(status_code=500, detail="Failed to save file to storage")
            
        file_size = os.path.getsize(file_path)
        
        proposal_data = ProposalCreate(
            title=None,
            uploaded_file_name=file.filename,
            file_path=file_path,
            file_type=ext,
            file_size=file_size
        )
        
        try:
            proposal = self.repo.create_proposal(proposal_data)
            self.repo.add_log(proposal.id, "UPLOAD", "File uploaded successfully")
            logger.info(f"Upload completed for {file.filename} with ID {proposal.id}")
            return proposal
        except Exception as e:
            # Cleanup on db failure
            if os.path.exists(file_path):
                os.remove(file_path)
            logger.error(f"Database error during upload of {file.filename}: {e}")
            raise HTTPException(status_code=500, detail="Database error during upload")
