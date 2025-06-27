import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  // Form state management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState(''); // For displaying form errors
  const { register, loading } = useAuth(); // From AuthContext
  const navigate = useNavigate(); // For post-registration redirect

  // Handles input changes and updates form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset previous errors
    
    try {
      await register(formData); // Calls AuthContext's register function
      // Note: Success toast is handled in AuthContext to allow for redirect timing control
      navigate('/dashboard'); // Redirect on success
    } catch (err) {
      // Error handling (from AuthContext or API)
      toast.error(err.message); // Display error toast
      setError(err.message); // Set error for inline display
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      {/* Registration Card */}
      <div className="w-full max-w-md bg-dark-800 rounded-lg shadow p-8 border border-dark-700">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Register</h2>
        
        {/* Error Display */}
        {error && (
          <p className="text-red-400 mb-4 text-center">
            {error}
          </p>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Field */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-text-secondary mb-1">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={loading}
              aria-describedby="name-help"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={loading}
              aria-describedby="email-help"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              Password (min 6 characters)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={loading}
              aria-describedby="password-help"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-dark-900 py-2 px-4 rounded-md hover:bg-opacity-90 transition font-medium disabled:opacity-70"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}