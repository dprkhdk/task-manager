import { useState, useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Task from "../components/Task";
import type { TaskProps } from "../types/types";
import {
  FormControl,
  InputLabel,
  Select,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material";
import Button from "@mui/material/Button";
import CustomizedSwitches from "../components/CustomizedSwitches";
import CreateTaskModal from "../components/CreateTaskModal";
import { getAllTasks } from "../api/task";

type BackendTask = Omit<TaskProps, "id" | "createdDate" | "dueDate"> & {
  _id: string;
  createdDate: string;
  dueDate: string | null;
};

type ApiResponse = {
  success: boolean;
  data: BackendTask[];
};

const statusOptions = [
  { value: "all", label: "All" },
  { value: "done", label: "Done" },
  { value: "in-progress", label: "In Progress" },
  { value: "not-started", label: "Not Started" },
];

function TasksPage() {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [onlyToday, setOnlyToday] = useState(false);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: unknown = await getAllTasks();

      if (
        typeof response === "object" &&
        response !== null &&
        "data" in response &&
        Array.isArray((response as ApiResponse).data)
      ) {
        const fetchedTasks = (response as ApiResponse).data;
        const transformedTasks = fetchedTasks.map((task) => ({
          ...task,
          id: task._id,
          createdDate: new Date(task.createdDate),

          dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        }));
        setTasks(transformedTasks);
      } else {
        console.error(
          "Error: Expected an API response with a data array, but received:",
          response
        );
        setError("Failed to load tasks due to unexpected data format.");
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenCreateTaskModal = () => {
    setOpenCreateTaskModal(true);
  };
  const handleCloseCreateTaskModal = () => {
    setOpenCreateTaskModal(false);
  };

  const handleToggleToday = () => {
    setOnlyToday((prev) => !prev);
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriorityFilter(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
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
  }, [tasks, filter, priorityFilter, onlyToday]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 4,
            gridColumn: "1 / -1",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>
          {error}
        </Alert>
      );
    }
    if (filteredTasks.length === 0) {
      return (
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
      );
    }
    return filteredTasks.map((task) => <Task key={task.id} {...task} />);
  };

  return (
    <Box
      sx={{
        margin: "20px auto",
        px: 2,
      }}
    >
      <CreateTaskModal
        open={openCreateTaskModal}
        onClose={handleCloseCreateTaskModal}
        onTaskCreated={fetchTasks}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
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
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <CustomizedSwitches
              checked={onlyToday}
              onChange={handleToggleToday}
              label={"Today Tasks"}
            />
            <Button
              variant="contained"
              onClick={handleOpenCreateTaskModal}
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
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}
export default TasksPage;
