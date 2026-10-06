import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

const ThreatBadge = ({ status, size = 'normal', className }) => {
  const isSmall = size === 'small';
  
  const baseClasses = cn(
    "inline-flex items-center gap-1.5 rounded-sm border font-mono uppercase font-medium",
    isSmall ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
    className
  );

  if (status === 'safe') {
    return (
      <span className={cn(
        baseClasses,
        "border-[#232F23] bg-[#111711] text-cyber-success"
      )}>
        <ShieldCheck size={isSmall ? 10 : 12} className="shrink-0" />
        SAFE
      </span>
    );
  }

  if (status === 'phishing') {
    return (
      <span className={cn(
        baseClasses,
        "border-[#332022] bg-[#1A1112] text-cyber-danger"
      )}>
        <ShieldAlert size={isSmall ? 10 : 12} className="shrink-0" />
        PHISHING
      </span>
    );
  }

  return (
    <span className={cn(
      baseClasses,
      "border-[#332B1A] bg-[#19160F] text-cyber-warning"
    )}>
      <AlertTriangle size={isSmall ? 10 : 12} className="shrink-0" />
      SUSPICIOUS
    </span>
  );
};

export default ThreatBadge;
