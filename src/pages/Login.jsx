import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Key, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

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
    <div className="relative flex min-h-screen items-center justify-center bg-cyber-black px-4 py-12">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyber-green/10 blur-3xl" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-cyber-border bg-cyber-card/90 p-8 backdrop-blur-xl shadow-glow">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyber-green/30 bg-cyber-green/10 shadow-glow">
            <Shield className="h-8 w-8 text-cyber-green" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            PhishGaurds <span className="text-cyber-green">AI</span>
          </h2>
          <p className="text-xs text-cyber-muted font-mono">
            Autonomous Cyber Threat Intelligence Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-cyber-dim mb-1.5 uppercase">
              Operator ID / Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-cyber-muted">
                <User size={16} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="analyst@phishgaurds.sec"
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark py-3 pl-10 pr-4 text-xs font-mono text-white outline-none focus:border-cyber-green transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-cyber-dim mb-1.5 uppercase">
              Access Token / Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-cyber-muted">
                <Key size={16} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark py-3 pl-10 pr-4 text-xs font-mono text-white outline-none focus:border-cyber-green transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyber-green py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-opacity-90 hover:shadow-glow disabled:opacity-50"
          >
            <span>Authenticate Operator</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-cyber-border"></div>
          <span className="bg-cyber-card px-3 text-[11px] font-mono text-cyber-dim uppercase">
            OR DEMO PRESENTATION
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyber-green/30 bg-cyber-green/10 py-3 text-xs font-semibold text-cyber-green transition-all hover:bg-cyber-green hover:text-black"
        >
          <Cpu size={15} />
          <span>Quick Demo Access (One-Click)</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-cyber-dim font-mono">
          <ShieldCheck size={14} className="text-cyber-green" />
          <span>AES-256 Verified Session Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
