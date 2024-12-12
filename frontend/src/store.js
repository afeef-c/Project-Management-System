import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import projectsReducer from './features/projectsSlice';
import tasksReducer from './features/tasksSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks:tasksReducer
  },
});

export default store;
