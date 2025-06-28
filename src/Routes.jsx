import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home'; 

/**
 * ProtectedRoute - Wrapper for authenticated routes
 * - Redirects to /login if no JWT token exists
 * - Uses replace to prevent back-navigation loops
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth(); // Checks localStorage for token via AuthContext
  // If user is not authenticated (no token), redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // If authenticated, render the children
  return children;
};

/**
 * AppRoutes - Main routing configuration
 * - Public routes: /, /login, /register
 * - Protected routes: /dashboard/*
 * - Fallback: Redirects to / (homepage) for unauthenticated users, or to /dashboard if logged in
 */
export const AppRoutes = () => {
  const { token } = useAuth(); // Get token to decide initial redirect

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} /> {/* <-- NEW: Home page */}
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />} // <--- Redirect to dashboard if already logged in
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/dashboard" replace /> : <Register />} // <--- Redirects to dashboard if already logged in
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback Route: Redirect to home or dashboard based on auth state */}
      <Route
        path="*"
        element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};