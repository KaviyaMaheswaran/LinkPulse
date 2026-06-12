import React, { useState, useEffect } from 'react';
import { getUrls, deleteUrl } from '../services/urlService';
import LinkForm from '../components/LinkForm';
import LinkCard from '../components/LinkCard';
import { Search, ListFilter, RotateCw, HelpCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user links
  const fetchUrls = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUrls();
      setUrls(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load links. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleUrlCreated = (newUrl) => {
    // Prepend the new URL to display it immediately at the top
    setUrls((prevUrls) => [newUrl, ...prevUrls]);
  };

  const handleDeleteUrl = async (id) => {
    if (window.confirm('Are you sure you want to delete this link and all its click statistics?')) {
      try {
        await deleteUrl(id);
        // Clean from local state instantly
        setUrls((prevUrls) => prevUrls.filter((url) => url._id !== id));
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete URL. Please try again.');
      }
    }
  };

  // Filter URLs based on search text (matches short code or original destination)
  const filteredUrls = urls.filter((url) => {
    const query = searchQuery.toLowerCase();
    return (
      url.shortCode.toLowerCase().includes(query) ||
      url.originalUrl.toLowerCase().includes(query) ||
      (url.customAlias && url.customAlias.toLowerCase().includes(query))
    );
  });

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create Form */}
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <LinkForm onUrlCreated={handleUrlCreated} />
          </div>
        </div>

        {/* Right Column: Link List */}
        <div class="lg:col-span-2">
          {/* Header Controls */}
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 class="font-display font-bold text-2xl text-slate-100">My Short Links</h1>
              <p class="text-sm text-slate-400 mt-1">Manage and audit your active redirection campaigns</p>
            </div>
            
            <button 
              onClick={fetchUrls}
              class="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors self-start sm:self-center"
              title="Refresh list"
            >
              <RotateCw size={16} class={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Search Bar */}
          <div class="glass-panel p-3 mb-6 flex items-center gap-3">
            <div class="relative flex-grow">
              <Search size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search short code or destination URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="w-full bg-slate-950/80 border border-slate-800/80 focus:border-brand-500/50 rounded-xl pl-10 pr-4 py-2 text-sm outline-none text-slate-200 transition-all"
              />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div class="flex items-center gap-2 p-4 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 mb-6">
              <AlertCircle size={20} class="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading States (Skeleton screen) */}
          {loading && urls.length === 0 ? (
            <div class="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} class="glass-card p-6 animate-pulse">
                  <div class="h-5 bg-slate-800 rounded w-1/4 mb-3"></div>
                  <div class="h-4 bg-slate-800/60 rounded w-3/4 mb-4"></div>
                  <div class="h-3 bg-slate-800/40 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredUrls.length > 0 ? (
            /* Link Cards List */
            <div class="space-y-4">
              {filteredUrls.map((url) => (
                <LinkCard 
                  key={url._id} 
                  url={url} 
                  onDelete={handleDeleteUrl} 
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div class="glass-panel p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div class="p-4 bg-slate-900/60 rounded-full border border-slate-800 text-slate-500 mb-4">
                <Search size={32} />
              </div>
              <h3 class="font-display font-semibold text-lg text-slate-200">
                {searchQuery ? 'No Matching Links Found' : 'No Short Links Created Yet'}
              </h3>
              <p class="text-sm text-slate-500 max-w-sm mt-2">
                {searchQuery 
                  ? "We couldn't find any URLs matching your search query. Try adjusting filters." 
                  : 'Get started by typing or pasting a long destination URL into the shortening card on the left.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
