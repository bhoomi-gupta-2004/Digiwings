import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmployeeLoginPage from "./pages/EmployeeLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import LeaveApplication from "./modules/LeaveApplication";
import bg from "../../frontend/src/assets/images/bg.jpg";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; 

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
      <div
        className="min-h-screen w-full"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<EmployeeLoginPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} /> 

          {/* Protected Routes */}
          <Route
            path="/employee-dashboard/*"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <ProtectedRoute>
                <LeaveApplication />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
  );
};

export default App;
