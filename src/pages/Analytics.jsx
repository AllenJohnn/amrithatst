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
  BarChart,
  Bar,
} from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert } from 'lucide-react';
import {
  SCAN_TREND_DATA,
  THREAT_DISTRIBUTION_DATA,
  TARGETED_BRANDS_DATA,
} from '../data/dummyData';

const Analytics = () => {
  const customTooltipStyle = {
    backgroundColor: '#10192d',
    border: '1px solid #1a2740',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono',
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-cyber-green/30 bg-cyber-green/10 px-2.5 py-0.5 text-xs font-mono font-medium text-cyber-green">
            TELEMETRY & INTELLIGENCE
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <BarChart3 className="text-cyber-green" size={28} />
          Threat Analytics & Telemetry
        </h1>
        <p className="mt-1 text-xs text-cyber-muted">
          Aggregated heuristic trends, attack distributions, and Random Forest classifier evaluation metrics.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-5">
          <span className="text-xs text-cyber-dim font-mono block">MODEL ACCURACY</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyber-green">94.7%</span>
            <span className="text-xs text-cyber-muted">CV Score</span>
          </div>
          <p className="mt-1 text-[11px] text-cyber-dim">Evaluated across 40,000 URLs</p>
        </div>

        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-5">
          <span className="text-xs text-cyber-dim font-mono block">FALSE POSITIVE RATE</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">1.2%</span>
            <span className="text-xs text-cyber-green">Optimal</span>
          </div>
          <p className="mt-1 text-[11px] text-cyber-dim">Low benign blocking</p>
        </div>

        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-5">
          <span className="text-xs text-cyber-dim font-mono block">INFERENCE LATENCY</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyber-green">34ms</span>
            <span className="text-xs text-cyber-muted">avg</span>
          </div>
          <p className="mt-1 text-[11px] text-cyber-dim">Lexical token extraction</p>
        </div>

        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-5">
          <span className="text-xs text-cyber-dim font-mono block">FEATURE VECTORS</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">18</span>
            <span className="text-xs text-cyber-dim">Dimensions</span>
          </div>
          <p className="mt-1 text-[11px] text-cyber-dim">Entropy, TLD, lexical</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-cyber-green" />
              7-Day Detection Frequency
            </h3>
            <p className="text-xs text-cyber-muted">Total processed requests vs identified threats</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SCAN_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3366" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" />
                <XAxis dataKey="day" stroke="#4e6382" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#4e6382" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area type="monotone" dataKey="total" stroke="#00e5ff" strokeWidth={2} fill="url(#colorTotal)" name="Total Scans" />
                <Area type="monotone" dataKey="threats" stroke="#ff3366" strokeWidth={2} fill="url(#colorThreats)" name="Threats" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-cyber-green" />
              Verdict Distribution
            </h3>
            <p className="text-xs text-cyber-muted">Breakdown by threat classification</p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={THREAT_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {THREAT_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#070b14" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyber-border bg-cyber-card p-6">
        <h3 className="text-base font-bold text-white mb-4">Top Spoofed Target Brands</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TARGETED_BRANDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2740" />
              <XAxis dataKey="brand" stroke="#4e6382" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#4e6382" fontSize={11} fontFamily="JetBrains Mono" />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="attacks" fill="#00e5ff" radius={[6, 6, 0, 0]} name="Detected Attacks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
