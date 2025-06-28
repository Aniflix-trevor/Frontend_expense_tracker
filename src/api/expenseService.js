import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5555',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

const handleError = (error) => {
  if (error.response) {
    console.error('API Error (Entries):', {
      status: error.response.status,
      data: error.response.data
    });
    throw new Error(error.response.data.error || 'An API error occurred');
  } else if (error.request) {
    console.error('Network Error (Entries): No response received', error.request);
    throw new Error('Network error - no response from server. Check your connection.');
  } else {
    console.error('Request Setup Error (Entries):', error.message);
    throw new Error('Error setting up the request.');
  }
};

// Renamed from getExpenses to getEntries to match backend
/**
 * Fetches all entries for a specific user.
 * @param {number} user_id - The ID of the logged-in user.
 * @returns {Promise<Array>} A promise that resolves to an array of entry objects.
 */
export const getEntries = async (user_id) => {
  try {
    // Backend expects user_id as a query parameter for GET
    const response = await api.get('/entries', { params: { user_id } });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Renamed from createExpense to createEntry to match backend
/**
 * Creates a new entry (expense/income).
 * @param {Object} entryData - The data for the new entry.
 * @param {number} user_id - The ID of the logged-in user.
 * @returns {Promise<Object>} A promise that resolves to the newly created entry object.
 */
export const createEntry = async (entryData, user_id) => {
  try {
    // current backend expects: note, amount, type (optional, default 'expense'),
    // is_recurring (optional, default false), user_id, category_id (optional)
    const payload = {
      note: entryData.description, // Map frontend 'description' to backend 'note'
      amount: parseFloat(entryData.amount), // Ensure float as per backend
      type: entryData.type || 'expense', // Default to 'expense' if not specified
      is_recurring: entryData.is_recurring || false, // Default to false
      user_id: user_id,
      category_id: entryData.category_id || null // Can be null
    };

    const response = await api.post('/entries', payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Updates an existing entry.
 * current's backend `entries.py` does not currently have a PUT/PATCH method for specific entries.
 * For now, I'm commenting out the real API call and leaving a placeholder.
 */
export const updateEntry = async (id, entryData, user_id) => {
  // --- Backend Sync Requirement: backend's entries.py currently does NOT have PUT/PATCH method ---
  //  will be considered to add a PUT/PATCH method to the EntriesResource
  // or create a new EntryResourceById(Resource) class for specific entry operations.
  // It should look something like this in entries.py:
  /*
  from flask_restful import Resource, reqparse
  from models import Entry, db
  from datetime import datetime

  class EntryResourceById(Resource):
      def put(self, entry_id): # Or patch
          entry = Entry.query.get(entry_id)
          if not entry:
              return {"error": "Entry not found"}, 404

          data = request.get_json()
          entry.note = data.get("note", entry.note)
          entry.amount = data.get("amount", entry.amount)
          entry.type = data.get("type", entry.type)
          entry.is_recurring = data.get("is_recurring", entry.is_recurring)
          entry.category_id = data.get("category_id", entry.category_id)
          entry.updated_at = datetime.now()

          db.session.commit()
          return {
              "id": entry.id,
              "note": entry.note,
              "amount": float(entry.amount),
              "type": entry.type,
              "is_recurring": entry.is_recurring,
              "user_id": entry.user_id,
              "category_id": entry.category_id,
              "created_at": entry.created_at.isoformat(),
              "updated_at": entry.updated_at.isoformat(),
              "deleted_at": entry.deleted_at.isoformat() if entry.deleted_at else None,
          }, 200
  */
  // --- End of Backend Sync Requirement ---

  console.warn("Entry update not yet implemented on the backend. Simulating update locally.");

  // Temporary mock for update:
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Simulating update for entry ${id} with data:`, entryData);
      resolve({
        id,
        ...entryData,
        amount: parseFloat(entryData.amount),
        user_id,
        updated_at: new Date().toISOString()
      });
    }, 500);
  });

  // try {
  //   // Example if backend had PUT/PATCH /entries/<id>
  //   const response = await api.put(`/entries/${id}`, {
  //     note: entryData.description,
  //     amount: parseFloat(entryData.amount),
  //     type: entryData.type || 'expense',
  //     is_recurring: entryData.is_recurring || false,
  //     category_id: entryData.category_id || null
  //   });
  //   return response.data;
  // } catch (error) {
  //   return handleError(error);
  // }
};

/**
 * Deletes an entry.
 * Also current backend `entries.py` does not currently have a DELETE method for specific entries.
 * For now, I'm commenting out the real API call and leaving a placeholder.
 */
export const deleteEntry = async (id) => {
  // --- Backend Sync Requirement: backend's entries.py currently MISS the DELETE method ---
  // It should look something like this in entries.py:
  /*
  from flask_restful import Resource
  from models import Entry, db

  class EntryResourceById(Resource):
      def delete(self, entry_id):
          entry = Entry.query.get(entry_id)
          if not entry:
              return {"error": "Entry not found"}, 404
          db.session.delete(entry)
          db.session.commit()
          return {}, 204 # No Content
  */
  // --- End of Backend Sync Requirement ---

  console.warn("Entry deletion not yet implemented on the backend. Simulating deletion locally.");

  // Temporary mock for delete:
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Simulating deletion for entry ${id}`);
      resolve({});
    }, 500);
  });

  // try {
  //   // Example if backend had DELETE /entries/<id>
  //   const response = await api.delete(`/entries/${id}`);
  //   return response.data; // Expects empty object or success message/204
  // } catch (error) {
  //   return handleError(error);
  // }
};