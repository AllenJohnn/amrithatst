import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Activity, User, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Security Overview';
      case '/scanner': return 'Deep URL Scanner';
      case '/history': return 'Scan History';
      case '/analytics': return 'Threat Analytics';
      default: return 'Security Console';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-cyber-border/40 bg-cyber-dark/80 px-4 md:px-8 backdrop-blur-md">
      {/* Mobile Title / Desktop Breadcrumb */}
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-white tracking-wide md:hidden">
          {getPageTitle()}
        </h2>
        
        {/* Desktop Status Badge */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-cyber-mint/20 bg-cyber-mint/5 px-3 py-1 text-xs text-cyber-mint shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-mint opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyber-mint"></span>
          </span>
          <span className="font-mono font-medium tracking-wide">System Operational</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-cyber-dim font-mono bg-cyber-card/50 px-2.5 py-1 rounded-md border border-cyber-border/50">
          <Activity size={12} className="text-cyber-cyan" />
          <span>Latency: ~34ms</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* New Scan CTA */}
        {location.pathname !== '/scanner' && (
          <button
            onClick={() => navigate('/scanner')}
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-cyber-cyan px-3 py-1.5 text-xs font-bold text-black transition-all duration-300 hover:bg-white hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
          >
            <Zap size={14} className="fill-black" />
            <span>New Scan</span>
          </button>
        )}

        <div className="hidden sm:block h-4 w-px bg-cyber-border"></div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs font-medium text-white">Security Admin</span>
            <span className="text-[10px] text-cyber-muted font-mono uppercase tracking-wider">Tier 1</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-card border border-cyber-border/80 text-cyber-cyan ring-1 ring-white/5 shadow-sm">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
