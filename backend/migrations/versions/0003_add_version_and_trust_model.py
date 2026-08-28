"""Add versioning and trust model

Revision ID: 0003
Revises: 0002
Create Date: 2026-08-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0003'
down_revision = '0002'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add new columns to knowledge_documents
    op.add_column('knowledge_documents', sa.Column('version', sa.String(), nullable=True))
    op.add_column('knowledge_documents', sa.Column('effective_date', sa.DateTime(), nullable=True))
    
    # Create trust_level enum
    # Enums are handled by sa.Enum
    
    # Create source_registry table
    op.create_table(
        'source_registry',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('source_name', sa.String(), nullable=False),
        sa.Column('domain', sa.String(), nullable=True),
        sa.Column('trust_level', sa.Enum('HIGH', 'MEDIUM', 'LOW', name='trustlevel'), nullable=False),
        sa.Column('verified', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('source_registry')
    trust_level_enum = postgresql.ENUM('HIGH', 'MEDIUM', 'LOW', name='trustlevel')
    trust_level_enum.drop(op.get_bind(), checkfirst=True)
    op.drop_column('knowledge_documents', 'effective_date')
    op.drop_column('knowledge_documents', 'version')
