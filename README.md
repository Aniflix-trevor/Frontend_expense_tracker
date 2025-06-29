
# ExpenseWise: Your Personal Financial Tracker

![ExpenseWise Hero Image](public/images/01000000-0aff-0242-0b7d-08dbae85de45_w1080_h608.avif)
*A captivating hero image of the ExpenseWise landing page.*

## Overview

**ExpenseWise** is an intuitive and sleek web application designed to help you effortlessly manage your personal finances. Keep track of your spending, categorize your expenses, and gain valuable insights into your financial habits with a clean, user-friendly interface. Whether you're planning a budget, monitoring daily outgoings, or simply want a clearer picture of where your money goes, ExpenseWise provides the tools you need to take control.

Built with modern web technologies, ExpenseWise offers a responsive and efficient experience, making expense tracking simple and accessible.

## Features

* **User Authentication:** Secure registration and login functionalities to protect your financial data.
* **Interactive Dashboard:** A centralized hub to view your total expenses and manage your financial entries and categories.
* **Expense Management:**
    * **Add Expenses:** Easily record new expenditures with details like amount, description, date, and category.
    * **View Expenses:** See a clear list of all your recorded expenses.
    * **Edit Expenses:** Modify existing expense details as needed.
    * **Delete Expenses:** Remove unwanted entries.
* **Category Management:**
    * **Create Categories:** Organize your spending by custom categories (e.g., "Groceries", "Utilities", "Entertainment").
    * **View Categories:** A dedicated section to manage all your custom spending categories.
    * **Delete Categories:** Remove categories when they are no longer needed.
* **Responsive Design:** Optimized for a seamless experience across various devices and screen sizes.
* **Modern UI:** A dark-themed interface with smooth animations for a pleasant user experience.

## Technologies Used

### Frontend

* **React:** A powerful JavaScript library for building dynamic and interactive user interfaces.
* **Vite:** A next-generation frontend tooling that provides an incredibly fast development experience.
* **Tailwind CSS:** A highly customizable, utility-first CSS framework for rapidly building custom designs.
* **React Router:** For declarative routing within the application, enabling navigation between different pages without full page reloads.
* **React Toastify:** A popular library for adding beautiful and customizable notifications.
* **Axios / Fetch API:** For making HTTP requests to the backend API.

### Backend

* **Flask:** A lightweight and powerful Python web framework.
* **Flask-SQLAlchemy:** An ORM (Object-Relational Mapper) for interacting with databases.
* **SQLite:** A lightweight, file-based database used for development.
* **Flask-CORS:** For handling Cross-Origin Resource Sharing.
* **Pipenv:** For dependency management.

## File Structures

### Frontend File Structure

FRONTEND_EXPENSE_TRACKER/
├── public/ # Static assets (images, favicon)
│   ├── images/
│   │   ├── 01000000-0aff-0242-0b7d-08dbae85de45_w1080_h608.avif # Homepage background image
│   │   └── vite.svg
├── src/
│   ├── api/ # API service calls and helpers
│   │   ├── categoryService.js  # Functions for interacting with category API endpoints
│   │   └── expenseService.js   # Functions for interacting with expense API endpoints
│   ├── components/ # Reusable UI components
│   │   ├── CategoryForm.jsx
│   │   ├── CategoryList.jsx
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   └── Footer.jsx          # Application-wide footer component
│   ├── contexts/ # React Context API for global state management
│   │   └── AuthContext.jsx     # Manages user authentication state (login, logout, token)
│   ├── pages/ # Top-level page components, directly corresponding to routes
│   │   ├── Dashboard.jsx       # Main user dashboard to manage expenses and categories
│   │   ├── Home.jsx            # The public landing page
│   │   ├── Login.jsx           # User login page
│   │   └── Register.jsx        # User registration page
│   ├── App.css
│   ├── App.jsx             # Root application component, handles global layout and routing
│   ├── index.css           # Global TailwindCSS directives and custom styles
│   ├── main.jsx            # Entry point for the React application, sets up providers (BrowserRouter, AuthProvider)
│   └── Routes.jsx          # Centralized routing configuration using React Router
├── .env                    # Environment variables (e.g., VITE_API_BASE_URL)
├── .gitignore              # Files/folders to ignore in Git version control
├── eslint.config.js        # ESLint configuration for code linting
├── index.html              # Main HTML file for the React app
├── package-lock.json       # Records exact dependency versions for reproducible builds
├── package.json            # Project metadata and script commands
├── postcss.config.js       # PostCSS configuration for Tailwind CSS processing
├── README.md               # Project documentation (this file!)
├── tailwind.config.js      # Tailwind CSS configuration for custom themes, colors, etc.
└── vite.config.js          # Vite build configuration


### Backend File Structure

EXPENSE_TRACKER_BACKEND/
├── instance/ # Local database files
│   └── expense_tracker.db  # SQLite database file (automatically created if not present)
├── migrations/ # Database migration scripts (managed by Flask-Migrate/Alembic)
├── resources/ # API resource definitions using Flask-RESTful
│   ├── categories.py       # API endpoints for managing expense categories
│   ├── entries.py          # API endpoints for managing individual expense entries
│   └── users.py            # API endpoints for user authentication (registration, login)
├── .gitignore
├── add_user.py             # Script to add test users (optional, for development seeding)
├── app.py                  # Main Flask application instance and core configuration
├── config.py               # Application configuration settings (e.g., database URI)
├── extensions.py           # Flask extensions setup (e.g., SQLAlchemy, CORS initialization)
├── models.py               # SQLAlchemy database models (User, Category, Entry definitions)
├── Pipfile                 # Pipenv dependency definitions (what your project needs)
├── Pipfile.lock            # Locked Pipenv dependencies (exact versions for reproducibility)
└── requirements.txt        # List of Python dependencies (can be generated from Pipfile.lock)

## Getting Started (For Developers)

To set up ExpenseWise locally, you'll need both the frontend and backend running.

### Prerequisites

* Node.js (LTS version recommended)
* npm (Node Package Manager) or Yarn
* Python 3.8+
* pipenv (Python package installer)

### 1. Backend Setup

1.  **Clone the backend repository:**
    ```bash
    git clone  [https://github.com/Aniflix-trevor/expense_tracker_backend](https://github.com/Aniflix-trevor/expense_tracker_backend) <----  backend repo URL
    cd backend_expense_tracker
    ```

2.  **Install Python dependencies:**
    ```bash
    pipenv install
    ```

3.  **Activate Pipenv shell:**
    ```bash
    pipenv shell
    ```

4.  **Initialize and Migrate the Database:**
    * **Crucial Step for Cloned Repositories:** If you've just cloned the repository, your local database file (`instance/expense_tracker.db`) might be missing or out of sync with the latest schema. You might encounter errors like `"no such column: entries.amount"` if the database is not properly set up.
    * **Option A: Using Flask-Migrate (Recommended)**
        ```bash
        flask db init       # Initialize migrations (only first time)
        flask db migrate -m "Initial migration" # Create migration script
        flask db upgrade    # Apply migrations to the database
        ```
    * **Option B: Delete and Recreate Database (Development Only!)**
        If you encounter issues with migrations or prefer a fresh start (losing all existing data):
        ```bash
        rm instance/expense_tracker.db # DANGER: This deletes your database file!
        python -c "from app import create_app, db; app = create_app(); with app.app_context(): db.create_all()"
        ```
        (Adjust `from app import create_app, db` to match where your `create_app` function and `db` instance are defined if different, e.g., `from run import app, db`)

5.  **Run the Flask backend server:**
    ```bash
    flask run --port 5555
    ```
    The backend API will be running at `http://127.0.0.1:5555`.

### 2. Frontend Setup

1.  **Clone the frontend repository:**
    ```bash
    git clone [https://github.com/nakutakaa/Frontend_expense_tracker](https://github.com/nakutakaa/Frontend_expense_tracker)<--- # frontend  repo URL
    cd Frontend_expense_tracker
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install 
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the `Frontend_expense_tracker` directory. This file should contain the base URL for your backend API.
    ```env
    VITE_API_BASE_URL=[http://127.0.0.1:5555](http://127.0.0.1:5555) # Make sure this matches your backend's running port
    ```
    * **Important:** This file is crucial for your frontend to communicate with the backend and is typically **excluded from Git version control (`.gitignore`)**. If you clone the repository, you'll need to create this file manually.

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The application will typically be accessible at `http://localhost:5173`.

## Screenshots

*A visual tour of ExpenseWise.*

### Homepage
![ExpenseWise Landing Page](Screenshot%20from%202025-06-29%2001-35-29.png)
*The welcoming entry point to the application, setting the stage for financial control.*

### Login Page
![ExpenseWise Login Page](Screenshot%20from%202025-06-29%2000-46-45.png)
*Secure access to your personal expense dashboard.*

### Register Page
![ExpenseWise Register Page](Screenshot%20from%202025-06-29%2000-46-51.png)
*Sign up quickly to start tracking your finances.*

### Dashboard (Expenses View)
![ExpenseWise Dashboard - Expenses Tab](Screenshot%20from%202025-06-29%2000-46-26.png)
*Your main hub for adding, viewing, and managing individual expenses.*

### Dashboard (Categories View)
![ExpenseWise Dashboard - Categories Tab](Screenshot%20from%202025-06-29%2000-46-32.png)
*Organize your spending by creating and managing custom categories.*

## Future Enhancements (Ideas)

* **Data Visualization:** Charts and graphs to visually represent spending patterns.
* **Filtering and Sorting:** Advanced options to filter expenses by date range, category, or amount.
* **Recurring Expenses:** Mark expenses as recurring for easier tracking of regular bills.
* **Budgeting Tools:** Set budgets for different categories and track progress.
* **Search Functionality:** Quickly find specific expenses or categories.

## Contributing

Contributions are welcome! If you have ideas for new features, improvements, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Developed by some group Niggas.
Feel free to connect or ask any questions!