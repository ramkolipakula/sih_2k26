# R&D Proposal Evaluation Platform

## Project Overview

This project is Phase 1 (Foundation Layer) of the AI-powered R&D Proposal Evaluation Platform for SIH PS 25180. 
It provides a robust, production-ready backend API that future phases can extend with AI-based review agents, scoring, and judgment logic.

Currently, it supports:
- Uploading proposal documents (PDF/DOCX)
- Local storage abstraction (designed to be replaceable by S3/Supabase)
- Document processing pipeline (PyMuPDF for PDF, python-docx for DOCX)
- Robust error handling and audit trails (Processing Logs)
- Fully asynchronous API built with FastAPI and PostgreSQL

## Architecture Diagram

*(See the `implementation_plan.md` artifact for detailed Architecture and ER Diagrams)*

## Setup Instructions

### Environment Variables
The application reads from environment variables, which can be configured via a `.env` file (not checked in) or Docker environment configurations:

- `DATABASE_URL`: PostgreSQL connection string (default: `postgresql://user:password@localhost:5432/proposals_db`)
- `STORAGE_PATH`: Local path for storing uploaded documents (default: `./storage`)
- `ENVIRONMENT`: deployment environment (e.g., `development`, `production`)

### Using Docker (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. Build and run the services:
   ```bash
   docker-compose up -d --build
   ```
3. The API will be available at `http://localhost:8000`.

### Running Locally without Docker

1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Start your PostgreSQL database and update `DATABASE_URL` appropriately.
3. Run migrations:
   ```bash
   alembic upgrade head
   ```
4. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation

FastAPI provides an automatic Swagger UI that you can explore by visiting:
- [Swagger UI](http://localhost:8000/docs)
- [ReDoc](http://localhost:8000/redoc)

### Core Endpoints

- `POST /api/v1/proposals/upload`: Upload proposal PDF/DOCX
- `GET /api/v1/proposals`: Returns list of proposals
- `GET /api/v1/proposals/{id}`: Returns proposal details
- `POST /api/v1/proposals/{id}/extract`: Triggers document extraction pipeline
- `GET /api/v1/proposals/{id}/extraction`: Returns extracted content (JSON schema for AI extraction)

## Testing Instructions

1. Install testing dependencies if not using Docker (or run inside the Docker container):
   ```bash
   pip install pytest pytest-asyncio httpx
   ```
2. Run the test suite:
   ```bash
   pytest
   ```
The tests use an in-memory SQLite database (`test.db`) to verify endpoints cleanly without touching the production PostgreSQL.

## Future Phase Roadmap

- **Phase 2:** Integrate LangChain/LangGraph for AI document understanding and populated `extracted_json`.
- **Phase 3:** Create AI review agents to score proposals against CMPDI/NaCCER guidelines.
- **Phase 4:** Build the decision rationale system mapping evidence to judgment.
