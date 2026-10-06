import React from 'react';
import { useLocation } from 'react-router-dom';
import { User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Overview';
      case '/scanner': return 'Scanner';
      case '/history': return 'History';
      case '/analytics': return 'Analytics';
      default: return 'Workspace';
    }
  };

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-[#222222] bg-[#0B0B0B] px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-cyber-white">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="hidden sm:flex items-center gap-3 text-cyber-muted mr-2">
          <span className="text-xs">Model: <span className="font-mono text-cyber-white">v2.4</span></span>
          <span className="w-px h-3 bg-cyber-border" />
          <span className="text-xs">Latency: <span className="font-mono text-cyber-white">34ms</span></span>
        </div>

        <div className="flex items-center gap-2 text-cyber-muted hover:text-cyber-white transition-colors cursor-pointer">
          <span className="text-xs hidden sm:block">analyst@phishgaurds.sec</span>
          <div className="flex h-7 w-7 items-center justify-center rounded bg-cyber-card border border-cyber-border">
            <User size={14} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
