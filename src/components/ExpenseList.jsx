import { PencilIcon, TrashIcon } from "@heroicons/react/outline";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  // Empty state - matches Dashboard's "Add Expense" CTA
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        No expenses found. Add your first expense!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Table Structure - Optimized for dark theme */}
      <table className="min-w-full divide-y divide-dark-700">
        <thead className="bg-dark-800">
          <tr>
            {/* Column Headers */}
            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-dark-900 divide-y divide-dark-800">
          {expenses.map((expense) => (
            <tr 
              key={expense.id} // Critical for React performance
              className="hover:bg-dark-800 transition-colors duration-150"
            >
              {/* Date Cell - Localized formatting */}
              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                {new Date(expense.date).toLocaleDateString()}
              </td>

              {/* Description Cell */}
              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                {expense.description}
              </td>

              {/* Amount Cell - Ensures 2 decimal places */}
              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                ${parseFloat(expense.amount).toFixed(2)}
              </td>

              {/* Category Cell - Color-coded badge */}
              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                <span 
                  className={`px-2 py-1 rounded-full text-xs ${
                    expense.category 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {expense.category?.name || 'Uncategorized'}
                </span>
              </td>

              {/* Action Buttons */}
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {/* Edit Button - Triggers ExpenseForm population */}
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-900/20 transition"
                    aria-label={`Edit ${expense.description}`}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  {/* Delete Button - Calls expenseService.deleteExpense() */}
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition"
                    aria-label={`Delete ${expense.description}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}