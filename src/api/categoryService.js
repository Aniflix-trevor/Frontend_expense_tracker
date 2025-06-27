// MOCK IMPLEMENTATION - Replace with real API calls later
const mockCategories = [
  { id: 1, name: 'Food' },
  { id: 2, name: 'Transport' }
];

export const getCategories = async () => {
  return new Promise(resolve => 
    setTimeout(() => resolve([...mockCategories]), 500)
  );
};

export const createCategory = async (name) => {
  return new Promise(resolve => {
    const newCategory = {
      id: Math.max(...mockCategories.map(c => c.id)) + 1,
      name
    };
    mockCategories.push(newCategory);
    setTimeout(() => resolve(newCategory), 500);
  });
};

export const deleteCategory = async (id) => {
  return new Promise(resolve => {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index !== -1) mockCategories.splice(index, 1);
    setTimeout(() => resolve(), 500);
  });
};