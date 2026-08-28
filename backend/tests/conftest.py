import pytest
import os
from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import get_db, Base
from app.core.config import settings

@pytest.fixture(scope="session", autouse=True)
def setup_postgres():
    # Use the real database URL but we'll use transactions to rollback
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()

@pytest.fixture(scope="function")
def db_session(setup_postgres):
    engine = setup_postgres
    connection = engine.connect()
    transaction = connection.begin()
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=connection)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        transaction.rollback()
        connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Mock celery task .delay to avoid hitting non-existent redis during API tests
    with patch("worker.tasks.process_document_task.delay") as mock_task, \
         patch("worker.knowledge_tasks.ingest_document_task.delay") as mock_know_task, \
         patch("worker.evaluation_tasks.evaluate_proposal_task.delay") as mock_eval_task:
        with TestClient(app) as c:
            yield c
        
    app.dependency_overrides.clear()

