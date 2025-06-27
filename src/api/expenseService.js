import axios from 'axios';

// 1. Axios Instance Configuration

const api = axios.create({
  // Uses VITE_API_URL from .env or defaults to local Flask dev server
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5555',
  headers: {
    'Content-Type': 'application/json', // Required for Flask's request.json
  }
});

// 2. Authentication Interceptor

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Matches AuthContext.jsx storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Flask expects this format
  }
  return config;
});

// 3. Centralized Error Handler

const handleError = (error) => {
  if (error.response) {
    // Backend-sent errors (4xx/5xx)
    console.error('API Error:', {
      status: error.response.status, // e.g., 401 Unauthorized
      data: error.response.data     // Flask's jsonify({error: "message"})
    });
    throw error.response.data; // Propagates to React components
  } else {
    // Network failures (no connection, etc.)
    console.error('Network Error:', error.message);
    throw new Error('Network error - please check your connection');
  }
};

// 4. Expense CRUD Operations


// GET /expenses - Fetches all expenses
export const getExpenses = async () => {
  try {
    const response = await api.get('/expenses');
    return response.data; // Expects [{ id, amount, description, date, category }]
  } catch (error) {
    return handleError(error);
  }
};

// POST /expenses - Creates new expense
export const createExpense = async (expenseData) => {
  try {
    const response = await api.post('/expenses', {
      ...expenseData,
      amount: parseFloat(expenseData.amount).toFixed(2) // Forces 2 decimal places
      // Backend expects: { amount, description, date, category_id }
    });
    return response.data; // Expects full expense object with category
  } catch (error) {
    return handleError(error);
  }
};