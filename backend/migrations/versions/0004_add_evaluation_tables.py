"""Add evaluation tables

Revision ID: 0004
Revises: 0003
Create Date: 2026-08-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0004'
down_revision = '0003'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Enums handled by sa.Enum
    
    op.create_table(
        'proposal_analysis',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('proposal_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('domain', sa.String(), nullable=True),
        sa.Column('problem_statement', sa.Text(), nullable=True),
        sa.Column('objectives', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('methodology', sa.Text(), nullable=True),
        sa.Column('timeline', sa.String(), nullable=True),
        sa.Column('duration_months', sa.Integer(), nullable=True),
        sa.Column('budget', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('expected_benefits', sa.Text(), nullable=True),
        sa.Column('novelty_claim', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['proposal_id'], ['proposals.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_proposal_analysis_proposal_id'), 'proposal_analysis', ['proposal_id'], unique=False)
    
    op.create_table(
        'evaluation_rules',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('rule_code', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('category', sa.Enum('COMPLIANCE', 'NOVELTY', 'FEASIBILITY', 'IMPACT', 'FINANCIAL', 'GAP', name='findingcategory'), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('severity', sa.Enum('LOW', 'MEDIUM', 'HIGH', name='findingseverity'), nullable=False),
        sa.Column('condition_json', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('rule_code')
    )
    
    op.create_table(
        'evaluation_findings',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('analysis_id', sa.UUID(), nullable=False),
        sa.Column('proposal_id', sa.UUID(), nullable=False),
        sa.Column('category', sa.Enum('COMPLIANCE', 'NOVELTY', 'FEASIBILITY', 'IMPACT', 'FINANCIAL', 'GAP', name='findingcategory'), nullable=False),
        sa.Column('finding_type', sa.String(), nullable=False),
        sa.Column('severity', sa.Enum('LOW', 'MEDIUM', 'HIGH', name='findingseverity'), nullable=False),
        sa.Column('status', sa.Enum('PASS', 'FAIL', 'WARNING', name='findingstatus'), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('evidence_reference', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['analysis_id'], ['proposal_analysis.id'], ),
        sa.ForeignKeyConstraint(['proposal_id'], ['proposals.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_evaluation_findings_analysis_id'), 'evaluation_findings', ['analysis_id'], unique=False)
    op.create_index(op.f('ix_evaluation_findings_proposal_id'), 'evaluation_findings', ['proposal_id'], unique=False)
    
    op.create_table(
        'novelty_analysis',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('analysis_id', sa.UUID(), nullable=False),
        sa.Column('proposal_id', sa.UUID(), nullable=False),
        sa.Column('similar_projects', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('similarity_score', sa.Float(), nullable=True),
        sa.Column('difference_analysis', sa.Text(), nullable=True),
        sa.Column('novelty_level', sa.Enum('LOW', 'MODERATE', 'HIGH', name='noveltylevel'), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('progressive_assessment', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['analysis_id'], ['proposal_analysis.id'], ),
        sa.ForeignKeyConstraint(['proposal_id'], ['proposals.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_novelty_analysis_analysis_id'), 'novelty_analysis', ['analysis_id'], unique=False)
    op.create_index(op.f('ix_novelty_analysis_proposal_id'), 'novelty_analysis', ['proposal_id'], unique=False)

def downgrade() -> None:
    op.drop_table('novelty_analysis')
    op.drop_table('evaluation_findings')
    op.drop_table('evaluation_rules')
    op.drop_table('proposal_analysis')
    
    postgresql.ENUM('LOW', 'MODERATE', 'HIGH', name='noveltylevel').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('PASS', 'FAIL', 'WARNING', name='findingstatus').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('LOW', 'MEDIUM', 'HIGH', name='findingseverity').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('COMPLIANCE', 'NOVELTY', 'FEASIBILITY', 'IMPACT', 'FINANCIAL', 'GAP', name='findingcategory').drop(op.get_bind(), checkfirst=True)
