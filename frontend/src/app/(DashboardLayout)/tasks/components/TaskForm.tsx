/**
 * Task Form Component
 * Modal form for creating and editing tasks
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { Task } from "@/store/slices/tasksSlice";

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (taskData: any) => void;
  onClose: () => void;
  open: boolean;
}

interface FormData {
  title: string;
  description: string;
  is_completed: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onClose,
  open,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    is_completed: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        is_completed: task.is_completed,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        is_completed: false,
      });
    }
    setErrors({});
  }, [task]);

  // Handle input changes
  const handleChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "is_completed" ? event.target.checked : event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 255) {
      newErrors.title = "Title must be less than 255 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const isEditing = !!task;
  const title = isEditing ? "Edit Task" : "Create New Task";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: 400 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {/* Title Field */}
            <TextField
              label="Task Title"
              value={formData.title}
              onChange={handleChange("title")}
              error={!!errors.title}
              helperText={errors.title}
              required
              fullWidth
              disabled={loading}
              placeholder="Enter task title..."
            />

            {/* Description Field */}
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange("description")}
              error={!!errors.description}
              helperText={
                errors.description || "Optional description for the task"
              }
              fullWidth
              multiline
              rows={4}
              disabled={loading}
              placeholder="Enter task description..."
            />

            {/* Completion Status */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_completed}
                  onChange={handleChange("is_completed")}
                  disabled={loading}
                />
              }
              label="Mark as completed"
            />

            {/* Show additional info for editing */}
            {isEditing && task && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Task Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(task.created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Modified:{" "}
                  {new Date(task.updated_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modifications: {task.modification_count}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
