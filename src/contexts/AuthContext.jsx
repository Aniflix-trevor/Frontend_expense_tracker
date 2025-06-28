import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// Import jwt_decode library
import { jwtDecode } from 'jwt-decode'; //  installed this: npm install jwt-decode

const AuthContext = createContext();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5555',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, id }
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to decode JWT and get user ID
  const getUserIdFromToken = (jwtToken) => {
    try {
      const decodedToken = jwtDecode(jwtToken);
      // 'identity' is the key Flask-JWT-Extended uses for the subject of the token (your user.id)
      return decodedToken.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);

      // Extract user ID from token and set user state
      const userId = getUserIdFromToken(token);
      const userEmail = localStorage.getItem('userEmail'); // Still useful for displaying email
      if (userId) {
        setUser({ email: userEmail, id: userId });
      } else {
        // If token is invalid or id cannot be extracted, log out
        logout();
      }
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/login', { email, password });

      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem('userEmail', email); // Keep user email for display
      // User ID will be set by the useEffect when token changes
      
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/signin', {
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name
      });

      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem('userEmail', userData.email); // Keep user email for display
      // User ID will be set by the useEffect when token changes

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

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully');
    navigate('/login');
  };

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

export const useAuth = () => useContext(AuthContext);