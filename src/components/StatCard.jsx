import React from 'react';

const StatCard = ({ icon, title, value, change, changeType = 'positive', subtext }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-cyber-border/90 bg-cyber-card/80 backdrop-blur-md p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-glow">
      {/* Ambient background soft glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-500/5 blur-2xl transition-all group-hover:bg-cyan-500/10" />

      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        {change && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-mono font-medium ${
              changeType === 'positive'
                ? 'bg-cyber-mint/10 text-emerald-300 border border-cyber-mint/20'
                : changeType === 'danger'
                ? 'bg-cyber-danger/10 text-rose-300 border border-cyber-danger/20'
                : 'bg-cyber-warning/10 text-amber-300 border border-cyber-warning/20'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-cyber-muted font-mono">
          {title}
        </p>
        <h3 className="mt-1.5 text-3xl font-black tracking-tight text-white font-mono">
          {value}
        </h3>
        {subtext && (
          <p className="mt-1 text-xs text-cyber-dim">{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
