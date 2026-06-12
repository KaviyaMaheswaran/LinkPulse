import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link2, AlertTriangle, ArrowRight } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('error') === 'expired';

  return (
    <div class="flex-grow flex items-center justify-center px-4 py-16 text-center">
      <div class="max-w-md w-full">
        {/* Animated Warning Icon */}
        <div class="inline-flex p-4 rounded-3xl bg-amber-500/10 text-amber-400 mb-6 animate-bounce">
          <AlertTriangle size={48} />
        </div>

        {/* Dynamic header depending on error code */}
        {isExpired ? (
          <>
            <h1 class="font-display font-bold text-3xl sm:text-4xl text-slate-100 mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Link Expired
            </h1>
            <p class="text-slate-400 text-base mb-8 leading-relaxed">
              The short link campaign you are trying to access has passed its expiration date and is no longer active.
            </p>
          </>
        ) : (
          <>
            <h1 class="font-display font-bold text-3xl sm:text-4xl text-slate-100 mb-4 bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
              Page Not Found
            </h1>
            <p class="text-slate-400 text-base mb-8 leading-relaxed">
              We couldn't find the page or shortened link campaign you were looking for. It may have been deleted.
            </p>
          </>
        )}

        {/* Buttons Panel */}
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
          <Link to="/" class="btn-primary">
            Go to Dashboard
            <ArrowRight size={16} />
          </Link>
          <Link to="/login" class="btn-secondary">
            Sign In
          </Link>
        </div>

        {/* Decorative Brand Text */}
        <div class="mt-12 text-slate-600 flex items-center justify-center gap-1.5 text-xs">
          <Link2 size={12} class="rotate-45" />
          <span class="font-display font-semibold tracking-wider uppercase">LinkPulse</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
