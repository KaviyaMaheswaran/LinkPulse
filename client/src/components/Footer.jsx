import React from 'react';

const Footer = () => {
  return (
    <footer class="mt-auto border-t border-slate-900 bg-slate-950/40 py-6 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} LinkPulse URL Shortener & Analytics. Built with React & Node.js.</p>
      </div>
    </footer>
  );
};

export default Footer;
