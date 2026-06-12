import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Link2, ShieldAlert } from 'lucide-react';

const Redirect = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    if (shortCode) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
      // Strip '/api' from the endpoint to get the server base root URL
      const serverUrl = apiBase.replace(/\/api$/, '');
      
      // Perform the browser redirect to the server's redirect endpoint
      window.location.href = `${serverUrl}/${shortCode}`;
    }
  }, [shortCode]);

  return (
    <div class="flex-grow flex flex-col items-center justify-center px-4 text-center bg-slate-950">
      <div class="max-w-md w-full flex flex-col items-center">
        {/* Animated Loading Spin Ring */}
        <div class="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full border-4 border-slate-900"></div>
          <div class="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
          <Link2 size={32} class="text-brand-400 rotate-45 animate-pulse" />
        </div>

        <h1 class="font-display font-bold text-2xl text-slate-100 mb-2">
          Redirecting you...
        </h1>
        <p class="text-slate-400 text-sm max-w-xs leading-relaxed mb-6">
          Resolving short code <span class="text-brand-400 font-mono font-bold">/{shortCode}</span>. Please wait a moment while we process your click.
        </p>

        {/* Action link in case it gets stuck */}
        <span class="text-xs text-slate-600">
          Stuck? You can try opening the link{' '}
          <a
            href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5050/api').replace(/\/api$/, '')}/${shortCode}`}
            class="text-brand-500 hover:text-brand-400 font-medium underline"
          >
            directly here
          </a>.
        </span>
      </div>
    </div>
  );
};

export default Redirect;
