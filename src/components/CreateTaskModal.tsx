import {
  Box,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import type { TaskProps } from "../types/types";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { createTask } from "../api/task";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 5,
};

const initialFormState: Omit<TaskProps, "id" | "createdDate"> = {
  name: "",
  projectId: "Personal",
  description: "",
  dueDate: new Date(),
  priority: "Medium",
  status: "not-started",
  comments: [],
  tags: [],
};

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

function CreateTaskModal({
  open,
  onClose,
  onTaskCreated,
}: CreateTaskModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Task name is required";
    if (!form.projectId) newErrors.projectId = "Project is required";
    if (!form.dueDate) newErrors.dueDate = "Due date is required";
    if (!form.priority) newErrors.priority = "Priority is required";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalClose = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };

  const handleAlertClose = (
      _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await createTask(form);
      onTaskCreated();
      handleModalClose();
      setAlert({ type: "success", message: "Task successfully created!" });
    } catch (error) {
      console.error("Failed to create task:", error);
      setAlert({ type: "error", message: "Failed to create task." });
    }
  };

  return (
    <>
      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {alert ? (
          <Alert
            onClose={handleAlertClose}
            severity={alert.type}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {alert.message}
          </Alert>
        ) : undefined}
      </Snackbar>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableScrollLock={true}
      >
        <Box sx={style}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "primary.main", mb: 2 }}
          >
            Create New Task
          </Typography>
          <Button
            onClick={handleModalClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 1,
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </Button>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Task Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              label="Project"
              name="projectId"
              select
              value={form.projectId}
              onChange={handleChange}
              fullWidth
            >
              {["Personal", "Work", "Education", "Other"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={dayjs(form.dueDate)}
                onChange={(newValue) => {
                  if (newValue) {
                    setForm((prev) => ({
                      ...prev,
                      dueDate: newValue.toDate(),
                    }));
                  }
                }}
                format="DD MMM YYYY"
                slotProps={{
                  popper: {
                    disablePortal: true,
                  },
                  textField: {
                    fullWidth: true,
                    error: !!errors.dueDate,
                    helperText: errors.dueDate,
                  },
                }}
              />
            </LocalizationProvider>

            <TextField
              label="Priority"
              name="priority"
              select
              value={form.priority}
              onChange={handleChange}
              fullWidth
            >
              {["Low", "Medium", "High"].map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>

            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={form.tags ?? []}
              onChange={(_, newValue) =>
                setForm((prev) => ({
                  ...prev,
                  tags: newValue,
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tag and press Enter"
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "primary.contrastText",
                color: "background.paper",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "background.paper",
                },
              }}
            >
              Create Task
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default CreateTaskModal;
