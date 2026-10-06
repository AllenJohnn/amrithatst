import React from 'react';
import { useLocation } from 'react-router-dom';
import { User, Search } from 'lucide-react';

export default function Navbar() {
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
    <header className="flex h-14 w-full items-center justify-between border-b border-cyber-border bg-[#090909] px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-white">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4 text-sm">
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#0F0F0F] border border-cyber-border rounded-md text-cyber-textMuted cursor-text hover:border-sage-500/50 transition-colors mr-4" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search...</span>
          <kbd className="ml-4 font-sans text-[10px] px-1.5 py-0.5 bg-[#1A1A1A] rounded border border-[#2A2A2A]">⌘K</kbd>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-cyber-textMuted mr-2">
          <span className="text-xs">Model: <span className="font-mono text-white">v2.4</span></span>
          <span className="w-px h-3 bg-cyber-border" />
          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-green-900/20 text-green-400 font-medium">System Optimal</span>
        </div>

        <div className="flex items-center gap-2 text-cyber-textMuted hover:text-white transition-colors cursor-pointer ml-2">
          <span className="text-xs hidden sm:block font-medium">analyst@phishgaurds.sec</span>
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0F0F0F] border border-cyber-border">
            <User size={14} />
          </div>
        </div>
      </div>
    </header>
  );
}
