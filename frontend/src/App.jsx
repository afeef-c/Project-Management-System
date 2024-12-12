import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import ProjectsDashboard from './pages/ProjectsDashboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // import the styles for toast
import Nav from './components/Nav';
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import CreateTask from './pages/createTask';
import AuthListener from './components/AuthListener';
import TasksDashboard from './pages/TasksDashboard';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <AuthListener/>
      <Nav/>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} >
          <Route path="" element={<ProjectsDashboard />} />
          <Route path="create_project/" element={<CreateProject />} />
          <Route path="create_task/" element={<CreateTask />} />
          <Route path="tasks/" element={<TasksDashboard />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
          
      </Routes>
      <ToastContainer />

    </Router>
  );
};

export default App;
