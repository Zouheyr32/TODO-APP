"""
API routes for task operations
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.task_service import TaskService
from app.schemas.task import (
    TaskCreate, TaskUpdate, TaskResponse, TaskListResponse,
    BulkDeleteRequest, BulkDeleteResponse, TaskSearchRequest
)
from app.schemas.common import ErrorResponse

# Create router instance
router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=TaskListResponse, summary="Get all tasks")
async def get_tasks(
    skip: int = Query(0, ge=0, description="Number of tasks to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of tasks to return"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all active tasks with pagination
    
    - **skip**: Number of tasks to skip (for pagination)
    - **limit**: Maximum number of tasks to return (1-1000)
    """
    task_service = TaskService(db)
    tasks = task_service.get_all_tasks(skip=skip, limit=limit)
    total = task_service.get_tasks_count()
    
    return TaskListResponse(
        tasks=tasks,
        total=total,
        page=(skip // limit) + 1,
        size=limit
    )


@router.get("/search", response_model=TaskListResponse, summary="Search tasks")
async def search_tasks(
    search_params: TaskSearchRequest = Depends(),
    db: Session = Depends(get_db)
):
    """
    Search and filter tasks with advanced criteria
    
    - **title**: Search by task title (partial match)
    - **is_completed**: Filter by completion status
    - **page**: Page number (starts from 1)
    - **size**: Number of tasks per page (1-100)
    """
    task_service = TaskService(db)
    tasks, total = task_service.search_tasks(search_params)
    
    return TaskListResponse(
        tasks=tasks,
        total=total,
        page=search_params.page,
        size=search_params.size
    )


@router.get("/{task_id}", response_model=TaskResponse, summary="Get task by ID")
async def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific task by ID
    
    - **task_id**: The ID of the task to retrieve
    """
    task_service = TaskService(db)
    task = task_service.get_active_task_by_id(task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    
    return task


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, summary="Create new task")
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new task
    
    - **title**: Task title (required, 1-255 characters)
    - **description**: Task description (optional)
    - **is_completed**: Completion status (default: false)
    """
    task_service = TaskService(db)
    task = task_service.create_task(task_data)
    return task


@router.put("/{task_id}", response_model=TaskResponse, summary="Update task")
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing task
    
    - **task_id**: The ID of the task to update
    - **title**: New task title (optional)
    - **description**: New task description (optional)
    - **is_completed**: New completion status (optional)
    
    Note: This operation will increment the modification count
    """
    task_service = TaskService(db)
    task = task_service.update_task(task_id, task_data)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )
    
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete task")
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """
    Soft delete a task (set is_deleted to True)
    
    - **task_id**: The ID of the task to delete
    
    Note: This is a soft delete - the task will be marked as deleted but not removed from the database
    """
    task_service = TaskService(db)
    success = task_service.delete_task(task_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found"
        )


@router.delete("/bulk", response_model=BulkDeleteResponse, summary="Bulk delete tasks")
async def bulk_delete_tasks(
    delete_request: BulkDeleteRequest,
    db: Session = Depends(get_db)
):
    """
    Soft delete multiple tasks at once
    
    - **task_ids**: List of task IDs to delete
    
    Returns the number of tasks successfully deleted
    """
    task_service = TaskService(db)
    deleted_count = task_service.bulk_delete_tasks(delete_request.task_ids)
    
    return BulkDeleteResponse(
        deleted_count=deleted_count,
        message=f"Successfully deleted {deleted_count} task(s)"
    )


@router.get("/completed/list", response_model=List[TaskResponse], summary="Get completed tasks")
async def get_completed_tasks(
    skip: int = Query(0, ge=0, description="Number of tasks to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of tasks to return"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all completed tasks
    
    - **skip**: Number of tasks to skip (for pagination)
    - **limit**: Maximum number of tasks to return (1-1000)
    """
    task_service = TaskService(db)
    tasks = task_service.get_tasks_by_completion_status(is_completed=True, skip=skip, limit=limit)
    return tasks


@router.get("/pending/list", response_model=List[TaskResponse], summary="Get pending tasks")
async def get_pending_tasks(
    skip: int = Query(0, ge=0, description="Number of tasks to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of tasks to return"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all pending (incomplete) tasks
    
    - **skip**: Number of tasks to skip (for pagination)
    - **limit**: Maximum number of tasks to return (1-1000)
    """
    task_service = TaskService(db)
    tasks = task_service.get_tasks_by_completion_status(is_completed=False, skip=skip, limit=limit)
    return tasks


@router.post("/{task_id}/restore", response_model=TaskResponse, summary="Restore deleted task")
async def restore_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """
    Restore a soft-deleted task
    
    - **task_id**: The ID of the task to restore
    """
    task_service = TaskService(db)
    success = task_service.restore_task(task_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deleted task with ID {task_id} not found"
        )
    
    # Return the restored task
    task = task_service.get_active_task_by_id(task_id)
    return task
