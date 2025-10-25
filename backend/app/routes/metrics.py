"""
API routes for metrics and analytics
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.metrics_service import MetricsService
from app.schemas.metrics import MetricsResponse, TaskStatsResponse
from app.schemas.common import ErrorResponse

# Create router instance
router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/", response_model=MetricsResponse, summary="Get dashboard metrics")
async def get_metrics(db: Session = Depends(get_db)):
    """
    Get comprehensive dashboard metrics including:
    
    - **total_tasks**: Total number of active tasks
    - **modified_tasks**: Number of tasks that have been modified
    - **deleted_tasks**: Number of soft-deleted tasks
    """
    metrics_service = MetricsService(db)
    metrics = metrics_service.get_metrics()
    return metrics


@router.get("/stats", response_model=TaskStatsResponse, summary="Get detailed task statistics")
async def get_task_stats(db: Session = Depends(get_db)):
    """
    Get detailed task statistics including:
    
    - **total_created**: Total number of tasks ever created
    - **total_deleted**: Total number of deleted tasks
    - **total_modified**: Total number of modifications across all tasks
    - **average_modifications**: Average modifications per task
    """
    metrics_service = MetricsService(db)
    stats = metrics_service.get_task_stats()
    return stats


@router.get("/trends", summary="Get task completion trends")
async def get_completion_trends(
    days: int = 30,
    db: Session = Depends(get_db)
):
    """
    Get task completion trends over time
    
    - **days**: Number of days to analyze (default: 30)
    """
    metrics_service = MetricsService(db)
    trends = metrics_service.get_completion_trends(days)
    return trends


@router.get("/most-modified", summary="Get most modified tasks")
async def get_most_modified_tasks(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get tasks with the highest modification counts
    
    - **limit**: Maximum number of tasks to return (default: 10)
    """
    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100"
        )
    
    metrics_service = MetricsService(db)
    most_modified = metrics_service.get_most_modified_tasks(limit)
    return most_modified


@router.get("/productivity", summary="Get productivity metrics")
async def get_productivity_metrics(db: Session = Depends(get_db)):
    """
    Get productivity-related metrics including:
    
    - **tasks_created_today**: Number of tasks created today
    - **average_task_lifetime**: Average time from creation to completion
    - **most_active_hour**: Hour with most task activity
    """
    metrics_service = MetricsService(db)
    productivity = metrics_service.get_productivity_metrics()
    return productivity


@router.get("/categories", summary="Get task category breakdown")
async def get_category_breakdown(db: Session = Depends(get_db)):
    """
    Get task breakdown by categories (if categories are implemented)
    
    Returns category distribution and uncategorized task count
    """
    metrics_service = MetricsService(db)
    categories = metrics_service.get_category_breakdown()
    return categories


@router.get("/health", summary="Get metrics service health")
async def get_metrics_health(db: Session = Depends(get_db)):
    """
    Check the health of the metrics service
    
    Returns basic service status and connection information
    """
    try:
        metrics_service = MetricsService(db)
        # Test basic functionality
        basic_metrics = metrics_service.get_metrics()
        
        return {
            "status": "healthy",
            "message": "Metrics service is operational",
            "basic_metrics_available": True,
            "total_tasks": basic_metrics.total_tasks
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Metrics service is unavailable: {str(e)}"
        )
