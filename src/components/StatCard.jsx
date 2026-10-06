import React from 'react';
import { cn } from '../utils';

const StatCard = ({ icon, title, value, change, changeType = 'positive', subtext }) => {
  return (
    <div className="glass-panel glass-panel-hover group relative overflow-hidden rounded-xl p-5 flex flex-col justify-between">
      {/* Subtle corner glow */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-cyber-accent/5 blur-2xl transition-all duration-500 group-hover:bg-cyber-accent/10" />

      <div className="flex justify-between items-start mb-4">
        <div className="text-cyber-muted text-sm font-medium tracking-wide">
          {title}
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-dark border border-cyber-border/80 text-cyber-accent ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold tracking-tight text-cyber-white font-mono">
            {value}
          </h3>
          {change && (
            <span
              className={cn(
                "text-xs font-mono font-medium",
                changeType === 'positive' && "text-cyber-success",
                changeType === 'danger' && "text-cyber-danger",
                changeType === 'warning' && "text-cyber-warning"
              )}
            >
              {change}
            </span>
          )}
        </div>
        {subtext && (
          <p className="mt-1.5 text-[11px] text-cyber-dim uppercase tracking-wider font-mono">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
