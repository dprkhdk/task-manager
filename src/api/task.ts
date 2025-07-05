import axios from "axios";
import type { TaskProps } from "../types/types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const createTask = async (task: Omit<TaskProps, "id" | "createdDate">) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, task);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Failed to create task:", error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

export const getAllTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    console.log(response.data);
    
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch tasks:", error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw error;
  }
};

export const getTaskById = async (taskId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error: unknown) {
    console.error(`❌ Failed to fetch task with id ${taskId}:`, error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw error;
  }
};


export const updateTask = async (taskId: string, data: Partial<TaskProps>) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, data);
    return response.data;
  } catch (error: unknown) {
    console.error(`❌ Failed to update task with id ${taskId}:`, error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw error;
  }
};


export const deleteTask = async (taskId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error: unknown) {
    console.error(`❌ Failed to delete task with id ${taskId}:`, error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw error;
  }
};


export const addCommentToTask = async (taskId: string, comment: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks/${taskId}/comments`, { comment });
    return response.data;
  } catch (error: unknown) {
    console.error(`❌ Failed to add comment to task with id ${taskId}:`, error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
