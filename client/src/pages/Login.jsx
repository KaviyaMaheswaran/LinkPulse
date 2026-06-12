import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex-grow flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        {/* Brand Header */}
        <div class="text-center mb-8 flex flex-col items-center">
          <div class="p-3 rounded-2xl bg-brand-500/10 text-brand-400 mb-3 animate-pulse">
            <Link2 size={32} class="rotate-45" />
          </div>
          <h1 class="font-display font-bold text-3xl tracking-tight bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p class="text-slate-400 text-sm mt-2">Sign in to manage your premium short links</p>
        </div>

        {/* Form Card */}
        <div class="glass-panel p-8 relative overflow-hidden">
          {/* Decorative design blur */}
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full bg-glow"></div>
          
          <form onSubmit={handleSubmit} class="space-y-6">
            {/* Email field */}
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail size={15} class="text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                class="input-field"
                disabled={loading}
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock size={15} class="text-slate-400" />
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                class="input-field"
                disabled={loading}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div class="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 text-sm">
                <AlertCircle size={18} class="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              class="w-full btn-primary h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-slate-200"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div class="mt-6 text-center text-sm">
            <span class="text-slate-400">Don't have an account? </span>
            <Link to="/signup" class="text-brand-400 hover:text-brand-300 font-semibold transition-colors duration-200">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
