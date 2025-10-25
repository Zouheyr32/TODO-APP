"""
Metrics service layer for dashboard analytics and statistics
"""

from typing import Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models.task import Task
from app.schemas.metrics import MetricsResponse, TaskStatsResponse


class MetricsService:
    """
    Service class for metrics and analytics business logic
    """
    
    def __init__(self, db: Session):
        """
        Initialize MetricsService with database session
        
        Args:
            db: SQLAlchemy database session
        """
        self.db = db
    
    def get_metrics(self) -> MetricsResponse:
        """
        Get comprehensive dashboard metrics
        
        Returns:
            MetricsResponse with all dashboard statistics
        """
        # Get basic counts
        total_tasks = self.db.query(Task).filter(Task.is_deleted == False).count()
        deleted_tasks = self.db.query(Task).filter(Task.is_deleted == True).count()
        modified_tasks = self.db.query(Task).filter(
            and_(Task.is_deleted == False, Task.modification_count > 0)
        ).count()
        
        return MetricsResponse(
            total_tasks=total_tasks,
            modified_tasks=modified_tasks,
            deleted_tasks=deleted_tasks
        )
    
    def get_task_stats(self) -> TaskStatsResponse:
        """
        Get detailed task statistics
        
        Returns:
            TaskStatsResponse with detailed statistics
        """
        # Get total counts
        total_created = self.db.query(Task).count()
        total_deleted = self.db.query(Task).filter(Task.is_deleted == True).count()
        
        # Get total modifications across all tasks
        total_modifications_result = self.db.query(func.sum(Task.modification_count)).scalar()
        total_modifications = total_modifications_result if total_modifications_result else 0
        
        # Calculate average modifications per task
        average_modifications = (total_modifications / total_created) if total_created > 0 else 0.0
        
        return TaskStatsResponse(
            total_created=total_created,
            total_modified=total_modifications,
            total_deleted=total_deleted,
            average_modifications=round(average_modifications, 3)
        )
    
    def get_completion_trends(self, days: int = 30) -> Dict[str, Any]:
        """
        Get task completion trends over time
        
        Args:
            days: Number of days to analyze (default: 30)
            
        Returns:
            Dictionary with completion trends data
        """
        # This would require additional date filtering logic
        # For now, return basic structure
        return {
            "period_days": days,
            "tasks_created": 0,  # Would be calculated with date filters
            "tasks_completed": 0,  # Would be calculated with date filters
            "completion_rate": 0.0  # Would be calculated
        }
    
    def get_most_modified_tasks(self, limit: int = 10) -> Dict[str, Any]:
        """
        Get tasks with highest modification counts
        
        Args:
            limit: Maximum number of tasks to return
            
        Returns:
            Dictionary with most modified tasks data
        """
        most_modified = self.db.query(Task).filter(
            and_(
                Task.is_deleted == False,
                Task.modification_count > 0
            )
        ).order_by(Task.modification_count.desc()).limit(limit).all()
        
        return {
            "tasks": [
                {
                    "id": task.id,
                    "title": task.title,
                    "modification_count": task.modification_count,
                    "is_completed": task.is_completed
                }
                for task in most_modified
            ],
            "count": len(most_modified)
        }
    
    def get_productivity_metrics(self) -> Dict[str, Any]:
        """
        Get productivity-related metrics
        
        Returns:
            Dictionary with productivity metrics
        """
        # Get tasks created today (would need date filtering in real implementation)
        # For now, return basic structure
        return {
            "tasks_created_today": 0,
            "tasks_completed_today": 0,
            "average_task_lifetime": 0.0,  # Average time from creation to completion
            "most_active_hour": "14:00"  # Hour with most task activity
        }
    
    def get_category_breakdown(self) -> Dict[str, Any]:
        """
        Get task breakdown by categories (if implemented)
        
        Returns:
            Dictionary with category breakdown
        """
        # This would be implemented if we add categories to tasks
        return {
            "categories": {},
            "uncategorized_count": 0
        }
