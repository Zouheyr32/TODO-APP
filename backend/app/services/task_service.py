"""
Task service layer containing all business logic for task operations
"""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskSearchRequest


class TaskService:
    """
    Service class for task-related business logic
    """
    
    def __init__(self, db: Session):
        """
        Initialize TaskService with database session
        
        Args:
            db: SQLAlchemy database session
        """
        self.db = db
    
    def get_all_tasks(self, skip: int = 0, limit: int = 100) -> List[Task]:
        """
        Retrieve all non-deleted tasks with pagination
        
        Args:
            skip: Number of records to skip for pagination
            limit: Maximum number of records to return
            
        Returns:
            List of Task objects that are not deleted
        """
        return self.db.query(Task).filter(
            Task.is_deleted == False
        ).offset(skip).limit(limit).all()
    
    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Retrieve a specific task by ID (including soft-deleted tasks)
        
        Args:
            task_id: The ID of the task to retrieve
            
        Returns:
            Task object if found, None otherwise
        """
        return self.db.query(Task).filter(Task.id == task_id).first()
    
    def get_active_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Retrieve a specific active (non-deleted) task by ID
        
        Args:
            task_id: The ID of the task to retrieve
            
        Returns:
            Active Task object if found, None otherwise
        """
        return self.db.query(Task).filter(
            and_(Task.id == task_id, Task.is_deleted == False)
        ).first()
    
    def create_task(self, task_data: TaskCreate) -> Task:
        """
        Create a new task
        
        Args:
            task_data: TaskCreate schema with task information
            
        Returns:
            Created Task object
        """
        db_task = Task(
            title=task_data.title,
            description=task_data.description,
            is_completed=task_data.is_completed
        )
        self.db.add(db_task)
        self.db.commit()
        self.db.refresh(db_task)
        return db_task
    
    def update_task(self, task_id: int, task_data: TaskUpdate) -> Optional[Task]:
        """
        Update an existing task and increment modification count
        
        Args:
            task_id: The ID of the task to update
            task_data: TaskUpdate schema with updated information
            
        Returns:
            Updated Task object if found, None otherwise
        """
        db_task = self.get_active_task_by_id(task_id)
        if not db_task:
            return None
        
        # Update fields if provided
        update_data = task_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)
        
        # Increment modification count
        db_task.modification_count += 1
        
        self.db.commit()
        self.db.refresh(db_task)
        return db_task
    
    def delete_task(self, task_id: int) -> bool:
        """
        Soft delete a task (set is_deleted to True)
        
        Args:
            task_id: The ID of the task to delete
            
        Returns:
            True if task was deleted, False if not found
        """
        db_task = self.get_active_task_by_id(task_id)
        if not db_task:
            return False
        
        db_task.is_deleted = True
        self.db.commit()
        return True
    
    def bulk_delete_tasks(self, task_ids: List[int]) -> int:
        """
        Soft delete multiple tasks
        
        Args:
            task_ids: List of task IDs to delete
            
        Returns:
            Number of tasks successfully deleted
        """
        deleted_count = self.db.query(Task).filter(
            and_(
                Task.id.in_(task_ids),
                Task.is_deleted == False
            )
        ).update(
            {Task.is_deleted: True},
            synchronize_session=False
        )
        self.db.commit()
        return deleted_count
    
    def search_tasks(self, search_params: TaskSearchRequest) -> Tuple[List[Task], int]:
        """
        Search and filter tasks with pagination
        
        Args:
            search_params: TaskSearchRequest with search criteria
            
        Returns:
            Tuple of (filtered tasks list, total count)
        """
        query = self.db.query(Task).filter(Task.is_deleted == False)
        
        # Apply filters
        if search_params.title:
            query = query.filter(Task.title.ilike(f"%{search_params.title}%"))
        
        if search_params.is_completed is not None:
            query = query.filter(Task.is_completed == search_params.is_completed)
        
        # Get total count before pagination
        total = query.count()
        
        # Apply pagination
        tasks = query.offset((search_params.page - 1) * search_params.size).limit(search_params.size).all()
        
        return tasks, total
    
    def get_tasks_count(self) -> int:
        """
        Get total count of non-deleted tasks
        
        Returns:
            Total number of active tasks
        """
        return self.db.query(Task).filter(Task.is_deleted == False).count()
    
    def get_completed_tasks_count(self) -> int:
        """
        Get count of completed tasks
        
        Returns:
            Number of completed tasks
        """
        return self.db.query(Task).filter(
            and_(Task.is_deleted == False, Task.is_completed == True)
        ).count()
    
    def get_pending_tasks_count(self) -> int:
        """
        Get count of pending (incomplete) tasks
        
        Returns:
            Number of pending tasks
        """
        return self.db.query(Task).filter(
            and_(Task.is_deleted == False, Task.is_completed == False)
        ).count()
    
    def get_deleted_tasks_count(self) -> int:
        """
        Get count of soft-deleted tasks
        
        Returns:
            Number of deleted tasks
        """
        return self.db.query(Task).filter(Task.is_deleted == True).count()
    
    def get_modified_tasks_count(self) -> int:
        """
        Get count of tasks that have been modified (modification_count > 0)
        
        Returns:
            Number of modified tasks
        """
        return self.db.query(Task).filter(
            and_(Task.is_deleted == False, Task.modification_count > 0)
        ).count()
    
    def restore_task(self, task_id: int) -> bool:
        """
        Restore a soft-deleted task
        
        Args:
            task_id: The ID of the task to restore
            
        Returns:
            True if task was restored, False if not found
        """
        db_task = self.db.query(Task).filter(
            and_(Task.id == task_id, Task.is_deleted == True)
        ).first()
        
        if not db_task:
            return False
        
        db_task.is_deleted = False
        self.db.commit()
        return True
    
    def get_tasks_by_completion_status(self, is_completed: bool, skip: int = 0, limit: int = 100) -> List[Task]:
        """
        Get tasks filtered by completion status
        
        Args:
            is_completed: Filter by completion status
            skip: Number of records to skip for pagination
            limit: Maximum number of records to return
            
        Returns:
            List of tasks matching the completion status
        """
        return self.db.query(Task).filter(
            and_(
                Task.is_deleted == False,
                Task.is_completed == is_completed
            )
        ).offset(skip).limit(limit).all()
