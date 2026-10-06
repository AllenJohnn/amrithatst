import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, Key, ArrowRight, ShieldCheck, Cpu, TerminalSquare, Layers, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 500);
  };

  const handleDemoLogin = () => {
    setUsername('analyst_alpha');
    setPassword('••••••••••••');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 300);
  };

  return (
    <div className="flex min-h-screen bg-cyber-black text-white font-sans selection:bg-cyber-cyan selection:text-black">
      {/* Left Panel: Branding & Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-cyber-dark/30 border-r border-cyber-border/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-blue shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <Shield className="h-6 w-6 text-cyber-black" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              PhishGaurds
              <span className="rounded bg-cyber-cyan/10 px-2 py-0.5 text-[10px] font-black text-cyber-cyan border border-cyber-cyan/20 uppercase tracking-widest">
                AI
              </span>
            </h1>
          </div>
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Secure your perimeter.</h2>
            <p className="text-cyber-muted leading-relaxed">
              Advanced threat intelligence platform utilizing Random Forest classification to neutralize phishing vectors in real-time.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-cyber-cyan/10 p-2 rounded-lg border border-cyber-cyan/20">
                <TerminalSquare size={16} className="text-cyber-cyan" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-200">Lexical Analysis</h4>
                <p className="text-xs text-cyber-muted mt-1">Deep inspection of URL structure and entropy.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-cyber-cyan/10 p-2 rounded-lg border border-cyber-cyan/20">
                <Layers size={16} className="text-cyber-cyan" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-200">Heuristic Extraction</h4>
                <p className="text-xs text-cyber-muted mt-1">Evaluation of 18 distinct threat indicators.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs font-mono text-cyber-dim">
          <ShieldCheck size={14} className="text-cyber-mint" />
          <span>AES-256 Verified Session Protocol • System Status: Nominal</span>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none lg:hidden" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-10 flex flex-col items-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber-cyan to-cyber-blue shadow-[0_0_20px_rgba(0,229,255,0.3)] mb-4">
              <Shield className="h-7 w-7 text-cyber-black" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              PhishGaurds <span className="text-cyber-cyan text-sm align-super">AI</span>
            </h1>
            <p className="text-xs text-cyber-muted font-mono uppercase tracking-wider">
              Authentication Gateway
            </p>
          </div>

          <div className="text-center lg:text-left mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-sm text-cyber-muted">Enter your operator credentials to access the console.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-cyber-muted uppercase tracking-widest font-mono ml-1">
                Operator ID
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-cyber-dim group-focus-within:text-cyber-cyan transition-colors">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="analyst@phishgaurds.sec"
                  className="w-full rounded-xl border border-cyber-border/80 bg-cyber-card/50 py-3.5 pl-11 pr-4 text-sm font-mono text-white outline-none focus:border-cyber-cyan focus:bg-cyber-card transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-semibold text-cyber-muted uppercase tracking-widest font-mono">
                  Access Token
                </label>
                <a href="#" className="text-[11px] text-cyber-cyan hover:text-white transition-colors">Recover?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-cyber-dim group-focus-within:text-cyber-cyan transition-colors">
                  <Key size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-cyber-border/80 bg-cyber-card/50 py-3.5 pl-11 pr-4 text-sm font-mono text-white outline-none focus:border-cyber-cyan focus:bg-cyber-card transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyber-cyan py-3.5 text-sm font-bold text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 mt-4 group"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              {!isLoading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-8">
            <div className="w-full border-t border-cyber-border/50"></div>
            <span className="bg-cyber-black lg:bg-transparent absolute px-4 text-[10px] font-mono text-cyber-dim uppercase tracking-widest">
              Demo Access
            </span>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyber-cyan/30 bg-cyber-cyan/5 py-3 text-sm font-semibold text-cyber-cyan transition-all hover:bg-cyber-cyan hover:text-black hover:border-cyber-cyan"
          >
            <Sparkles size={16} />
            <span>Launch Demo Environment</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
