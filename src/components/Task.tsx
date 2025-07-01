import { Box, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { TaskProps } from "../types/types";

function Task({
  id,
  name,
  description,
  dueDate,
  priority,
  status,
  createdDate,
  tags,
}: TaskProps) {
  const theme = useTheme();

  const formatStatus = (status: string): string => {
    return status
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box
      key={id}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 2,
        p: 3,
        mb: 2,
        borderLeft: `6px solid ${
          {
            High: theme.palette.error.main,
            Medium: theme.palette.warning.main,
            Low: theme.palette.info.main,
          }[priority] || theme.palette.success.main
        }`,
      }}
    >
      <Typography variant="h2" color="primary.main" gutterBottom>
        {name}
      </Typography>
      <Typography variant="body1" color="text.main" gutterBottom>
        {description}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Created: {formatDate(createdDate)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Due: {formatDate(dueDate)}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color:
            status === "done"
              ? theme.palette.success?.main || "#4caf50" //green
              : status === "in-progress"
              ? theme.palette.warning?.main || "#ff9800" //orange
              : status === "not-started"
              ? theme.palette.info?.main || "#2196f3" //blue
              : theme.palette.error.main,
          fontWeight: 600,
        }}
      >
        Status: {formatStatus(status)}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {tags?.map((tag, index) => (
        <Box
          key={index}
          sx={{
            display: "inline-block",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.common.black,
            borderRadius: 1,
            px: 1,
            py: 0.5,
            border: `1px solid ${theme.palette.divider}`,
            fontSize: "0.875rem",
            fontWeight: 500,
            mr: 1,
            mb: 1,
          }}
        >
          {tag}
        </Box>
      ))}
    </Box>
  );
}
export default Task;
