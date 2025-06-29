// categoryService.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5555',
  headers: {
    'Content-Type': 'application/json',
  }
});
console.log("API URL is:", import.meta.env.VITE_API_URL);

// Interceptor to add JWT token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Centralized Error Handler (can be reused from expenseService if you want a single one)
const handleError = (error) => {
  if (error.response) {
    console.error('API Error (Categories):', {
      status: error.response.status,
      data: error.response.data
    });
    // Propagate the specific error message from the backend
    throw new Error(error.response.data.error || 'An API error occurred');
  } else if (error.request) {
    console.error('Network Error (Categories): No response received', error.request);
    throw new Error('Network error - no response from server. Check your connection.');
  } else {
    console.error('Request Setup Error (Categories):', error.message);
    throw new Error('Error setting up the request.');
  }
};

/**
 * Fetches all categories for a specific user.
 * @param {number} user_id - The ID of the logged-in user.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 */
export const getCategories = async (user_id) => {
  try {
    // Backend expects user_id as a query parameter for GET
    const response = await api.get('/categories', { params: { user_id } });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Creates a new category.
 * @param {string} name - The name of the new category.
 * @param {number} user_id - The ID of the logged-in user.
 * @returns {Promise<Object>} A promise that resolves to the newly created category object.
 */
export const createCategory = async (name, user_id) => {
  try {
    // Backend expects name and user_id in the request body for POST
    const response = await api.post('/categories', { name, user_id });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Deletes a category by ID.
 * currently backend's `CategoriesResource` does not have a DELETE method.
 * For now, I'm commenting out the real API call and leaving a placeholder/error.
 
 */
export const deleteCategory = async (id) => {
  // --- Backend Sync Requirement: backend's categories.py currently does NOT have a DELETE method ---
  // It should look something like this in categories.py:
  /*
  from flask_restful import Resource, reqparse
  from models import Category, db, Entry # Import Entry to check for dependencies
  from flask import request

  class CategoryResourceById(Resource): # You might add this as a separate resource or extend existing
      def delete(self, category_id):
          category = Category.query.get(category_id)
          if not category:
              return {"error": "Category not found"}, 404

          # Check if the category is used by any entries (important for referential integrity)
          if Entry.query.filter_by(category_id=category_id).first():
              return {"error": "Category is in use by entries and cannot be deleted"}, 400

          db.session.delete(category)
          db.session.commit()
          return {"message": "Category deleted successfully"}, 200 # Or just {}, 204 No Content
  */
  // --- End of Backend Sync Requirement ---

  console.warn("Category deletion updating pending on the backend. Simulating deletion locally.");

  // Temporary mock for delete:
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          // If you wanted to simulate backend error for in-use category:
          // const isUsedInMock = false; // Based on your mock logic
          // if (isUsedInMock) {
          //     reject(new Error('Category is in use by expenses'));
          // } else {
                resolve();
          // }
      }, 500);
  });
  // throw new Error("Category deletion endpoint is not available on the backend.");
  // try {
  //   // Example if backend had DELETE /categories/<id>
  //   const response = await api.delete(`/categories/${id}`);
  //   return response.data; // Expects empty object or success message
  // } catch (error) {
  //   return handleError(error);
  // }
};