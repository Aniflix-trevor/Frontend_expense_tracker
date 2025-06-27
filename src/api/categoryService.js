// categoryService.js

// MOCK IMPLEMENTATION - Temporary mock data before backend integration
// Note: In a real app, these would come from your Flask backend database
const mockCategories = [
  { id: 1, name: 'Food' },      // Default category examples
  { id: 2, name: 'Transport' }  // Matches the expense categories in your mockExpenses
];

// Fetches all categories - Currently mock data
// TODO: Replace with actual API call to Flask GET /categories
export const getCategories = async () => {
  return new Promise(resolve => 
    setTimeout(() => resolve([...mockCategories]), 500) // Simulate network delay
  );
  // Backend Sync Requirement:
  // Flask should return: [{ id: number, name: string }]
};

// Creates a new category - Currently mock
// TODO: Replace with POST /categories
export const createCategory = async (name) => {
  return new Promise(resolve => {
    const newCategory = {
      id: Math.max(...mockCategories.map(c => c.id)) + 1, // Simple ID generation
      name
    };
    mockCategories.push(newCategory); // Local mock update
    setTimeout(() => resolve(newCategory), 500); // Simulate API delay
    
    // Backend Sync Requirement:
    // Flask should expect: { name: string }
    // Return: { id: number, name: string }
  });
};

// Deletes a category by ID - Currently mock
// TODO: Replace with DELETE /categories/:id
export const deleteCategory = async (id) => {
  return new Promise(resolve => {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index !== -1) mockCategories.splice(index, 1); // Local mock update
    
    setTimeout(() => resolve(), 500); // Simulate API delay
    
    // Backend Sync Requirement:
    // Flask should return:
    // - 204 No Content if successful
    // - 400 if category is used by expenses (protect referential integrity)
  });
};