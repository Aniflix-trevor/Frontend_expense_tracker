import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

/**
 * ProtectedRoute - Wrapper for authenticated routes
 * - Redirects to /login if no JWT token exists
 * - Uses replace to prevent back-navigation loops
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth(); // Checks localStorage for token via AuthContext
  return token ? children : <Navigate to="/login" replace />;
};

/**
 * AppRoutes - Main routing configuration
 * - Public routes: /login, /register
 * - Protected routes: /dashboard/*
 * - Fallback: Redirects to /dashboard (protected)
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={<Login />} 
        // No auth required - accessible even when logged in
      />
      <Route 
        path="/register" 
        element={<Register />} 
        // Registration doesn't require authentication
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {/* Wrapped in auth check */}
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route 
        path="*" 
        element={<Navigate to="/dashboard" replace />} 
        // Handles 404s by redirecting to dashboard
        // replace prevents history stack pollution
      />
    </Routes>
  );
};