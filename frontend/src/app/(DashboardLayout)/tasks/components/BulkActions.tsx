/**
 * Bulk Actions Component
 * Actions for multiple selected tasks
 */

"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Clear as ClearIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckIcon,
} from "@mui/icons-material";

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onBulkDelete,
  onClearSelection,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onBulkDelete();
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Alert
        severity="info"
        action={
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              label={`${selectedCount} selected`}
              color="primary"
              size="small"
            />
            <Tooltip title="Delete selected tasks">
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                size="small"
              >
                Delete
              </Button>
            </Tooltip>
            <Tooltip title="Clear selection">
              <IconButton
                size="small"
                onClick={onClearSelection}
                color="inherit"
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
        sx={{ mb: 2 }}
      >
        <Typography variant="body2">
          {selectedCount} task{selectedCount !== 1 ? "s" : ""} selected
        </Typography>
      </Alert>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteIcon color="error" />
            <Typography variant="h6">Delete Selected Tasks</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete {selectedCount} task
            {selectedCount !== 1 ? "s" : ""}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The tasks will be permanently removed.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete {selectedCount} Task{selectedCount !== 1 ? "s" : ""}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BulkActions;
