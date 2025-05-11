import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';
import DashboardMain from './components/DashboardMain';
import AIDoctorChat from './components/AIDoctorChat';
import AppointmentBooking from './components/AppointmentBooking';
import DepartmentDetails from './components/DepartmentDetails';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />

        {/* Protected Routes */}
        <Route
          path="/dashboardMain"
          element={
            <ProtectedRoute>
              <DashboardMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department/:id"
          element={
            <ProtectedRoute>
              <DepartmentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <AIDoctorChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment/:id"
          element={
            <ProtectedRoute>
              <AppointmentBooking />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
