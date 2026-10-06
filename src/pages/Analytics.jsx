import React from 'react';
import { motion } from 'framer-motion';
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
    backgroundColor: '#0D1321', // cyber-card
    border: '1px solid #1E293B', // cyber-border
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="pt-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded bg-cyber-cyan/10 px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider text-cyber-cyan border border-cyber-cyan/20 uppercase">
            TELEMETRY DASHBOARD
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <BarChart3 className="text-cyber-cyan" size={28} />
          Threat Analytics
        </h1>
        <p className="mt-1 text-sm text-cyber-muted max-w-2xl">
          Aggregated heuristic trends, attack distributions, and Random Forest classifier evaluation metrics.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MODEL ACCURACY", value: "94.7%", sub: "CV Score", desc: "Evaluated across 40k URLs", highlight: true },
          { label: "FALSE POSITIVE RATE", value: "1.2%", sub: "Optimal", desc: "Low benign blocking" },
          { label: "INFERENCE LATENCY", value: "34ms", sub: "avg", desc: "Lexical token extraction", highlight: true },
          { label: "FEATURE VECTORS", value: "18", sub: "Dims", desc: "Entropy, TLD, lexical" }
        ].map((metric, i) => (
          <div key={i} className="glass-panel glass-panel-hover rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-cyan/5 rounded-full blur-xl transition-all duration-500 group-hover:bg-cyber-cyan/10" />
            <span className="text-[10px] text-cyber-dim font-mono block tracking-wider uppercase font-bold">{metric.label}</span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-3xl font-bold font-mono tracking-tight ${metric.highlight ? 'text-cyber-cyan' : 'text-white'}`}>
                {metric.value}
              </span>
              <span className="text-xs text-cyber-muted font-mono">{metric.sub}</span>
            </div>
            <p className="mt-1.5 text-[11px] text-cyber-dim uppercase tracking-wider">{metric.desc}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                <TrendingUp size={16} className="text-cyber-cyan" />
                7-Day Detection Volume
              </h3>
              <p className="text-xs text-cyber-muted mt-1">Total requests vs identified threats</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SCAN_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="total" stroke="#00E5FF" strokeWidth={2} fill="url(#colorTotal)" name="Total Scans" />
                <Area type="monotone" dataKey="threats" stroke="#F43F5E" strokeWidth={2} fill="url(#colorThreats)" name="Threats" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
              <ShieldAlert size={16} className="text-cyber-cyan" />
              Verdict Distribution
            </h3>
            <p className="text-xs text-cyber-muted mt-1">Current state</p>
          </div>

          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={THREAT_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {THREAT_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white font-mono">{
                THREAT_DISTRIBUTION_DATA.reduce((acc, curr) => acc + curr.value, 0)
              }</span>
              <span className="text-[10px] text-cyber-muted font-mono uppercase tracking-wider">Total</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
            <Target size={16} className="text-cyber-cyan" />
            Top Spoofed Brands
          </h3>
          <p className="text-xs text-cyber-muted mt-1">Detected impersonation attempts</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TARGETED_BRANDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="brand" stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: '#ffffff', opacity: 0.05 }} />
              <Bar dataKey="attacks" fill="#00E5FF" radius={[4, 4, 0, 0]} name="Detected Attacks" barSize={40}>
                {TARGETED_BRANDS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#F43F5E' : index === 1 ? '#F59E0B' : '#00E5FF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
