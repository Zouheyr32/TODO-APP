"""
Pydantic schemas for metrics and analytics
"""

from pydantic import BaseModel, Field


class MetricsResponse(BaseModel):
    """
    Schema for dashboard metrics response
    """
    total_tasks: int = Field(..., description="Total number of tasks created")
    completed_tasks: int = Field(..., description="Number of completed tasks")
    pending_tasks: int = Field(..., description="Number of pending tasks")
    deleted_tasks: int = Field(..., description="Number of deleted tasks (soft deleted)")
    modified_tasks: int = Field(..., description="Number of tasks that have been modified")
    completion_rate: float = Field(..., description="Task completion rate as percentage")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_tasks": 150,
                "completed_tasks": 45,
                "pending_tasks": 105,
                "deleted_tasks": 12,
                "modified_tasks": 38,
                "completion_rate": 30.0
            }
        }


class TaskStatsResponse(BaseModel):
    """
    Schema for detailed task statistics
    """
    total_created: int = Field(..., description="Total tasks created")
    total_completed: int = Field(..., description="Total tasks completed")
    total_deleted: int = Field(..., description="Total tasks deleted")
    total_modified: int = Field(..., description="Total tasks modified")
    average_modifications: float = Field(..., description="Average modifications per task")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_created": 200,
                "total_completed": 60,
                "total_deleted": 15,
                "total_modified": 75,
                "average_modifications": 0.375
            }
        }
