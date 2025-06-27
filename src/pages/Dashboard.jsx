import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');
  const [loading, setLoading] = useState(false);

  // Enhanced mock data
  const mockCategories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' },
    { id: 3, name: 'Utilities' },
    { id: 4, name: 'Entertainment' }
  ];

  const mockExpenses = [
    {
      id: 1,
      amount: '29.99',
      description: 'Groceries',
      date: new Date().toISOString().split('T')[0],
      category: { id: 1, name: 'Food' }
    },
    {
      id: 2,
      amount: '15.50',
      description: 'Bus fare',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      category: { id: 2, name: 'Transport' }
    }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setExpenses([...mockExpenses]);
    setCategories([...mockCategories]);
  };

  // Expense handlers
  const handleSubmitExpense = async (expenseData) => {
    setLoading(true);
    try {
      if (editingExpense) {
        setExpenses(prev => prev.map(exp => 
          exp.id === editingExpense.id ? { 
            ...exp, 
            ...expenseData,
            category: categories.find(c => c.id === expenseData.category_id) || null
          } : exp
        ));
        toast.success('Expense updated successfully');
      } else {
        const newExpense = {
          ...expenseData,
          id: Math.max(0, ...expenses.map(e => e.id)) + 1,
          category: categories.find(c => c.id === expenseData.category_id) || null
        };
        setExpenses(prev => [...prev, newExpense]);
        toast.success('Expense added successfully');
      }
      setEditingExpense(null);
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Category handlers
  const handleCreateCategory = async (name) => {
    setLoading(true);
    try {
      const newCategory = {
        id: Math.max(0, ...categories.map(c => c.id)) + 1,
        name
      };
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category added successfully');
      return newCategory;
    } catch (error) {
      toast.error('Failed to create category');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      // Don't allow deletion if category is in use
      const isUsed = expenses.some(exp => exp.category?.id === id);
      if (isUsed) {
        throw new Error('Category is in use by expenses');
      }
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setActiveTab('expenses');
    document.querySelector('#expense-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">
            {user?.email}'s Expense Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={loadInitialData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Reset Demo
            </button>
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

        {activeTab === 'expenses' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            <div className="lg:col-span-2">
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Expenses</h2>
                  <div className="text-text-secondary">
                    Total: ${expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)}
                    <span className="text-xs block">({expenses.length} items)</span>
                  </div>
                </div>
                <ExpenseList 
                  expenses={expenses} 
                  onEdit={handleEdit}
                  onDelete={handleDeleteExpense}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Add Category</h2>
              <CategoryForm 
                onSubmit={handleCreateCategory} 
                disabled={loading}
              />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <h2 className="text-xl font-semibold mb-4">Your Categories</h2>
                <CategoryList 
                  categories={categories} 
                  onDelete={handleDeleteCategory}
                />
                <p className="text-sm text-text-secondary mt-4">
                  Note: Categories can't be deleted while in use by expenses
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function handleDeleteExpense(id) {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    toast.success('Expense deleted successfully');
  }
}