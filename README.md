
# Expense Tracker API + Frontend Spec

##  Frontend Setup
**Tech Stack:**
- React + Vite
- Tailwind CSS (Dark theme)
- React Router
- Axios (API calls)
- React Toastify (Notifications)
- Heroicons (v1)

**File Structure:**

src/
├── api/ # API service clients
│ ├── expenseService.js
│ └── categoryService.js
├── components/ # Reusable UI
│ ├── ExpenseForm.jsx
│ ├── ExpenseList.jsx
│ ├── CategoryForm.jsx
│ └── CategoryList.jsx
├── contexts/ # Global state
│ └── AuthContext.jsx
├── pages/ # Main views
│ ├── Dashboard.jsx
│ ├── Login.jsx
│ └── Register.jsx
└── App.jsx # Root component
text


##  Key Frontend Packages
```bash
# Core
react react-dom react-router-dom
axios @heroicons/react

# UI/UX
tailwindcss react-toastify

 ## Frontend Features

    Auth Flow

        JWT storage & protected routes

        Login/Register forms with validation

    Expense Management

        CRUD operations with categories

        Real-time balance calculation

    Category System

        Create/delete categories

        Protection for in-use categories

 ## Backend API Requirements

(Condensed version of previous spec)
Essential Endpoints
Method	Endpoint	Body	Returns
POST	/auth/login	{email, password}	{token, user}
POST	/expenses	{amount, description, date, category_id}	Created expense
DELETE	/categories/:id	-	204 or 400 error
# Expense Tracker API - Core Requirements

## Authentication
- `POST /auth/register`  
  Required: `email`, `password`, `full_name`  
  Returns: `{token, user}`

- `POST /auth/login`  
  Required: `email`, `password`  
  Returns: `{token, user}`

## Expenses
- `GET /expenses`  
  Returns: `[{id, amount, description, date, category}]`

- `POST /expenses`  
  Required: `amount`, `description`, `date`, `category_id`  
  Returns: Created expense

- `PUT /expenses/:id`  
  Updates expense, returns updated record

- `DELETE /expenses/:id`  
  Returns: 204 (No Content)

## Categories
- `GET /categories`  
  Returns: `[{id, name}]`

- `POST /categories`  
  Required: `name`  
  Returns: Created category

- `DELETE /categories/:id`  
  Fails if category has expenses  
  Returns: 204 or 400 error

## Rules
1. All routes (except auth) need:  
   `Authorization: Bearer <token>`
2. Amounts as strings with 2 decimals (e.g., "15.50")
3. Dates in ISO format (YYYY-MM-DD)
4. Errors return:  
   `{error: string, details?: object}`

## Sample Expense
```json
{
  "id": 1,
  "amount": "29.99",
  "description": "Dinner",
  "date": "2025-06-20",
  "category": {"id": 1, "name": "Food"}
}    
