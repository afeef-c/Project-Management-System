import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProjectsDashboard from '../pages/ProjectsDashboard';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <ProjectsDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
