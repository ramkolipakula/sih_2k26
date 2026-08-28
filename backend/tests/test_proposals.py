import io
from app.models.proposal import JobStatus, ProposalStatus
from worker.tasks import process_document_task

def test_upload_valid_pdf(client):
    file_content = b"%PDF-1.4\nTest PDF content"
    response = client.post(
        "/api/v1/proposals/upload",
        files={"file": ("test.pdf", io.BytesIO(file_content), "application/pdf")}
    )
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    data = res["data"]
    assert data["filename"] == "test.pdf"
    assert data["status"] == "UPLOADED"
    assert "id" in data

def test_reject_invalid_extension(client):
    file_content = b"Invalid file type content"
    response = client.post(
        "/api/v1/proposals/upload",
        files={"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
    )
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

def test_get_proposal(client):
    file_content = b"%PDF-1.4\nTest PDF content"
    upload_res = client.post(
        "/api/v1/proposals/upload",
        files={"file": ("test_get.pdf", io.BytesIO(file_content), "application/pdf")}
    )
    proposal_id = upload_res.json()["data"]["id"]

    response = client.get(f"/api/v1/proposals/{proposal_id}")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["id"] == proposal_id
    assert data["status"] == "UPLOADED"
    assert data["uploaded_file_name"] == "test_get.pdf"

def test_process_job_creation(client):
    # Upload
    file_content = b"%PDF-1.4\nTest PDF content"
    upload_res = client.post(
        "/api/v1/proposals/upload",
        files={"file": ("test_process.pdf", io.BytesIO(file_content), "application/pdf")}
    )
    proposal_id = upload_res.json()["data"]["id"]
    
    # Process
    process_res = client.post(f"/api/v1/proposals/{proposal_id}/process")
    assert process_res.status_code == 202
    data = process_res.json()["data"]
    assert "job_id" in data
    assert data["status"] == "QUEUED"
    
def test_worker_updates_status(client, db_session):
    # Upload
    file_content = b"Not a real PDF but magic check might pass if we don't mock it, wait, magic check needs actual PDF header"
    # To pass python-magic we need a realistic PDF header
    pdf_header = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n"
    
    upload_res = client.post(
        "/api/v1/proposals/upload",
        files={"file": ("worker_test.pdf", io.BytesIO(pdf_header), "application/pdf")}
    )
    proposal_id = upload_res.json()["data"]["id"]
    
    # Process (queues job)
    process_res = client.post(f"/api/v1/proposals/{proposal_id}/process")
    job_id = process_res.json()["data"]["job_id"]
    
    # Manually run celery task synchronously
    process_document_task(job_id)
    
    # Check job status API
    job_res = client.get(f"/api/v1/jobs/{job_id}")
    assert job_res.status_code == 200
    job_data = job_res.json()["data"]
    assert job_data["status"] == "FAILED" # It will fail because it's a corrupted fake PDF
    
    # Check proposal status
    prop_res = client.get(f"/api/v1/proposals/{proposal_id}")
    assert prop_res.json()["data"]["status"] == "FAILED"
