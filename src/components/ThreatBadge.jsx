import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

const ThreatBadge = ({ status, size = 'normal' }) => {
  const isSmall = size === 'small';

  if (status === 'safe') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-cyber-mint/30 bg-cyber-mint/10 font-mono font-medium text-cyber-mint shadow-glow-mint/20 ${
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}>
        <ShieldCheck size={isSmall ? 12 : 14} className="text-cyber-mint" />
        SAFE
      </span>
    );
  }

  if (status === 'phishing') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-cyber-danger/40 bg-cyber-danger/10 font-mono font-medium text-cyber-danger shadow-glow-danger ${
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}>
        <ShieldAlert size={isSmall ? 12 : 14} className="text-cyber-danger" />
        PHISHING
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-cyber-warning/40 bg-cyber-warning/10 font-mono font-medium text-cyber-warning ${
      isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    }`}>
      <AlertTriangle size={isSmall ? 12 : 14} className="text-cyber-warning" />
      SUSPICIOUS
    </span>
  );
};

export default ThreatBadge;
