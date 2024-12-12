import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { toast } from "react-toastify";

// Fetch projects
export const fetchProjects = createAsyncThunk("projects/fetchProjects", async () => {
  const response = await api.get("/projects/");
  return response.data;
});

// Delete a project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/`);
      toast.success("Project deleted successfully!");
      return projectId;
    } catch (error) {
      toast.error("Failed to delete project. Please try again.");
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Update a project
export const updateProject = createAsyncThunk("projects/updateProject", async (project) => {
  const response = await api.put(`/projects/${project.id}/`, project);
  return response.data;
});

const projectsSlice = createSlice({
  name: "projects",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((project) => project.id !== action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.list.findIndex((project) => project.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default projectsSlice.reducer;
