"""Add knowledge tables

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Enums are handled by sa.Enum
    
    op.create_table(
        'knowledge_documents',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('source_type', sa.Enum('GUIDELINE', 'PROJECT', 'PAPER', 'REPORT', 'PATENT', name='sourcetype'), nullable=False),
        sa.Column('source_url', sa.String(), nullable=True),
        sa.Column('organization', sa.String(), nullable=True),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('file_path', sa.String(), nullable=False),
        sa.Column('status', sa.Enum('PROCESSING', 'READY', 'FAILED', name='knowledgestatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'knowledge_chunks',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('document_id', sa.UUID(), nullable=False),
        sa.Column('chunk_text', sa.Text(), nullable=False),
        sa.Column('page_number', sa.Integer(), nullable=True),
        sa.Column('section_name', sa.String(), nullable=True),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('qdrant_point_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['document_id'], ['knowledge_documents.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_knowledge_chunks_document_id'), 'knowledge_chunks', ['document_id'], unique=False)
    
    op.create_table(
        'projects',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('project_code', sa.String(), nullable=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('organization', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('COMPLETED', 'ONGOING', 'APPROVED', 'REJECTED', name='projectstatus'), nullable=True),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('domain', sa.String(), nullable=True),
        sa.Column('objectives', sa.Text(), nullable=True),
        sa.Column('methodology', sa.Text(), nullable=True),
        sa.Column('outcomes', sa.Text(), nullable=True),
        sa.Column('industry_benefit', sa.Text(), nullable=True),
        sa.Column('novelty_information', sa.Text(), nullable=True),
        sa.Column('source_document_id', sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(['source_document_id'], ['knowledge_documents.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'sources',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('document_id', sa.UUID(), nullable=False),
        sa.Column('source_name', sa.String(), nullable=False),
        sa.Column('source_type', sa.String(), nullable=False),
        sa.Column('citation_text', sa.Text(), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['document_id'], ['knowledge_documents.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('sources')
    op.drop_table('projects')
    op.drop_index(op.f('ix_knowledge_chunks_document_id'), table_name='knowledge_chunks')
    op.drop_table('knowledge_chunks')
    op.drop_table('knowledge_documents')
    
    source_type_enum = postgresql.ENUM('GUIDELINE', 'PROJECT', 'PAPER', 'REPORT', 'PATENT', name='sourcetype')
    source_type_enum.drop(op.get_bind(), checkfirst=True)
    knowledge_status_enum = postgresql.ENUM('PROCESSING', 'READY', 'FAILED', name='knowledgestatus')
    knowledge_status_enum.drop(op.get_bind(), checkfirst=True)
    project_status_enum = postgresql.ENUM('COMPLETED', 'ONGOING', 'APPROVED', 'REJECTED', name='projectstatus')
    project_status_enum.drop(op.get_bind(), checkfirst=True)
