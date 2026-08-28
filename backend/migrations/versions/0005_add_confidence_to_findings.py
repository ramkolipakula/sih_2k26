"""Add confidence to findings

Revision ID: 0005
Revises: 0004
Create Date: 2026-08-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0005'
down_revision = '0004'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('evaluation_findings', sa.Column('confidence', sa.Float(), nullable=True))

def downgrade() -> None:
    op.drop_column('evaluation_findings', 'confidence')
