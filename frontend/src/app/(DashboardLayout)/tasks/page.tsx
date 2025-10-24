/**
 * Tasks Page
 * Main page for task management with CRUD operations
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckIcon,
} from "@mui/icons-material";
import { useTasks, useTaskSelection } from "@/hooks";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import BulkActions from "./components/BulkActions";
import { Task } from "@/store/slices/tasksSlice";

const TasksPage: React.FC = () => {
  const {
    tasks,
    selectedTasks,
    loading,
    error,
    total,
    pagination,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    removeMultipleTasks,
    clearErrorAction,
    updatePagination,
  } = useTasks();

  const {
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
    isPartiallySelected,
  } = useTaskSelection();

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle task creation
  const handleCreateTask = async (taskData: any) => {
    try {
      await addTask(taskData);
      setShowForm(false);
      setSnackbar({
        open: true,
        message: "Task created successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create task",
        severity: "error",
      });
    }
  };

  // Handle task editing
  const handleEditTask = async (taskData: any) => {
    try {
      if (editingTask) {
        await editTask(editingTask.id, taskData);
        setEditingTask(null);
        setSnackbar({
          open: true,
          message: "Task updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update task",
        severity: "error",
      });
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: number) => {
    try {
      await removeTask(taskId);
      setSnackbar({
        open: true,
        message: "Task deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete task",
        severity: "error",
      });
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    try {
      await removeMultipleTasks(selectedTasks);
      clearSelection();
      setSnackbar({
        open: true,
        message: `${selectedTasks.length} tasks deleted successfully!`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete tasks",
        severity: "error",
      });
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadTasks();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    updatePagination(page, pagination.size);
    loadTasks({ skip: (page - 1) * pagination.size, limit: pagination.size });
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    updatePagination(1, size);
    loadTasks({ skip: 0, limit: size });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <Box>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Tasks Management
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowForm(true)}
              >
                Add Task
              </Button>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Chip
              label={`Total: ${total}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Completed: ${tasks.filter((t) => t.is_completed).length}`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`Pending: ${tasks.filter((t) => !t.is_completed).length}`}
              color="warning"
              variant="outlined"
            />
            {selectedTasks.length > 0 && (
              <Chip
                label={`Selected: ${selectedTasks.length}`}
                color="secondary"
                variant="filled"
              />
            )}
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={clearErrorAction}
              >
                ×
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Filters */}
        {showFilters && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <TaskFilters onClose={() => setShowFilters(false)} />
            </CardContent>
          </Card>
        )}

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <BulkActions
            selectedCount={selectedTasks.length}
            onBulkDelete={handleBulkDelete}
            onClearSelection={clearSelection}
          />
        )}

        {/* Task List */}
        <Card>
          <CardContent>
            <TaskList
              tasks={tasks}
              loading={loading}
              selectedTasks={selectedTasks}
              onTaskSelect={toggleSelection}
              onSelectAll={selectAll}
              onEditTask={setEditingTask}
              onDeleteTask={handleDeleteTask}
              isAllSelected={isAllSelected()}
              isPartiallySelected={isPartiallySelected()}
              pagination={pagination}
              total={total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardContent>
        </Card>

        {/* Task Form Modal */}
        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleEditTask : handleCreateTask}
            onClose={handleCloseForm}
            open={showForm || !!editingTask}
          />
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
        />
      </Container>
    </Box>
  );
};

export default TasksPage;
