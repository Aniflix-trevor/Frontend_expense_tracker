import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import { toast } from 'react-toastify';

// Import the new services
import { getCategories, createCategory, deleteCategory } from "../api/categoryService";
import { getEntries, createEntry, updateEntry, deleteEntry } from "../api/expenseService";


export default function Dashboard() {
  const { user, logout } = useAuth(); // user will now contain { email, id }
  const userId = user?.id; // Get the user ID from auth context

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [expensesLoading, setExpensesLoading] = useState(false);


  // Unified fetch function for categories
  const fetchCategories = useCallback(async () => {
    if (!userId) return; // Don't fetch if user ID is not available yet
    setCategoriesLoading(true);
    try {
      const data = await getCategories(userId);
      setCategories(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch categories');
    } finally {
      setCategoriesLoading(false);
    }
  }, [userId]);

  // Unified fetch function for entries (expenses)
  const fetchExpenses = useCallback(async () => {
    if (!userId) return; // Don't fetch if user ID is not available yet
    setExpensesLoading(true);
    try {
      const data = await getEntries(userId);
      // Backend returns 'note' and 'amount', 'type', 'is_recurring', 'category_id'
      // Frontend expects 'description', 'amount', 'date', 'category' (object)
      // We need to transform the data to fit frontend components
      const transformedExpenses = data.map(entry => ({
        id: entry.id,
        amount: parseFloat(entry.amount).toFixed(2), // Ensure string with 2 decimals
        description: entry.note, // Map backend 'note' to frontend 'description'
        // the backend doesn't return a 'date' field, but 'created_at'.
        // used created_at for the date if no separate date field is in the backend.
        date: entry.created_at ? new Date(entry.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: entry.type,
        is_recurring: entry.is_recurring,
        // Find the category object based on category_id
        category: categories.find(cat => cat.id === entry.category_id) || null
      }));
      setExpenses(transformedExpenses);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch expenses');
    } finally {
      setExpensesLoading(false);
    }
  }, [userId, categories]); // Depend on categories to correctly map category names

  // Initial data loading when component mounts or user ID becomes available
  useEffect(() => {
    if (userId) {
      fetchCategories();
    }
  }, [userId, fetchCategories]);

  useEffect(() => {
    if (userId && categories.length > 0) { // Fetch expenses once categories are loaded
      fetchExpenses();
    }
  }, [userId, categories, fetchExpenses]);


  // Expense CRUD Operations

  const handleSubmitExpense = async (expenseData) => {
    setLoading(true);
    try {
      if (!userId) {
        toast.error("User not logged in.");
        return;
      }

      if (editingExpense) {
        // Update existing entry
        // Backend updateEntry needs to be implemented
        // For now, it's mocked in expenseService
        const updatedEntry = await updateEntry(editingExpense.id, expenseData, userId);
        setExpenses(prev => prev.map(exp =>
          exp.id === editingExpense.id ? {
            ...exp,
            amount: parseFloat(updatedEntry.amount).toFixed(2),
            description: updatedEntry.note,
            date: updatedEntry.created_at ? new Date(updatedEntry.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            category: categories.find(c => c.id === updatedEntry.category_id) || null
          } : exp
        ));
        toast.success('Expense updated successfully');
      } else {
        // Create new entry
        const newEntry = await createEntry(expenseData, userId);
        setExpenses(prev => [...prev, {
          id: newEntry.id,
          amount: parseFloat(newEntry.amount).toFixed(2),
          description: newEntry.note,
          date: newEntry.created_at ? new Date(newEntry.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: categories.find(c => c.id === newEntry.category_id) || null
        }]);
        toast.success('Expense added successfully');
      }
      setEditingExpense(null); // Reset edit mode
      // Refetch all expenses to ensure data consistency, if needed
      // fetchExpenses(); // Uncomment this if you want to be absolutely sure after CUD
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    setLoading(true);
    try {
      // Backend deleteEntry needs to be implemented
      // For now, it's mocked in expenseService
      await deleteEntry(id);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast.success('Expense deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  // Category CRUD Operations

  const handleCreateCategory = async (name) => {
    setLoading(true);
    try {
      if (!userId) {
        toast.error("User not logged in.");
        return;
      }
      const newCategory = await createCategory(name, userId);
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category added successfully');
      return newCategory;
    } catch (error) {
      toast.error(error.message || 'Failed to create category');
      throw error; // Re-throw to CategoryForm for specific error handling
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      // Backend deleteCategory needs to be implemented
      // For now, it's mocked in categoryService, and frontend check remains.
      const isUsed = expenses.some(exp => exp.category?.id === id);
      if (isUsed) {
        toast.error('Category is in use by expenses and cannot be deleted.');
        return; // Prevent local deletion if it's used
      }

      await deleteCategory(id); // This will currently just simulate
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    }
  };


  // UI Helpers

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setActiveTab('expenses');
    document.querySelector('#expense-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">
            {user?.email}'s Expense Dashboard
          </h1>
          <div className="flex gap-4">
            {/* The "Reset Demo" button can be removed or repurposed if not needed after full integration */}
            {/* <button
              onClick={loadInitialData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Reset Demo
            </button> */}
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-dark-700 mb-6">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'expenses'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'categories'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Categories
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === 'expenses' ? (
          // Expenses Tab
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Expense Form */}
            <div className="lg:col-span-1" id="expense-form">
              <h2 className="text-xl font-semibold mb-4">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <ExpenseForm
                onSubmit={handleSubmitExpense}
                categories={categories}
                initialData={editingExpense}
              />
            </div>

            {/* Expense List */}
            <div className="lg:col-span-2">
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Expenses</h2>
                  <div className="text-text-secondary">
                    Total: KSh {expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)}
                    <span className="text-xs block">({expenses.length} items)</span>
                  </div>
                </div>
                {expensesLoading ? (
                  <div className="text-center text-text-secondary">Loading expenses...</div>
                ) : (
                  <ExpenseList
                    expenses={expenses}
                    onEdit={handleEdit}
                    onDelete={handleDeleteExpense}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          // Categories Tab
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Category Form */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Add Category</h2>
              <CategoryForm
                onSubmit={handleCreateCategory}
                disabled={loading} // Use general loading for form submission
              />
            </div>

            {/* Category List */}
            <div className="lg:col-span-2">
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <h2 className="text-xl font-semibold mb-4">Your Categories</h2>
                {categoriesLoading ? (
                  <div className="text-center text-text-secondary">Loading categories...</div>
                ) : (
                  <CategoryList
                    categories={categories}
                    onDelete={handleDeleteCategory}
                  />
                )}
                <p className="text-sm text-text-secondary mt-4">
                  Note: Categories might not be deletable if they are used by expenses on the backend.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}