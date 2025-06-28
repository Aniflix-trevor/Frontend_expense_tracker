// App.jsx
import { AppRoutes } from './Routes'; // Centralized route configuration
import Footer from './components/Footer'; // <--- NEW: Import your Footer component
import { ToastContainer } from 'react-toastify'; // Import ToastContainer here if not in main.jsx

const App = () => {
  return (
    // <div className="min-h-screen flex flex-col"> ensures the footer sticks to the bottom
    <div className="min-h-screen flex flex-col bg-dark-900">
      {/* The 'main' element uses flex-grow to push the footer to the bottom */}
      <main className="flex-grow">
        <AppRoutes /> {/* Handles all route rendering and navigation logic */}
      </main>

      <Footer /> {/* Render the Footer component */}

      {/* ToastContainer remains here if you prefer it here, or can be in main.jsx */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;