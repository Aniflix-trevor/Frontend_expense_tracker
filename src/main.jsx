// main.jsx - Application Entry Point

// Core React Imports
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Routing
import { BrowserRouter } from 'react-router-dom'; // Enables client-side routing

// Context Providers
import { AuthProvider } from './contexts/AuthContext'; // Manages user authentication state

// UI Components & Styles
import { ToastContainer } from 'react-toastify'; // Notification system
import App from './App'; // Root component
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

// Fonts (Using Inter from Google Fonts via @fontsource)
import "@fontsource/inter"; // Base font weight (400)
import "@fontsource/inter/500.css"; // Medium weight
import "@fontsource/inter/600.css"; // Semi-bold weight

// Global Styles
import './index.css'; // TailwindCSS and custom base styles

// Initialize React Root
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* StrictMode helps catch potential problems during development */}
    
    <BrowserRouter>
      {/* 
        Enables client-side routing:
        - No page reloads on navigation
        - Supports dynamic routes like /expenses/:id 
      */}
      
      <AuthProvider>
        {/*
          Provides global auth state to all components via:
          - user: current user data
          - login/register/logout methods
          - token management
        */}
        
        <App /> {/* Main application component */}
        
        <ToastContainer 
          position="bottom-right"  // Display position
          autoClose={5000}        // Auto-dismiss after 5 seconds
          hideProgressBar={false} // Show progress bar
          newestOnTop={false}     // Stack new toasts below existing
          closeOnClick            // Dismiss on click
          rtl={false}             // Left-to-right layout
          pauseOnFocusLoss        // Pause timer when window loses focus
          draggable               // Allow dragging to dismiss
          pauseOnHover            // Pause timer on hover
          theme="dark"            // Matches dark theme
          /* 
            Additional recommended props for production:
            limit={3}             // Max visible toasts
            toastClassName="custom-toast" // For custom styling
          */
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);