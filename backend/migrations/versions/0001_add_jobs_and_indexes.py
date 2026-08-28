"""Add processing jobs and indexing

Revision ID: 0001
Revises: 
Create Date: 2026-08-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Set up enum types for postgres (handled automatically by sa.Enum below)
    op.create_table(
        'proposals',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('uploaded_file_name', sa.String(), nullable=False),
        sa.Column('file_path', sa.String(), nullable=False),
        sa.Column('file_type', sa.String(), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('status', sa.Enum('UPLOADED', 'PROCESSING', 'EXTRACTED', 'FAILED', name='proposalstatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'processing_jobs',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('proposal_id', sa.UUID(), nullable=False),
        sa.Column('job_type', sa.String(), nullable=False),
        sa.Column('status', sa.Enum('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', name='jobstatus'), nullable=False),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['proposal_id'], ['proposals.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_processing_jobs_proposal_id'), 'processing_jobs', ['proposal_id'], unique=False)
    op.create_index(op.f('ix_processing_jobs_status'), 'processing_jobs', ['status'], unique=False)

    op.create_table(
        'proposal_extractions',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('proposal_id', sa.UUID(), nullable=False),
        sa.Column('raw_text', sa.Text(), nullable=True),
        sa.Column('extracted_json', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('page_count', sa.Integer(), nullable=True),
        sa.Column('extraction_status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['proposal_id'], ['proposals.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_proposal_extractions_proposal_id'), 'proposal_extractions', ['proposal_id'], unique=False)

    op.create_table(
        'processing_logs',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('proposal_id', sa.UUID(), nullable=False),
        sa.Column('stage', sa.String(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['proposal_id'], ['proposals.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_processing_logs_proposal_id'), 'processing_logs', ['proposal_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_processing_logs_proposal_id'), table_name='processing_logs')
    op.drop_table('processing_logs')
    op.drop_index(op.f('ix_proposal_extractions_proposal_id'), table_name='proposal_extractions')
    op.drop_table('proposal_extractions')
    op.drop_index(op.f('ix_processing_jobs_status'), table_name='processing_jobs')
    op.drop_index(op.f('ix_processing_jobs_proposal_id'), table_name='processing_jobs')
    op.drop_table('processing_jobs')
    op.drop_table('proposals')
    job_status_enum = postgresql.ENUM('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', name='jobstatus')
    job_status_enum.drop(op.get_bind(), checkfirst=True)
