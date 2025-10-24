"""
Common Pydantic schemas used across the application
"""

from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """
    Schema for error responses
    """
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    status_code: int = Field(..., description="HTTP status code")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Task not found",
                "detail": "Task with ID 123 does not exist",
                "status_code": 404
            }
        }


class SuccessResponse(BaseModel):
    """
    Schema for success responses
    """
    message: str = Field(..., description="Success message")
    data: Optional[Dict[str, Any]] = Field(None, description="Response data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Task created successfully",
                "data": {
                    "id": 1,
                    "title": "New Task"
                }
            }
        }


class HealthCheckResponse(BaseModel):
    """
    Schema for health check endpoint
    """
    status: str = Field(..., description="Service status")
    message: str = Field(..., description="Status message")
    timestamp: str = Field(..., description="Current timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "message": "API is operational",
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }
