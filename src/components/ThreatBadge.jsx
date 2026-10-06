import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

const ThreatBadge = ({ status, size = 'normal', className }) => {
  const isSmall = size === 'small';
  
  const baseClasses = cn(
    "inline-flex items-center gap-1.5 rounded-sm border font-mono font-medium uppercase",
    isSmall ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
    className
  );

  if (status === 'safe') {
    return (
      <span className={cn(
        baseClasses,
        "border-cyber-mint/30 bg-cyber-mint/10 text-cyber-mint"
      )}>
        <ShieldCheck size={isSmall ? 10 : 12} />
        VERIFIED SAFE
      </span>
    );
  }

  if (status === 'phishing') {
    return (
      <span className={cn(
        baseClasses,
        "border-cyber-danger/30 bg-cyber-danger/10 text-cyber-danger"
      )}>
        <ShieldAlert size={isSmall ? 10 : 12} />
        PHISHING
      </span>
    );
  }

  return (
    <span className={cn(
      baseClasses,
      "border-cyber-warning/30 bg-cyber-warning/10 text-cyber-warning"
    )}>
      <AlertTriangle size={isSmall ? 10 : 12} />
      SUSPICIOUS
    </span>
  );
};

export default ThreatBadge;
