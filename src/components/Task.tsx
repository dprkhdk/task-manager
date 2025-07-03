import { Box, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { TaskProps } from "../types/types";
import { Link } from "react-router-dom";

function Task({
  id,
  name,
  description,
  dueDate,
  priority,
  status,
  createdDate,
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
    <Link
      to={`/tasks/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Box
        key={id}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 2,
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderLeft: `6px solid ${
            {
              High: theme.palette.error.main,
              Medium: theme.palette.warning.main,
              Low: theme.palette.info.main,
            }[priority] || theme.palette.success.main
          }`,
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          color="primary.main"
          gutterBottom
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.main"
          gutterBottom
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            flexGrow: 1,
          }}
        >
          {description || "No description"}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="caption" color="text.secondary">
            Created: {formatDate(createdDate)}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Due: {formatDate(dueDate)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color:
                status === "done"
                  ? theme.palette.success?.main
                  : status === "in-progress"
                  ? theme.palette.warning?.main
                  : theme.palette.info?.main,
              fontWeight: 600,
              mt: 1,
            }}
          >
            {formatStatus(status)}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}
export default Task;
