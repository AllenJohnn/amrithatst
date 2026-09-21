import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Activity, User, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-cyber-border/80 bg-cyber-dark/80 px-8 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-1 text-xs text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
          </span>
          <span className="font-mono font-medium">RF Engine Active & Listening</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-cyber-muted font-mono">
          <Activity size={14} className="text-cyan-400" />
          <span>Inference Latency: ~34ms</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/scanner')}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all duration-200 hover:opacity-95 hover:shadow-glow"
        >
          <Zap size={14} />
          <span>Launch Scanner</span>
        </button>

        <div className="h-4 w-px bg-cyber-border"></div>

        <div className="flex items-center gap-2.5 rounded-xl border border-cyber-border bg-cyber-card/80 px-3 py-1.5 shadow-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <User size={14} />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-white leading-none">Security Analyst</p>
            <p className="text-[10px] text-cyber-dim leading-tight mt-0.5">Tier 1 Operator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
