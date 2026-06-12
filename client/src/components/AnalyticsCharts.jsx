import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { Monitor, Smartphone, Tablet, BarChart3, HelpCircle } from 'lucide-react';

const COLORS = ['#0ea5e9', '#6366f1', '#a855f7', '#f43f5e', '#10b981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div class="bg-slate-900/90 border border-slate-800 p-3 rounded-lg backdrop-blur-md shadow-lg">
        <p class="text-xs text-slate-400 font-semibold">{label}</p>
        <p class="text-sm font-bold text-brand-400 mt-1">
          {payload[0].value} {payload[0].value === 1 ? 'click' : 'clicks'}
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsCharts = ({ analytics }) => {
  const { totalClicks, dailyTrend, deviceStats, browserStats } = analytics;

  const hasVisits = totalClicks > 0;

  if (!hasVisits) {
    return (
      <div class="glass-panel p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
        <div class="p-4 bg-slate-900/60 rounded-full border border-slate-800 text-slate-500 mb-4 animate-pulse">
          <BarChart3 size={36} />
        </div>
        <h3 class="font-display font-semibold text-lg text-slate-200">No Data Available Yet</h3>
        <p class="text-sm text-slate-500 max-w-sm mt-2">
          This URL hasn't received any visits yet. Share your short link with others, and you'll see real-time analytics graphs here!
        </p>
      </div>
    );
  }

  // Find dominant device
  const getDominantDevice = () => {
    let max = -1;
    let dominant = 'N/A';
    deviceStats.forEach(d => {
      if (d.value > max) {
        max = d.value;
        dominant = d.name;
      }
    });
    return dominant;
  };

  return (
    <div class="space-y-8">
      {/* Overview Cards Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="glass-panel p-5 relative overflow-hidden">
          <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Clicks</span>
          <span class="text-3xl font-display font-bold text-slate-100 mt-2 block">{totalClicks}</span>
          <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-brand-500/10 rounded-full blur-xl"></div>
        </div>

        <div class="glass-panel p-5 relative overflow-hidden">
          <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Primary Device Type</span>
          <span class="text-3xl font-display font-bold text-indigo-400 mt-2 block">{getDominantDevice()}</span>
          <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
        </div>

        <div class="glass-panel p-5 relative overflow-hidden">
          <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Recent Activity Tracked</span>
          <span class="text-3xl font-display font-bold text-purple-400 mt-2 block">
            {analytics.recentHistory?.length || 0} <span class="text-xs font-sans font-normal text-slate-500">logged</span>
          </span>
          <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Main Trend Line Chart */}
      <div class="glass-panel p-5 sm:p-6">
        <h3 class="font-display font-bold text-slate-200 text-lg mb-6">Daily Clicks Trend (Last 7 Days)</h3>
        <div class="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '11px' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="clicks" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown grids (Pie + Bar) */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Breakdown */}
        <div class="glass-panel p-5 sm:p-6 flex flex-col">
          <h3 class="font-display font-bold text-slate-200 text-lg mb-6">Device Distribution</h3>
          <div class="h-[250px] w-full flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceStats.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  formatter={(value, entry) => {
                    const stat = deviceStats.find(d => d.name === value);
                    return <span class="text-xs text-slate-400 font-medium">{value} ({stat?.value || 0})</span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Browser Breakdown */}
        <div class="glass-panel p-5 sm:p-6 flex flex-col">
          <h3 class="font-display font-bold text-slate-200 text-lg mb-6">Browser Breakdown</h3>
          <div class="h-[250px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={browserStats.filter(d => d.value > 0)} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '11px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '11px' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                  itemStyle={{ color: '#6366f1', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {browserStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
