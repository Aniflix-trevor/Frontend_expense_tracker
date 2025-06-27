import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  // State management for form inputs and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth(); // From AuthContext
  const navigate = useNavigate();

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset previous errors
    
    try {
      await login(email, password); // AuthContext handles token storage
      navigate('/dashboard'); // Redirect on success
      // Note: Success toast is shown in AuthContext to avoid duplicate messages
    } catch (err) {
      // Error handling matches backend response format:
      // { message: "Invalid credentials" } or similar
      toast.error(err.message); // Global notification
      setError(err.message); // In-form error display
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-dark-800 rounded-lg shadow p-8 border border-dark-700">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Login</h2>
        
        {/* Error Display */}
        {error && (
          <p className="text-red-400 mb-4 text-center">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate> {/* noValidate for custom validation */}
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username" // Helps password managers
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())} // Trim whitespace
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={loading}
              aria-describedby="email-error" // Accessibility
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={loading}
              aria-describedby="password-error"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-dark-900 py-2 px-4 rounded-md hover:bg-opacity-90 transition font-medium disabled:opacity-70"
            disabled={loading}
            aria-busy={loading} // Accessibility loading state
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Signing In...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Registration Link */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Navigate to registration page"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

// Suggested spinner component (create separate file)
function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
  );
}