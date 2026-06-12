import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUrlAnalytics } from '../services/urlService';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Globe, 
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const analyticsData = await getUrlAnalytics(id);
      setData(analyticsData);
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics details. Ensure the link belongs to your account.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Mobile':
        return <Smartphone size={14} class="text-indigo-400" />;
      case 'Tablet':
        return <Tablet size={14} class="text-purple-400" />;
      default:
        return <Laptop size={14} class="text-brand-400" />;
    }
  };

  if (loading && !data) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-slate-950">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="max-w-3xl mx-auto px-4 py-16 text-center">
        <div class="glass-panel p-8">
          <p class="text-red-400 font-semibold mb-4">{error}</p>
          <Link to="/" class="btn-primary inline-flex">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { url, analytics } = data;
  const shortUrl = `${window.location.origin}/${url.shortCode}`;

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
      {/* Back Button & Title */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div class="flex items-center gap-4">
          <Link 
            to="/" 
            class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 class="font-display font-bold text-2xl sm:text-3xl text-slate-100 flex items-center gap-2">
              Link Analytics
            </h1>
            <p class="text-sm text-slate-400 mt-1">Detailed performance tracking metrics for URL redirect</p>
          </div>
        </div>

        <button 
          onClick={fetchAnalytics}
          class="btn-secondary py-2 px-3 text-sm self-start sm:self-center flex items-center gap-1.5"
          disabled={loading}
        >
          <RefreshCw size={15} class={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* URL Meta Header Panel */}
      <div class="glass-panel p-6 mb-8 relative overflow-hidden">
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div class="flex flex-col md:flex-row justify-between gap-6">
          <div class="min-w-0 flex-grow">
            <span class="text-[10px] text-brand-400 font-bold tracking-widest uppercase block mb-1">Redirection Target</span>
            <a 
              href={shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              class="font-display font-bold text-xl sm:text-2xl text-slate-200 hover:text-brand-400 transition-colors inline-flex items-center gap-2"
            >
              /{url.shortCode}
              <ExternalLink size={16} class="opacity-50" />
            </a>
            <p class="text-slate-400 text-sm font-mono truncate max-w-full mt-2" title={url.originalUrl}>
              {url.originalUrl}
            </p>
          </div>

          <div class="flex flex-row md:flex-col items-start gap-4 text-xs text-slate-400 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 flex-shrink-0">
            <div class="flex items-center gap-2">
              <Calendar size={14} class="text-slate-500" />
              <div>
                <span class="block text-slate-500 text-[10px] uppercase font-bold">Created On</span>
                <span class="font-semibold text-slate-300">{new Date(url.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {url.expiresAt && (
              <div class="flex items-center gap-2">
                <Clock size={14} class="text-slate-500" />
                <div>
                  <span class="block text-slate-500 text-[10px] uppercase font-bold">Expires On</span>
                  <span class="font-semibold text-amber-400">{new Date(url.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render Charts */}
      <div class="mb-8">
        <AnalyticsCharts analytics={analytics} />
      </div>

      {/* Recent Activity Log Table */}
      {analytics.totalClicks > 0 && (
        <div class="glass-panel p-5 sm:p-6 overflow-hidden">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-display font-bold text-slate-200 text-lg">Recent Visits Log</h3>
            <span class="text-xs text-slate-500">Showing last 10 entries</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 font-medium">
                  <th class="py-3 px-4">Time</th>
                  <th class="py-3 px-4">Device</th>
                  <th class="py-3 px-4">Browser</th>
                  <th class="py-3 px-4">Referrer</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/40">
                {analytics.recentHistory?.map((visit, index) => (
                  <tr key={visit._id || index} class="hover:bg-slate-900/30 text-slate-300">
                    <td class="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                      {new Date(visit.timestamp).toLocaleString()}
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                      <span class="flex items-center gap-1.5">
                        {getDeviceIcon(visit.device)}
                        {visit.device || 'Desktop'}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                      {visit.browser || 'Unknown'}
                    </td>
                    <td class="py-3.5 px-4 font-mono text-xs text-slate-400 truncate max-w-[200px]" title={visit.referrer}>
                      {visit.referrer || 'Direct'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Analytics;
