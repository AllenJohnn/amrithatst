import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

const ThreatBadge = ({ status, size = 'normal', className }) => {
  const isSmall = size === 'small';
  
  const baseClasses = cn(
    "inline-flex items-center gap-1.5 rounded-md border font-mono font-semibold tracking-wider uppercase backdrop-blur-sm",
    isSmall ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-xs",
    className
  );

  if (status === 'safe') {
    return (
      <span className={cn(
        baseClasses,
        "border-cyber-mint/30 bg-cyber-mint/10 text-cyber-mint shadow-[0_0_10px_rgba(16,185,129,0.15)]"
      )}>
        <ShieldCheck size={isSmall ? 12 : 14} />
        VERIFIED SAFE
      </span>
    );
  }

  if (status === 'phishing') {
    return (
      <span className={cn(
        baseClasses,
        "border-cyber-danger/40 bg-cyber-danger/10 text-cyber-danger shadow-[0_0_10px_rgba(244,63,94,0.2)]"
      )}>
        <ShieldAlert size={isSmall ? 12 : 14} />
        CRITICAL THREAT
      </span>
    );
  }

  return (
    <span className={cn(
      baseClasses,
      "border-cyber-warning/40 bg-cyber-warning/10 text-cyber-warning shadow-[0_0_10px_rgba(245,158,11,0.15)]"
    )}>
      <AlertTriangle size={isSmall ? 12 : 14} />
      SUSPICIOUS
    </span>
  );
};

export default ThreatBadge;
