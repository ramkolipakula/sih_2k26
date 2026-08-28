"""Phase 3.2 Infrastructure Hardening

Revision ID: 0006
Revises: 0005
Create Date: 2026-08-28 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0006'
down_revision = '0005'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1. Update SourceRegistry
    # Note: 'verified' was previously String, altering to Boolean
    # using 'USING verified::boolean'
    op.execute("ALTER TABLE source_registry ALTER COLUMN verified TYPE BOOLEAN USING CASE WHEN verified='True' THEN true ELSE false END")

    # 2. Update KnowledgeDocument
    op.add_column('knowledge_documents', sa.Column('source_registry_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column('knowledge_documents', sa.Column('verified', sa.Boolean(), server_default='false', nullable=True))
    op.create_foreign_key('fk_knowledge_doc_source_registry', 'knowledge_documents', 'source_registry', ['source_registry_id'], ['id'])

    # 3. Update NoveltyAnalysis
    op.add_column('novelty_analysis', sa.Column('similarity_interpretation', sa.String(), nullable=True))
    op.add_column('novelty_analysis', sa.Column('semantic_novelty', sa.String(), server_default='UNDETERMINED', nullable=True))
    
    # 4. Modify novelty_level to be nullable
    op.alter_column('novelty_analysis', 'novelty_level', existing_type=sa.VARCHAR(9), nullable=True)

def downgrade() -> None:
    op.alter_column('novelty_analysis', 'novelty_level', existing_type=sa.VARCHAR(9), nullable=False)
    op.drop_column('novelty_analysis', 'semantic_novelty')
    op.drop_column('novelty_analysis', 'similarity_interpretation')

    op.drop_constraint('fk_knowledge_doc_source_registry', 'knowledge_documents', type_='foreignkey')
    op.drop_column('knowledge_documents', 'verified')
    op.drop_column('knowledge_documents', 'source_registry_id')

    op.execute("ALTER TABLE source_registry ALTER COLUMN verified TYPE VARCHAR USING CASE WHEN verified=true THEN 'True' ELSE 'False' END")
