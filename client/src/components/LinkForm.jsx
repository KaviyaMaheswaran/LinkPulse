import React, { useState } from 'react';
import { createUrl } from '../services/urlService';
import confetti from 'canvas-confetti';
import { Link2, Sparkles, Calendar, Fingerprint, AlertCircle, CheckCircle2 } from 'lucide-react';

const LinkForm = ({ onUrlCreated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setCreatedLink(null);

    if (!originalUrl) {
      setError('Please provide a long URL');
      return;
    }

    setLoading(true);
    try {
      const payload = { originalUrl };
      if (customAlias.trim()) payload.customAlias = customAlias.trim();
      if (expiresAt) payload.expiresAt = expiresAt;

      const data = await createUrl(payload);
      
      // Reset form fields
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresAt('');
      
      setSuccess(true);
      setCreatedLink(data);
      
      // Trigger canvas-confetti for visually stunning feedback!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#6366f1', '#a855f7']
      });

      // Call dashboard update callback
      if (onUrlCreated) {
        onUrlCreated(data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdLink) return;
    const shortUrl = `${window.location.origin}/${createdLink.shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    // Visual indicator on copy
    const copyBtn = document.getElementById('success-copy-btn');
    if (copyBtn) {
      copyBtn.innerText = 'Copied!';
      setTimeout(() => {
        copyBtn.innerText = 'Copy';
      }, 2000);
    }
  };

  return (
    <div class="glass-panel p-6 sm:p-8 mb-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-brand-500 rounded-full bg-glow"></div>
      
      <h2 class="font-display font-bold text-xl sm:text-2xl text-slate-100 mb-6 flex items-center gap-2">
        <Sparkles class="text-brand-400" size={24} />
        Shorten a New Link
      </h2>

      <form onSubmit={handleSubmit} class="space-y-5">
        {/* Long URL Input */}
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Link2 size={16} class="text-slate-400" />
            Destination URL
          </label>
          <input
            type="text"
            placeholder="https://example.com/very/long/destination/url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            class="input-field"
            disabled={loading}
          />
        </div>

        {/* Custom Alias & Expiration Date (Responsive side-by-side) */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Fingerprint size={16} class="text-slate-400" />
              Custom Alias (Optional)
            </label>
            <input
              type="text"
              placeholder="my-cool-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              class="input-field"
              disabled={loading}
            />
            <span class="text-[10px] text-slate-500 mt-1 block">Alphanumeric, dashes, and underscores only.</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar size={16} class="text-slate-400" />
              Expiration Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              class="input-field"
              disabled={loading}
              min={new Date().toISOString().slice(0, 16)}
            />
            <span class="text-[10px] text-slate-500 mt-1 block">Leave empty for no expiration.</span>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div class="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 text-sm">
            <AlertCircle size={18} class="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          class="w-full btn-primary h-12"
          disabled={loading}
        >
          {loading ? (
            <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-slate-200"></div>
          ) : (
            'Shorten Link'
          )}
        </button>
      </form>

      {/* Success Modal/Panel inside card */}
      {success && createdLink && (
        <div class="mt-6 p-5 rounded-xl bg-brand-950/30 border border-brand-500/20 animate-fadeIn">
          <div class="flex items-start gap-3">
            <CheckCircle2 class="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
            <div class="flex-grow">
              <h3 class="font-semibold text-slate-200 text-sm sm:text-base">Link successfully created!</h3>
              <p class="text-xs text-slate-400 mt-1 truncate">
                Original: {createdLink.originalUrl}
              </p>
              
              {/* Short Link Output Grid */}
              <div class="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/${createdLink.shortCode}`}
                  class="flex-grow text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 outline-none text-brand-400 font-mono"
                />
                <button
                  id="success-copy-btn"
                  onClick={handleCopy}
                  class="bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all duration-200 active:scale-95"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkForm;
