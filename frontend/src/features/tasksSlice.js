import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { toast } from 'react-toastify';

const initialState = {
  tasks_list: [],
  loading: false,
  error: null,
};

// Thunks for async actions
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tasks/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tasks');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tasks/${task.id}/`, task);
      toast.success("Task updated successfully!");
      return response.data;
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
      return rejectWithValue(error.response?.data || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (task, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${task.id}/`);
      toast.success("Task deleted successfully!");
      return task.id;
    } catch (error) {
      toast.error("Failed to delete task. Please try again.");
      return rejectWithValue(error.response?.data || 'Failed to delete task');
    }
  }
);

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks_list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks_list.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks_list[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update task';
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks_list = state.tasks_list.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete task';
      });
  },
});

export default tasksSlice.reducer;
