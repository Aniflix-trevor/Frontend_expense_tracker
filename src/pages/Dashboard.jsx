import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
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
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
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

  const handleSubmit = async (expenseData) => {
    setLoading(true);
    try {
      if (editingExpense) {
        // Update existing expense
        setExpenses(prev => prev.map(exp => 
          exp.id === editingExpense.id ? { 
            ...exp, 
            ...expenseData,
            category: categories.find(c => c.id === expenseData.category_id) || null
          } : exp
        ));
        toast.success('Expense updated successfully');
      } else {
        // Add new expense
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

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    toast.success('Expense deleted successfully');
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    // Scroll to form
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1" id="expense-form">
            <h2 className="text-xl font-semibold mb-4">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <ExpenseForm 
              onSubmit={handleSubmit} 
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
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}