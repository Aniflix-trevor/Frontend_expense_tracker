import { TrashIcon } from '@heroicons/react/outline';

export default function CategoryList({ categories, onDelete }) {
  // Empty state handling - matches CategoryForm's creation flow
  if (categories.length === 0) {
    return (
      <div className="text-center py-4 text-text-secondary">
        No categories found. Add your first category!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map(category => (
        <div 
          key={category.id} // Critical for React reconciliation
          className="flex justify-between items-center bg-dark-800 p-3 rounded-lg 
                    border border-dark-700 hover:bg-dark-750 transition-colors"
        >
          {/* Category Name - Matches ExpenseForm's dropdown options */}
          <span className="font-medium text-text-primary">
            {category.name}
          </span>
          
          {/* Delete Button - Connects to categoryService.deleteCategory() */}
          <button
            onClick={() => onDelete(category.id)}
            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition"
            aria-label={`Delete ${category.name}`} // Enhanced accessibility
            disabled={category.isDeleting} // Optional: Add during API ops
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}