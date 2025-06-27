import axios from 'axios';

// 1. Configure base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5555', // Fallback for local dev
  headers: {
    'Content-Type': 'application/json',
    // 2. Auth header will be added via interceptor (see below)
  }
});

// 3. Request interceptor for JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 4. Enhanced error handling
const handleError = (error) => {
  if (error.response) {
    console.error('API Error:', {
      status: error.response.status,
      data: error.response.data
    });
    throw error.response.data;
  } else {
    console.error('Network Error:', error.message);
    throw new Error('Network error - please check your connection');
  }
};

export const getExpenses = async () => {
  try {
    const response = await api.get('/expenses');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await api.post('/expenses', {
      ...expenseData,
      amount: parseFloat(expenseData.amount).toFixed(2) // Ensure 2 decimal places
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// updateExpense and deleteExpense remain similar with handleError