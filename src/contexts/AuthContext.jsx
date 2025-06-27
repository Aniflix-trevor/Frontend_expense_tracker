import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// 1. Context Creation

// Creates authentication context to share user state across components
const AuthContext = createContext();

// 2. Axios Instance Configuration

// Base setup for API requests (matches Flask backend URL)
const api = axios.create({
  baseURL: 'http://127.0.0.1:5555', // Should eventually use VITE_API_URL from .env
  headers: {
    'Content-Type': 'application/json', // Required for Flask's request.json
  },
});

// 3. Auth Provider Component

export const AuthProvider = ({ children }) => {
  // State Management
  const [user, setUser] = useState(null); // { email } - minimal user data
  const [token, setToken] = useState(localStorage.getItem('token') || null); // JWT storage
  const [loading, setLoading] = useState(false); // Global loading state
  const navigate = useNavigate();

  // 4. Token Synchronization Effect
  
  // Runs when token changes to:
  // - Update axios headers
  // - Persist to localStorage
  // - Maintain user session
  useEffect(() => {
    if (token) {
      // Attach token to all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token); // Persistent login
      
      // Minimal user state (backend doesn't have profile endpoint)
      setUser({ email: localStorage.getItem('userEmail') }); 
    } else {
      // Clear auth state
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    }
  }, [token]);

  // 5. Authentication Methods
  

  /**
   * Handles user login
   * @param {string} email 
   * @param {string} password 
   * @throws {Error} On failed login
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/login', { email, password });
      
      // Update auth state
      setToken(response.data.token);
      localStorage.setItem('userEmail', email);
      setUser({ email });
      
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      // Unified error handling
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user registration
   * @param {Object} userData - { email, password, full_name }
   * @throws {Error} On failed registration
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/signin', {
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name
      });
      
      // Auto-login after registration
      setToken(response.data.token);
      localStorage.setItem('userEmail', userData.email);
      setUser({ email: userData.email });
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user logout
   * Clears all auth state and redirects
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully');
    navigate('/login');
  };

  // 6. Context Provider
  
  // Exposes auth state and methods to child components
  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 7. Custom Hook

// Shortcut for accessing auth context
export const useAuth = () => useContext(AuthContext);