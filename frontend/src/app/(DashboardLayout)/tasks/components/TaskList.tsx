/**
 * Task List Component
 * Displays tasks in a table format with selection and actions
 */

"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Chip,
  Typography,
  Box,
  CircularProgress,
  TablePagination,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Task } from "@/store/slices/tasksSlice";
import { format } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  selectedTasks: number[];
  onTaskSelect: (taskId: number) => void;
  onSelectAll: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  pagination: {
    page: number;
    size: number;
  };
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  selectedTasks,
  onTaskSelect,
  onSelectAll,
  onEditTask,
  onDeleteTask,
  isAllSelected,
  isPartiallySelected,
  pagination,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  // Handle row selection
  const handleSelectTask = (taskId: number) => {
    onTaskSelect(taskId);
  };

  // Handle select all
  const handleSelectAll = () => {
    onSelectAll();
  };

  // Handle edit task
  const handleEditTask = (task: Task) => {
    onEditTask(task);
  };

  // Handle delete task
  const handleDeleteTask = (taskId: number) => {
    if (globalThis.confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(taskId);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first task to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={isPartiallySelected}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Modified</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                hover
                selected={selectedTasks.includes(task.id)}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleSelectTask(task.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {task.title}
                    </Typography>
                    {task.modification_count > 0 && (
                      <Chip
                        label={`${task.modification_count} edits`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.description || "No description"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(task.updated_at)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(task.created_at)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit task">
                      <IconButton
                        size="small"
                        onClick={() => handleEditTask(task)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete task">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTask(task.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total}
        page={pagination.page - 1}
        onPageChange={(_, page) => onPageChange(page + 1)}
        rowsPerPage={pagination.size}
        onRowsPerPageChange={(event) =>
          onPageSizeChange(Number.parseInt(event.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count}`
        }
      />
    </Box>
  );
};

export default TaskList;
