import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock } from 'lucide-react';

function Login() {
  // Determine backend URL based on host
  let URL: string;
  if (window.location.host === "ppub-iqventory.web.app") {
    URL = "future urls";
  } else {
    URL = "http://localhost:5001/";
  }

  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);

  // Use "client" or "student" as needed; here we use "client" per backend logic.
  const [role, setRole] = useState<'client' | 'admin'>('client');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // Determine where to navigate after login
  const from = location.state?.from || (role === 'admin' ? '/admin/dashboard' : '/dashboard');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, password: formData.password, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      setUser(result.user);
      navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-md mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Please enter your details to continue</p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Role Selection */}
          <div className="block mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Login as</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  role === 'client'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  role === 'admin'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>

          <button
            onClick={handleRegister}
            className="w-full mt-4 text-indigo-600 border px-6 py-3 rounded-md text-lg font-semibold hover:text-indigo-450 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
