"""
Pydantic schemas for metrics and analytics
"""

from pydantic import BaseModel, Field


class MetricsResponse(BaseModel):
    """
    Schema for dashboard metrics response
    """
    total_tasks: int = Field(..., description="Total number of tasks created")
    modified_tasks: int = Field(..., description="Number of tasks that have been modified")
    deleted_tasks: int = Field(..., description="Number of deleted tasks (soft deleted)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_tasks": 150,
                "modified_tasks": 38,
                "deleted_tasks": 12
            }
        }


class TaskStatsResponse(BaseModel):
    """
    Schema for detailed task statistics
    """
    total_created: int = Field(..., description="Total tasks created")
    total_modified: int = Field(..., description="Total tasks modified")
    total_deleted: int = Field(..., description="Total tasks deleted")
    average_modifications: float = Field(..., description="Average modifications per task")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_created": 200,
                "total_modified": 75,
                "total_deleted": 15,
                "average_modifications": 0.375
            }
        }
