// App.jsx

/**
 * Root application component - Serves as the entry point for the React application.
 * 
 * Key Responsibilities:
 * 1. Renders the main application routes (via AppRoutes)
 * 2. Provides a clean mounting point for global providers (Auth, Theme, etc.)
 * 
 * Note: All routing logic is delegated to AppRoutes for better separation of concerns.
 */
import { AppRoutes } from './Routes'; // Centralized route configuration

const App = () => {
  return (
    /* 
      Wrapping Context Providers Example:
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    */
    <AppRoutes /> // Handles all route rendering and navigation logic
  );
};

export default App;