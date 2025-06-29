import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ExpenseForm({ onSubmit, categories, initialData }) {
  // State Management
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Defaults to today
    category_id: '' // Matches CategoryList's category.id
  });
  const [loading, setLoading] = useState(false);

  // Edit Mode Initialization
  useEffect(() => {
    setFormData({
      amount: initialData?.amount || '',
      description: initialData?.description || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      category_id: initialData?.category?.id || '' // Sync with categoryService data
    });
  }, [initialData]);

  // Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation (matches backend expectations)
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount).toFixed(2) // Ensures 2 decimal places
      });
      
      // Reset only for new entries (preserves edit form state)
      if (!initialData) {
        setFormData(prev => ({ ...prev, 
          amount: '',
          description: '',
          category_id: ''
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-dark-800 p-6 rounded-lg border border-dark-700">
      {/* Amount Field */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Amount (Ksh)
        </label>
        <input
          type="number"
          name="amount"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
          disabled={loading}
        />
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
          disabled={loading}
        />
      </div>

      {/* Date Field */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]} // No future dates
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={loading}
        />
      </div>

      {/* Category Dropdown */}
      {categories?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Category
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={loading}
          >
            <option value="">Uncategorized</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md transition font-medium ${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary text-dark-900 hover:bg-opacity-90'
        }`}
        disabled={loading}
      >
        {loading ? 'Processing...' : initialData ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
}