import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Snackbar,
  type SelectChangeEvent,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import type { TaskProps } from "../types/types";
import {
  getTaskById,
  updateTask,
  addCommentToTask,
  deleteTask,
} from "../api/task";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";

type BackendTask = Omit<TaskProps, "id" | "createdDate" | "dueDate"> & {
  _id: string;
  createdDate: string;
  dueDate: string | null;
  comments: string[];
};

function SingleTaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [status, setStatus] = useState<TaskProps["status"]>("not-started");
  const [priority, setPriority] = useState<TaskProps["priority"]>("Medium");
  const [dueDate, setDueDate] = useState<Date>(new Date());

  const [newComment, setNewComment] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const fetchTask = useCallback(async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const result = await getTaskById(taskId);
      const backendTask = result.data as BackendTask;

      const transformedTask: TaskProps = {
        ...backendTask,
        id: backendTask._id,
        createdDate: new Date(backendTask.createdDate),
        dueDate: backendTask.dueDate
          ? new Date(backendTask.dueDate)
          : new Date(),
        comments: backendTask.comments || [],
      };

      setTask(transformedTask);
      setStatus(transformedTask.status);
      setPriority(transformedTask.priority);
      setDueDate(transformedTask.dueDate);
    } catch (err) {
      setError("Failed to fetch task details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleSaveChanges = async () => {
    if (!task) return;
    const updatedData: TaskProps = { ...task, status, priority, dueDate };

    try {
      await updateTask(task.id, updatedData);
      setSnackbar({
        open: true,
        message: "Task updated successfully!",
        severity: "success",
      });
      setIsEditing(false);
      fetchTask();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update task.",
        severity: "error",
      });
      console.error("Failed to update task:", err);
    }
  };

  const handleCancelEdit = () => {
    if (task) {
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate);
    }
    setIsEditing(false);
  };

  const handleAddComment = async () => {
    if (!taskId || !newComment.trim()) return;
    try {
      await addCommentToTask(taskId, newComment);
      setNewComment("");
      setSnackbar({
        open: true,
        message: "Comment added!",
        severity: "success",
      });
      fetchTask();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to add comment.",
        severity: "error",
      });
      console.error("Failed to add comment:", err);
    }
  };

  const handleDelete = async () => {
    if (!taskId) return;
    try {
      await deleteTask(taskId);
      navigate("/tasks");
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete task.",
        severity: "error",
      });
      console.error("Failed to delete task:", err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !task) {
    return <Alert severity="error">{error || "Task not found."}</Alert>;
  }
  const formatStatus = (status: TaskProps["status"]) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !task) {
    return <Alert severity="error">{error || "Task not found."}</Alert>;
  }

  return (
    <>
      <Box sx={{ p: 3, width: "100%" }}>
        <Button onClick={() => navigate("/tasks")} sx={{ mb: 2 }}>
          &larr; Back to Tasks
        </Button>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ wordBreak: "break-word" }}
            >
              {task.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveChanges}
                    sx={{
                      color: "#fff",
                      backgroundColor: "primary.contrastText",
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "primary.contrastText",
                    }}
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <IconButton
                color="error"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1, whiteSpace: "pre-wrap" }}
          >
            {task.description}
          </Typography>
          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            {isEditing ? (
              <Stack spacing={2.5} sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2.5,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      label="Status"
                      onChange={(e: SelectChangeEvent<TaskProps["status"]>) =>
                        setStatus(e.target.value as TaskProps["status"])
                      }
                    >
                      <MenuItem value="not-started">Not Started</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="done">Done</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priority}
                      label="Priority"
                      onChange={(e: SelectChangeEvent<TaskProps["priority"]>) =>
                        setPriority(e.target.value as TaskProps["priority"])
                      }
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due Date"
                    value={dayjs(dueDate)}
                    onChange={(newValue) =>
                      setDueDate(newValue ? newValue.toDate() : new Date())
                    }
                    format="DD MMM YYYY"
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Stack>
            ) : (
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Typography>
                  <strong>Status:</strong> {formatStatus(task.status)}
                </Typography>
                <Typography>
                  <strong>Priority:</strong> {task.priority}
                </Typography>
                <Typography>
                  <strong>Due Date:</strong>{" "}
                  {dayjs(task.dueDate).format("DD MMMM YYYY")}
                </Typography>
                <Typography>
                  <strong>Created:</strong>{" "}
                  {dayjs(task.createdDate).format("DD MMMM YYYY")}
                </Typography>
              </Stack>
            )}
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          <Paper
            variant="outlined"
            sx={{ p: 2, mt: 2, mb: 2, height: 300, overflow: "auto" }}
          >
            {task.comments && task.comments.length > 0 ? (
              <Stack spacing={2}>
                {task.comments.map((comment, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: "action.hover",
                        borderRadius: "10px",
                        maxWidth: "85%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                      >
                        {comment}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                  minHeight: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary">
                  No comments yet. Be the first to comment!
                </Typography>
              </Box>
            )}
          </Paper>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Write a comment..."
              multiline
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SingleTaskPage;
