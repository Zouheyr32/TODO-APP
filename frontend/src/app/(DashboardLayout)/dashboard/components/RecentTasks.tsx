/**
 * Recent Tasks Component
 * Display recent tasks in a list format
 */

"use client";

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { useTasks } from "@/hooks";
import { format } from "date-fns";

const RecentTasks: React.FC = () => {
  const { tasks, loading, error, loadTasks } = useTasks();

  useEffect(() => {
    loadTasks({ skip: 0, limit: 5 });
  }, [loadTasks]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load recent tasks. Please try again.
      </Alert>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create your first task to get started
        </Typography>
        <Button variant="contained" href="/tasks">
          Create Task
        </Button>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const getStatusIcon = (isCompleted: boolean) => {
    return isCompleted ? (
      <CheckIcon color="success" />
    ) : (
      <UncheckIcon color="warning" />
    );
  };

  const getStatusChip = (isCompleted: boolean) => {
    return (
      <Chip
        label={isCompleted ? "Completed" : "Pending"}
        color={isCompleted ? "success" : "warning"}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Recent Tasks ({tasks.length})</Typography>
        <Button variant="outlined" size="small" href="/tasks">
          View All
        </Button>
      </Box>

      <Paper variant="outlined">
        <List sx={{ p: 0 }}>
          {tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              <ListItem
                sx={{
                  py: 2,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon>{getStatusIcon(task.is_completed)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "medium",
                          textDecoration: task.is_completed
                            ? "line-through"
                            : "none",
                          color: task.is_completed
                            ? "text.secondary"
                            : "text.primary",
                        }}
                      >
                        {task.title}
                      </Typography>
                      {getStatusChip(task.is_completed)}
                    </Box>
                  }
                  secondary={
                    <Box>
                      {task.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {task.description}
                        </Typography>
                      )}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <TimeIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(task.updated_at)}
                          </Typography>
                        </Box>
                        {task.modification_count > 0 && (
                          <Chip
                            label={`${task.modification_count} edits`}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    href={`/tasks?edit=${task.id}`}
                    sx={{ minWidth: "auto" }}
                  >
                    Edit
                  </Button>
                </Box>
              </ListItem>
              {index < tasks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {tasks.length >= 5 && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="outlined" href="/tasks">
            View All Tasks
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RecentTasks;
