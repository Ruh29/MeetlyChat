import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import  store  from './redux/store';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Regitser";
import AdminDashboard from "./pages/AdminDashboard";
import PendingActions from "./components/PendingActions/PendingActions";
import InterviewSchedule from "./components/InterviewSchedule/InterviewSchedule";
import SendEmailToShortlisted from "./components/SendEmailToShortlisted/SendEmailToShortlisted";
import CreateInterviews from "./pages/CreateInterviews";
import OTPVerify from "./components/OTPVerify";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminRoute from "./components/AdminRoutes";
import VideoCall from "./pages/VideoCall";
import DashboardRedirect from "./components/DashboardRedirect";
import RealTimeCallManager from "./components/RealTimeCallManager";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <RealTimeCallManager />
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerify />} />

        {/* Dashboard Route - Redirects based on role */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          {/* Admin Child Routes */}
          <Route index element={<PendingActions />} /> {/* default */}
          <Route path="pending-actions" element={<PendingActions />} />
          <Route path="send-email" element={<SendEmailToShortlisted />} />
          <Route path="create" element={<CreateInterviews />} />
          <Route path="schedule" element={<InterviewSchedule/>} />
        </Route>

        {/* Standalone create route - redirects to admin dashboard */}
        <Route path="/create" element={<Navigate to="/admin-dashboard/create" replace />} />

        {/* Video Call Route - Outside admin dashboard */}
        <Route 
          path="/call/:roomId" 
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          } 
        />

        {/* Redirect root to home */}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
    </Provider>
  );
}
