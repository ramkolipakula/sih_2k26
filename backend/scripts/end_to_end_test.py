import requests
import time
import sys

BASE_URL = "http://localhost:8000/api/v1"
FILE_PATH = "/home/ramk/sih-2k26/demo_proposal.pdf"

print(f"1. Uploading {FILE_PATH}...")
with open(FILE_PATH, "rb") as f:
    files = {"file": f}
    resp = requests.post(f"{BASE_URL}/proposals/upload", files=files)

if not resp.ok:
    print(f"Upload failed: {resp.text}")
    sys.exit(1)

proposal = resp.json()["data"]
proposal_id = proposal["id"]
print(f"Uploaded successfully. Proposal ID: {proposal_id}")

print("2. Starting document processing (extraction, retrieval)...")
resp = requests.post(f"{BASE_URL}/proposals/{proposal_id}/process")
if not resp.ok:
    print(f"Process start failed: {resp.text}")
    sys.exit(1)

job_id = resp.json()["data"]["job_id"]
print(f"Process Job ID: {job_id}")

print("Waiting for processing to complete...")
while True:
    # We can check processing status using the extraction endpoint
    resp = requests.get(f"{BASE_URL}/proposals/{proposal_id}/extraction")
    if resp.ok and resp.json()["data"]["extraction_status"] in ["COMPLETED", "SUCCESS"]:
        print("Processing completed!")
        break
    time.sleep(2)

print("3. Triggering Tribunal evaluation...")
resp = requests.post(f"{BASE_URL}/evaluations/{proposal_id}/tribunal")
if not resp.ok:
    print(f"Tribunal start failed: {resp.text}")
    sys.exit(1)

tribunal_job = resp.json()["data"]["job_id"]
print(f"Tribunal Job ID: {tribunal_job}")

print("Waiting for Tribunal to complete...")
while True:
    resp = requests.get(f"{BASE_URL}/evaluations/{proposal_id}/tribunal")
    if resp.ok:
        data = resp.json()["data"]
        status = data.get("status")
        print(f"Status: {status}")
        if status in ["COMPLETED", "FAILED"]:
            print(f"Tribunal finished with status: {status}")
            if status == "COMPLETED":
                print(f"Final Decision: {data.get('decision')}")
                print(f"Confidence: {data.get('confidence')}")
            break
    time.sleep(5)

print("4. Verifying Report Generation...")
resp = requests.get(f"{BASE_URL}/evaluations/{proposal_id}/report")
if resp.ok and resp.json()["success"]:
    print("Report generated successfully.")
else:
    print("Failed to generate report.")
    sys.exit(1)

print("ALL STEPS COMPLETED SUCCESSFULLY.")
