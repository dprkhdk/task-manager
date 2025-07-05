import { Box, Typography, Card, CardContent } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { getAllTasks } from "../api/task";
import type { TaskProps } from "../types/types";

const COLORS = ["#4caf50", "#ff9800", "#f44336"];

const DashboardPage = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().subtract(30, "day")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTasks();
        setTasks(response.data || []);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };
    fetchData();
  }, []);

  const filterByPeriod = (task: TaskProps) => {
    if (!startDate || !endDate) return true;
    const taskDate = dayjs(task.createdDate || task.createdDate);
    return (
      taskDate.isAfter(startDate.subtract(1, "day")) &&
      taskDate.isBefore(endDate.add(1, "day"))
    );
  };

  const getStats = () => {
    const filtered = tasks.filter(filterByPeriod);
    return {
      total: filtered.length,
      done: filtered.filter((t) => t.status === "done").length,
      inProgress: filtered.filter((t) => t.status === "in-progress").length,
    };
  };

  const getChartData = () => {
    const grouped: Record<string, number> = {};
    tasks.filter(filterByPeriod).forEach((t) => {
      const date = dayjs(t.createdDate || t.createdDate).format("YYYY-MM-DD");
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  };

  const stats = getStats();
  const chartData = getChartData();

  const pieData = [
    { name: "Done", value: stats.done },
    { name: "In Progress", value: stats.inProgress },
    { name: "Not Started", value: stats.total - stats.done - stats.inProgress },
  ];

  return (
    <Box sx={{ margin: "20px auto", px: 2 }}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard Overview
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
          />
        </LocalizationProvider>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          marginBottom: 4,
        }}
      >
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6">Total Tasks</Typography>
            <Typography variant="h4">{stats.total}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6">Done</Typography>
            <Typography variant="h4" color="success.main">
              {stats.done}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6">In Progress</Typography>
            <Typography variant="h4" color="warning.main">
              {stats.inProgress}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Line Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📅 Tasks Created Over Time
          </Typography>
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3f51b5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📌 Task Status Breakdown
          </Typography>
          <Box sx={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
