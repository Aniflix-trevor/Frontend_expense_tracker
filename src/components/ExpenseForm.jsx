import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ExpenseForm({ onSubmit, categories, initialData }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category_id: ''
  });
  const [loading, setLoading] = useState(false);

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    setFormData({
      amount: initialData?.amount || '',
      description: initialData?.description || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      category_id: initialData?.category?.id || ''
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
        amount: parseFloat(formData.amount).toFixed(2) // Ensure 2 decimal places
      });
      
      // Only reset if not in edit mode
      if (!initialData) {
        setFormData({
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          category_id: ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-dark-800 p-6 rounded-lg border border-dark-700">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Amount ($)
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
        />
      </div>

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
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {categories && categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Category
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
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