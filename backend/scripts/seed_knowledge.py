#!/usr/bin/env python3
"""
Knowledge Base Seed Script.

Seeds the database with SYNTHETIC DEMO DATA for demonstration purposes.
All data is clearly marked as DEMO/SYNTHETIC.

Usage:
    python scripts/seed_knowledge.py
"""
import uuid
import os
import sys

# Ensure the project root is on the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app.core.database import SessionLocal
from app.knowledge.models.knowledge import (
    KnowledgeDocument, KnowledgeChunk, SourceType, KnowledgeStatus,
    SourceRegistry, TrustLevel, Project, ProjectStatus,
)
from app.evaluation.models.evaluation import EvaluationRule, FindingCategory, FindingSeverity
from app.knowledge.services.embedding_service import EmbeddingService

# --- DEMO DATA ---
# All data below is SYNTHETIC and clearly marked as demo data.
# It does NOT represent real CMPDI or government projects.

DEMO_PROJECTS = [
    {
        "title": "[DEMO] Underground Methane Detection Using IoT Sensor Networks",
        "organization": "DEMO Research Lab",
        "source_type": SourceType.PROJECT,
        "year": 2022,
        "version": "1.0",
        "status": ProjectStatus.COMPLETED,
        "domain": "Mining Safety",
        "objectives": "Deploy IoT-based methane detection sensors in underground coal mines for real-time monitoring and alerting.",
        "methodology": "Deployed 50 IoT sensors across 3 underground mines. Used threshold-based alerting with 500ppm trigger. Data collected over 12 months.",
        "outcomes": "Achieved 94% detection accuracy. Reduced response time from 15 minutes to 30 seconds. System operational in 3 mines.",
        "novelty_information": "First deployment of mesh-network IoT sensors specifically designed for underground mine gas detection in Indian coal mines.",
        "text_content": """This project deployed IoT-based methane detection sensors in underground coal mines.
The system uses a mesh network of 50 sensors capable of detecting methane concentrations above 500ppm.
Detection accuracy achieved was 94% with a response time of 30 seconds.
The project focused on DETECTION of methane presence, not prediction of methane accumulation.
Budget: INR 45 lakhs. Duration: 18 months. Status: COMPLETED and operational in 3 mines.
Key limitation: The system is reactive - it detects methane AFTER it accumulates, not before.
This means evacuation can only begin after dangerous levels are already present.""",
    },
    {
        "title": "[DEMO] Automated Coal Quality Assessment System",
        "organization": "DEMO Mining Institute",
        "source_type": SourceType.PROJECT,
        "year": 2023,
        "version": "1.0",
        "status": ProjectStatus.APPROVED,
        "domain": "Mining Technology",
        "objectives": "Develop automated system for coal quality grading using computer vision and spectroscopy.",
        "methodology": "Combined hyperspectral imaging with ML classifiers. Trained on 10,000 coal samples from 5 mines.",
        "outcomes": "Achieved 91% classification accuracy for coal grades. Reduced manual testing time by 60%.",
        "novelty_information": "Novel combination of hyperspectral imaging and gradient boosting for coal quality in Indian context.",
        "text_content": """Automated coal quality assessment using computer vision and spectroscopy.
The system combines hyperspectral imaging with machine learning classifiers.
Trained on 10,000 coal samples from 5 different mines.
Classification accuracy: 91% across 4 coal grades.
Budget: INR 60 lakhs. Duration: 24 months. Status: APPROVED for deployment.
The system performs automated GRADING, not predictive quality forecasting.""",
    },
    {
        "title": "[DEMO] Mine Roof Fall Risk Assessment - Manual Inspection Protocol",
        "organization": "DEMO Safety Council",
        "source_type": SourceType.GUIDELINE,
        "year": 2021,
        "version": "2.0",
        "status": ProjectStatus.COMPLETED,
        "domain": "Mining Safety",
        "objectives": "Standardize manual inspection protocols for underground mine roof stability assessment.",
        "methodology": "Expert panel developed checklist-based inspection protocol. Validated across 20 mines over 2 years.",
        "outcomes": "Protocol adopted by 15 mines. Reduced roof fall incidents by 20% in participating mines.",
        "novelty_information": "Comprehensive manual inspection protocol - no automated or predictive component.",
        "text_content": """Mine roof fall risk assessment guideline v2.0.
This guideline establishes manual inspection protocols for assessing roof stability in underground mines.
Inspectors use a 47-point checklist covering geological, structural, and operational factors.
Assessment frequency: Weekly for active faces, monthly for support areas.
The protocol is entirely MANUAL - inspectors physically examine roof conditions.
Limitation: Cannot predict future roof conditions, only assess current state.
Adopted by 15 mines with 20% reduction in roof fall incidents.
Budget for implementation: INR 5 lakhs per mine. Effective date: January 2021.""",
    },
    {
        "title": "[DEMO] Rejected Proposal - Basic Methane Monitoring System",
        "organization": "DEMO University",
        "source_type": SourceType.PROJECT,
        "year": 2023,
        "version": "1.0",
        "status": ProjectStatus.REJECTED,
        "domain": "Mining Safety",
        "objectives": "Deploy basic methane sensors for mine monitoring.",
        "methodology": "Install commercial off-the-shelf methane sensors with SMS alerting.",
        "outcomes": "N/A - Rejected",
        "novelty_information": "No novel component. Uses commercially available sensors with standard alerting.",
        "text_content": """REJECTED PROPOSAL: Basic methane monitoring using commercial sensors.
REJECTION REASONS:
1. INSUFFICIENT NOVELTY - Commercially available sensors already deployed in many mines.
2. NO ADVANCEMENT - Does not improve upon existing detection capabilities.
3. INADEQUATE VALIDATION - No comparison with existing systems. No performance baseline.
4. BUDGET CONCERNS - INR 30 lakhs for off-the-shelf components deemed excessive.
The proposal was rejected because it merely replicates existing commercially available
methane detection systems without any technological advancement or research contribution.
Similar systems are already operational in multiple mines at lower cost.""",
    },
]

DEMO_RULES = [
    {
        "rule_code": "DURATION_MAX",
        "name": "Maximum Project Duration",
        "category": FindingCategory.COMPLIANCE,
        "description": "Project duration must not exceed 36 months",
        "severity": FindingSeverity.HIGH,
        "condition_json": {"field": "duration_months", "operator": "LESS_THAN_EQUAL", "value": 36},
    },
    {
        "rule_code": "BUDGET_MAX",
        "name": "Maximum Budget",
        "category": FindingCategory.FINANCIAL,
        "description": "Total budget must not exceed INR 200 lakhs (20 million)",
        "severity": FindingSeverity.HIGH,
        "condition_json": {"field": "budget_total", "operator": "LESS_THAN_EQUAL", "value": 20000000},
    },
    {
        "rule_code": "OBJ_REQUIRED",
        "name": "Objectives Required",
        "category": FindingCategory.COMPLIANCE,
        "description": "Proposal must include clearly defined objectives",
        "severity": FindingSeverity.HIGH,
        "condition_json": {"field": "objectives", "operator": "NOT_EMPTY", "value": True},
    },
]


def seed():
    db = SessionLocal()
    embed_service = EmbeddingService()

    print("=== R&D Knowledge Base Seeding (DEMO DATA) ===")
    print("WARNING: All data is SYNTHETIC for demonstration purposes only.\n")

    # Create source registry
    registry = SourceRegistry(
        source_name="DEMO Research Lab",
        domain="Mining Safety",
        trust_level=TrustLevel.MEDIUM,
        verified=False,
    )
    db.add(registry)
    db.commit()
    db.refresh(registry)
    print(f"Created source registry: {registry.source_name}")

    # Seed knowledge documents
    from qdrant_client import QdrantClient
    from qdrant_client.http.models import Distance, VectorParams, PointStruct
    from app.core.config import settings

    qdrant = QdrantClient(url=settings.QDRANT_URL)
    col_name = settings.QDRANT_COLLECTION_NAME

    # Ensure collection
    try:
        qdrant.get_collection(col_name)
    except Exception:
        qdrant.create_collection(
            collection_name=col_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )

    for proj_data in DEMO_PROJECTS:
        doc = KnowledgeDocument(
            title=proj_data["title"],
            source_type=proj_data["source_type"],
            organization=proj_data["organization"],
            year=proj_data["year"],
            version=proj_data["version"],
            description=f"[DEMO/SYNTHETIC] {proj_data['objectives']}",
            file_path="demo_seed",
            status=KnowledgeStatus.READY,
            source_registry_id=registry.id,
            verified=False,
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        # Create project record
        project = Project(
            title=proj_data["title"],
            organization=proj_data["organization"],
            status=proj_data["status"],
            year=proj_data["year"],
            domain=proj_data["domain"],
            objectives=proj_data["objectives"],
            methodology=proj_data["methodology"],
            outcomes=proj_data["outcomes"],
            novelty_information=proj_data["novelty_information"],
            source_document_id=doc.id,
        )
        db.add(project)
        db.commit()

        # Embed and store text
        text = proj_data["text_content"]
        embedding = embed_service.generate_embedding(text)

        point_id = str(uuid.uuid4())
        payload = {
            "document_id": str(doc.id),
            "source_name": proj_data["title"],
            "source_type": proj_data["source_type"].value,
            "organization": proj_data["organization"],
            "year": proj_data["year"],
            "version": proj_data["version"],
            "page_number": 1,
            "section": "Full Document",
            "text": text,
            "trust_level": "MEDIUM",
            "verified": False,
            "project_status": proj_data["status"].value,
        }

        qdrant.upsert(
            collection_name=col_name,
            points=[PointStruct(id=point_id, vector=embedding, payload=payload)],
        )

        # Save chunk record
        chunk = KnowledgeChunk(
            document_id=doc.id,
            chunk_text=text,
            page_number=1,
            section_name="Full Document",
            chunk_index=0,
            qdrant_point_id=uuid.UUID(point_id),
        )
        db.add(chunk)
        db.commit()

        status_label = proj_data["status"].value
        print(f"  ✓ Seeded: {proj_data['title']} [{status_label}]")

    # Seed evaluation rules
    for rule_data in DEMO_RULES:
        existing = db.query(EvaluationRule).filter(EvaluationRule.rule_code == rule_data["rule_code"]).first()
        if not existing:
            rule = EvaluationRule(**rule_data)
            db.add(rule)
            print(f"  ✓ Rule: {rule_data['rule_code']} - {rule_data['name']}")

    db.commit()
    db.close()

    print(f"\n=== Seeding complete ===")
    print(f"  Documents: {len(DEMO_PROJECTS)}")
    print(f"  Rules: {len(DEMO_RULES)}")
    print(f"  NOTE: All data is SYNTHETIC DEMO DATA")


if __name__ == "__main__":
    seed()
