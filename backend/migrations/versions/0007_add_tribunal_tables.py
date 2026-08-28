"""Add tribunal, LLM audit, external research, and human review tables

Revision ID: 0007_add_tribunal_tables
Revises: 0006_phase_3_2_hardening
Create Date: 2026-08-28
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision = '0007_add_tribunal_tables'
down_revision = '0006'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Tribunal Sessions
    op.create_table(
        'tribunal_sessions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('proposal_id', UUID(as_uuid=True), sa.ForeignKey('proposals.id'), nullable=False, index=True),
        sa.Column('evidence_package_id', UUID(as_uuid=True), nullable=True),
        sa.Column('status', sa.String(), nullable=False, server_default='PENDING'),
        sa.Column('decision', sa.String(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('advocate_argument', JSONB(), nullable=True),
        sa.Column('critic_argument', JSONB(), nullable=True),
        sa.Column('judge_verdict', JSONB(), nullable=True),
        sa.Column('evidence_package_snapshot', JSONB(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
    )

    # LLM Audit Runs
    op.create_table(
        'llm_runs',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('tribunal_session_id', UUID(as_uuid=True), sa.ForeignKey('tribunal_sessions.id'), nullable=True, index=True),
        sa.Column('proposal_id', UUID(as_uuid=True), sa.ForeignKey('proposals.id'), nullable=True, index=True),
        sa.Column('agent_role', sa.String(), nullable=False),
        sa.Column('provider', sa.String(), nullable=False),
        sa.Column('model', sa.String(), nullable=False),
        sa.Column('prompt_version', sa.String(), server_default='1.0'),
        sa.Column('system_prompt_hash', sa.String(), nullable=True),
        sa.Column('input_tokens', sa.Integer(), nullable=True),
        sa.Column('output_tokens', sa.Integer(), nullable=True),
        sa.Column('total_tokens', sa.Integer(), nullable=True),
        sa.Column('latency_ms', sa.Float(), nullable=True),
        sa.Column('output_json', JSONB(), nullable=True),
        sa.Column('status', sa.String(), server_default='success'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # External Research
    op.create_table(
        'external_research',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('proposal_id', UUID(as_uuid=True), sa.ForeignKey('proposals.id'), nullable=False, index=True),
        sa.Column('url', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('snippet', sa.Text(), nullable=True),
        sa.Column('publication_date', sa.String(), nullable=True),
        sa.Column('retrieved_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('trust_level', sa.String(), server_default='LOW'),
        sa.Column('relevance_score', sa.Float(), nullable=True),
    )

    # Human Reviews
    op.create_table(
        'human_reviews',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('tribunal_session_id', UUID(as_uuid=True), sa.ForeignKey('tribunal_sessions.id'), nullable=False, index=True),
        sa.Column('proposal_id', UUID(as_uuid=True), sa.ForeignKey('proposals.id'), nullable=False, index=True),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('reviewer_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('human_reviews')
    op.drop_table('external_research')
    op.drop_table('llm_runs')
    op.drop_table('tribunal_sessions')
