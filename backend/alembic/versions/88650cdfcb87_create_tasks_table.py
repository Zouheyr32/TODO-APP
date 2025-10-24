"""Create tasks table

Revision ID: 88650cdfcb87
Revises: 
Create Date: 2025-10-24 23:51:02.609481

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '88650cdfcb87'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create tasks table
    op.create_table('tasks',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_completed', sa.Boolean(), nullable=False, default=False),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, default=False),
        sa.Column('modification_count', sa.Integer(), nullable=False, default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for better performance
    op.create_index(op.f('ix_tasks_id'), 'tasks', ['id'], unique=False)
    op.create_index(op.f('ix_tasks_is_deleted'), 'tasks', ['is_deleted'], unique=False)
    op.create_index(op.f('ix_tasks_title'), 'tasks', ['title'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_tasks_title'), table_name='tasks')
    op.drop_index(op.f('ix_tasks_is_deleted'), table_name='tasks')
    op.drop_index(op.f('ix_tasks_id'), table_name='tasks')
    
    # Drop tasks table
    op.drop_table('tasks')
