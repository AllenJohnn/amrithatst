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
import { BarChart3, TrendingUp, ShieldAlert, Target } from 'lucide-react';
import {
  SCAN_TREND_DATA,
  THREAT_DISTRIBUTION_DATA,
  TARGETED_BRANDS_DATA,
} from '../data/dummyData';

const Analytics = () => {
  const customTooltipStyle = {
    backgroundColor: '#0D0F12', // cyber-dark
    border: '1px solid #23272D', // cyber-border
    borderRadius: '6px',
    color: '#F1F2F4', // white
    fontSize: '11px',
    fontFamily: 'JetBrains Mono',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    padding: '8px 12px'
  };

  // Muted semantic colors corresponding to tailwind config
  const COLORS = {
    total: '#8799B5',    // blue/info
    threats: '#C87878',  // danger
    phishing: '#C87878',
    suspicious: '#C6A86A',
    safe: '#7FA889'
  };

  const threatDistribution = THREAT_DISTRIBUTION_DATA.map(item => {
    let color = COLORS.safe;
    if (item.name === 'Phishing') color = COLORS.phishing;
    if (item.name === 'Suspicious') color = COLORS.suspicious;
    return { ...item, color };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium text-white flex items-center gap-2">
          <BarChart3 className="text-cyber-muted" size={20} />
          Telemetry
        </h1>
        <p className="mt-1 text-sm text-cyber-muted">
          Aggregated heuristic trends and threat distribution metrics.
        </p>
      </div>

      <div className="flex overflow-hidden rounded-lg border border-cyber-border bg-cyber-dark divide-x divide-cyber-border">
        {[
          { label: "MODEL ACCURACY", value: "94.7%", sub: "CV Score" },
          { label: "FALSE POSITIVE RATE", value: "1.2%", sub: "Optimal" },
          { label: "INFERENCE LATENCY", value: "34ms", sub: "avg" },
          { label: "FEATURE VECTORS", value: "18", sub: "Dims" }
        ].map((metric, i) => (
          <div key={i} className="flex-1 p-4">
            <span className="text-[10px] text-cyber-muted font-medium uppercase tracking-wider block mb-2">{metric.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-medium text-white font-mono tracking-tight">{metric.value}</span>
              <span className="text-[10px] text-cyber-dim uppercase">{metric.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-cyber-border bg-cyber-dark p-5 lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-cyber-muted" />
              7-Day Detection Volume
            </h3>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SCAN_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.total} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={COLORS.total} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.threats} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={COLORS.threats} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#23272D" vertical={false} />
                <XAxis dataKey="day" stroke="#656B74" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#656B74" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#2D323A', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="total" stroke={COLORS.total} strokeWidth={2} fill="url(#colorTotal)" name="Total Scans" />
                <Area type="monotone" dataKey="threats" stroke={COLORS.threats} strokeWidth={2} fill="url(#colorThreats)" name="Threats" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-cyber-border bg-cyber-dark p-5">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <ShieldAlert size={16} className="text-cyber-muted" />
              Verdict Distribution
            </h3>
          </div>

          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} itemStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-xl font-medium text-white font-mono">{
                threatDistribution.reduce((acc, curr) => acc + curr.value, 0)
              }</span>
              <span className="text-[10px] text-cyber-muted font-medium uppercase tracking-wider">Total</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {threatDistribution.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-cyber-muted">{item.name}</span>
                </div>
                <span className="text-white font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-cyber-border bg-cyber-dark p-5">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Target size={16} className="text-cyber-muted" />
            Top Spoofed Brands
          </h3>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TARGETED_BRANDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#23272D" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#656B74" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
              <YAxis dataKey="brand" type="category" stroke="#A0A5AE" fontSize={11} tickLine={false} axisLine={false} width={100} />
              <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: '#16191E' }} />
              <Bar dataKey="attacks" fill={COLORS.total} radius={[0, 4, 4, 0]} name="Attacks" barSize={20}>
                {TARGETED_BRANDS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.threats : index === 1 ? COLORS.suspicious : COLORS.total} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
