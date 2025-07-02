import {
  Box,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
} from "@mui/material";

import { useState } from "react";
import type { TaskProps } from "../types/types";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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

function CreateTaskModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initialFormState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: TaskProps = {
      ...form,
      id: Date.now().toString(),
      createdDate: new Date(),
    };
    console.log("New Task:", newTask);
    onClose();
    setForm(initialFormState);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
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
          onClick={onClose}
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
                textField: {
                  fullWidth: true,
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
            options={[]} // можно добавить популярные теги, если хочешь
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
            onClick={handleSubmit}
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
  );
}

export default CreateTaskModal;
