"""
Task model with soft delete and modification tracking
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func
from sqlalchemy.sql import func
from app.db.database import Base

class Task(Base):
    """
    Task model representing a TODO item
    
    Attributes:
        id: Primary key, auto-incrementing integer
        title: Task title (required, max 255 characters)
        description: Task description (optional, text field)
        is_deleted: Boolean flag for soft delete functionality
        modification_count: Integer tracking number of times task was modified
        created_at: Timestamp when task was created
        updated_at: Timestamp when task was last updated
    """
    
    __tablename__ = "tasks"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Task content
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Status flags
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    
    # Tracking fields
    modification_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        """String representation of the Task model"""
        return f"<Task(id={self.id}, title='{self.title}', is_deleted={self.is_deleted})>"
    
    def to_dict(self):
        """Convert task instance to dictionary"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "is_deleted": self.is_deleted,
            "modification_count": self.modification_count,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
