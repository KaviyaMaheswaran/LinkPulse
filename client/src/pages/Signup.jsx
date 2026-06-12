import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, User, Mail, Lock, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Try using a different email.');
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
            Create an Account
          </h1>
          <p class="text-slate-400 text-sm mt-2">Get started with powerful URL shortening and analytics</p>
        </div>

        {/* Form Card */}
        <div class="glass-panel p-8 relative overflow-hidden">
          {/* Decorative design blur */}
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full bg-glow"></div>
          
          <form onSubmit={handleSubmit} class="space-y-5">
            {/* Full Name field */}
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User size={15} class="text-slate-400" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                class="input-field"
                disabled={loading}
                required
              />
            </div>

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

            {/* Password fields */}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock size={15} class="text-slate-400" />
                  Confirm
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  class="input-field"
                  disabled={loading}
                  required
                />
              </div>
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
                'Create Account'
              )}
            </button>
          </form>

          <div class="mt-6 text-center text-sm">
            <span class="text-slate-400">Already have an account? </span>
            <Link to="/login" class="text-brand-400 hover:text-brand-300 font-semibold transition-colors duration-200">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
