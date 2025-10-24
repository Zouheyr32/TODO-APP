"""
Pydantic schemas for Task model validation and serialization
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class TaskBase(BaseModel):
    """
    Base schema for Task with common fields
    """
    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    is_completed: bool = Field(False, description="Task completion status")


class TaskCreate(TaskBase):
    """
    Schema for creating a new task
    """
    pass


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task
    All fields are optional for partial updates
    """
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    is_completed: Optional[bool] = Field(None, description="Task completion status")
    
    class Config:
        # Allow partial updates
        extra = "forbid"


class TaskResponse(TaskBase):
    """
    Schema for task response data
    """
    id: int = Field(..., description="Task ID")
    is_deleted: bool = Field(..., description="Soft delete flag")
    modification_count: int = Field(..., description="Number of times task was modified")
    created_at: datetime = Field(..., description="Task creation timestamp")
    updated_at: datetime = Field(..., description="Task last update timestamp")
    
    model_config = ConfigDict(from_attributes=True)


class TaskListResponse(BaseModel):
    """
    Schema for task list response with pagination
    """
    tasks: list[TaskResponse] = Field(..., description="List of tasks")
    total: int = Field(..., description="Total number of tasks")
    page: int = Field(..., description="Current page number")
    size: int = Field(..., description="Number of tasks per page")


class BulkDeleteRequest(BaseModel):
    """
    Schema for bulk delete operation
    """
    task_ids: list[int] = Field(..., min_items=1, description="List of task IDs to delete")
    
    class Config:
        # Validate that all IDs are positive integers
        json_schema_extra = {
            "example": {
                "task_ids": [1, 2, 3, 4, 5]
            }
        }


class BulkDeleteResponse(BaseModel):
    """
    Schema for bulk delete response
    """
    deleted_count: int = Field(..., description="Number of tasks deleted")
    message: str = Field(..., description="Success message")


class TaskSearchRequest(BaseModel):
    """
    Schema for task search/filtering
    """
    title: Optional[str] = Field(None, description="Search by title (partial match)")
    is_completed: Optional[bool] = Field(None, description="Filter by completion status")
    page: int = Field(1, ge=1, description="Page number")
    size: int = Field(10, ge=1, le=100, description="Number of tasks per page")
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "important",
                "is_completed": False,
                "page": 1,
                "size": 10
            }
        }
