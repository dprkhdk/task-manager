import { useState } from "react";

import Box from "@mui/material/Box";
import Task from "../components/Task";
import type { TaskProps } from "../types/types";
import { FormControl, InputLabel, Select, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material";
import Button from "@mui/material/Button";
import CustomizedSwitches from "../components/CustomizedSwitches";

const tasks: TaskProps[] = [
  {
    id: "1",
    name: "Sample Task",
    description: "This is a sample task description.",
    createdDate: new Date(),
    dueDate: new Date("2023-07-02"),
    priority: "High",
    status: "done",
    comments: ["Comment 1", "Comment 2"],
    tags: ["Tag1", "Tag2"],
  },
  {
    id: "4",
    name: "Another Task",
    description: "This is another task description.",
    createdDate: new Date(),
    dueDate: new Date("2023-07-03"),
    priority: "Medium",
    status: "in-progress",
    comments: ["Comment 3"],
    tags: ["Tag3"],
  },
  {
    id: "2",
    name: "Another Task",
    description: "This is another task description.",
    createdDate: new Date(),
    dueDate: new Date("2023-07-03"),
    priority: "Medium",
    status: "in-progress",
    comments: ["Comment 3"],
    tags: ["Tag3"],
  },
  {
    id: "3",
    name: "Another Task",
    description: "This is another task description.",
    createdDate: new Date(),
    dueDate: new Date("2025-07-01"),
    priority: "Medium",
    status: "in-progress",
    comments: ["Comment 3"],
    tags: ["Tag3"],
  },
  {
    id: "10",
    name: "Another Task",
    description: "This is another task description.",
    createdDate: new Date(),
    dueDate: new Date("2023-07-03"),
    priority: "Low",
    status: "not-started",
    comments: ["Comment 3"],
    tags: ["Tag3"],
  },
];
const statusOptions = [
  { value: "all", label: "All" },
  { value: "done", label: "Done" },
  { value: "in-progress", label: "In Progress" },
  { value: "not-started", label: "Not Started" },
];

function TasksPage() {
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [onlyToday, setOnlyToday] = useState(false);

  const handleToggleToday = () => {
    setOnlyToday((prev) => !prev);
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriorityFilter(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchesStatus = filter === "all" || task.status === filter;
    const matchesPriority =
      priorityFilter === "all" ||
      task.priority.toLowerCase() === priorityFilter;
    const matchesDate =
      !onlyToday || task.dueDate.toDateString() === today.toDateString();

    return matchesStatus && matchesPriority && matchesDate;
  });

  return (
    <Box
      sx={{
        margin: "20px auto",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          width: {
            xs: "auto",
            sm: "auto",
            md: "auto",
            lg: "auto",
            xl: 1400,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel id="filter-status-label">Filter by Status</InputLabel>
              <Select
                labelId="filter-status-label"
                id="filter-select-status"
                value={filter}
                label="Filter by Status"
                onChange={handleFilterChange}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel id="filter-priority-label">
                Filter by Priority
              </InputLabel>
              <Select
                labelId="filter-priority-label"
                id="filter-select-priority"
                value={priorityFilter}
                label="Filter by Priority"
                onChange={handlePriorityChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <CustomizedSwitches
              checked={onlyToday}
              onChange={handleToggleToday}
              label={"Today Tasks"}
            />
            <Button
              variant="contained"
              onClick={() => console.log("Create Task clicked")}
              sx={{
                height: "56px",
                backgroundColor: "primary.contrastText",
                color: "background.paper",
                width: "auto",
              }}
            >
              Create Task
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(1, 1fr)",
            md: "repeat(1, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {filteredTasks.length === 0 ? (
          <Box
            sx={{
              gridColumn: "1 / -1",
              textAlign: "center",
              py: 4,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No tasks found
            </Typography>
          </Box>
        ) : (
          filteredTasks.map((task) => <Task key={task.id} {...task} />)
        )}
      </Box>
    </Box>
  );
}
export default TasksPage;
