import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CategoryForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(name);
      setName('');
      toast.success('Category created successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-dark-800 p-4 rounded-lg border border-dark-700">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Category Name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. Groceries"
            required
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-md transition font-medium ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
}