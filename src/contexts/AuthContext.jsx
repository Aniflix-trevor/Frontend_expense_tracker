import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const api = axios.create({
  baseURL: 'http://127.0.0.1:5555',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // Removed profile fetch since backend doesn't have this endpoint
      setUser({ email: localStorage.getItem('userEmail') }); // Simple user state
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    }
  }, [token]);

  const login = async (email, password) => {
  try {
    setLoading(true);
    const response = await api.post('/login', { email, password });
    setToken(response.data.token);
    localStorage.setItem('userEmail', email);
    setUser({ email });
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

const logout = () => {
  setToken(null);
  setUser(null);
  toast.info('Logged out successfully');
  navigate('/login');
};


  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);