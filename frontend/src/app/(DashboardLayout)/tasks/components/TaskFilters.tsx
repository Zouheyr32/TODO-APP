/**
 * Task Filters Component
 * Advanced filtering and search for tasks
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  Chip,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useTaskSearch } from "@/hooks";

interface TaskFiltersProps {
  onClose: () => void;
}

interface FilterState {
  title: string;
  page: number;
  size: number;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onClose }) => {
  const { searchParams, performSearch, clearSearch } = useTaskSearch();
  const [filters, setFilters] = useState<FilterState>({
    title: "",
    page: 1,
    size: 10,
  });
  const [expanded, setExpanded] = useState(false);

  // Initialize filters from search params
  useEffect(() => {
    setFilters({
      title: searchParams.title || "",
      page: searchParams.page || 1,
      size: searchParams.size || 10,
    });
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange =
    (field: keyof FilterState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  // Handle search
  const handleSearch = () => {
    const searchData = { ...filters };

    // Remove empty values
    Object.keys(searchData).forEach((key) => {
      if (searchData[key as keyof typeof searchData] === "") {
        delete searchData[key as keyof typeof searchData];
      }
    });

    performSearch(searchData);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      title: "",
      page: 1,
      size: 10,
    });
    clearSearch();
  };

  // Handle quick filters
  const handleQuickFilter = (type: "all") => {
    setFilters((prev) => ({
      ...prev,
    }));
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.title) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Filters & Search</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {activeFilterCount > 0 && (
            <Chip
              label={`${activeFilterCount} active`}
              color="primary"
              size="small"
            />
          )}
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Quick Filters */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Quick Filters
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleQuickFilter("all")}
          >
            All Tasks
          </Button>
        </Box>
      </Box>

      {/* Advanced Filters */}
      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Search by title"
              value={filters.title}
              onChange={handleFilterChange("title")}
              fullWidth
              placeholder="Enter task title..."
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Page Size</InputLabel>
              <Select
                value={filters.size}
                onChange={handleFilterChange("size")}
                label="Page Size"
              >
                <MenuItem value={5}>5 per page</MenuItem>
                <MenuItem value={10}>10 per page</MenuItem>
                <MenuItem value={25}>25 per page</MenuItem>
                <MenuItem value={50}>50 per page</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Collapse>

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
        <Button
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          disabled={activeFilterCount === 0}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};

export default TaskFilters;
