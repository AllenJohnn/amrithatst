import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, ShieldCheck } from 'lucide-react';

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
    }, 400);
  };

  const handleDemoLogin = () => {
    setUsername('analyst@phishgaurds.sec');
    setPassword('••••••••••••');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white font-sans flex flex-col justify-center items-center p-4 selection:bg-white selection:text-black">
      
      <div className="w-full max-w-[380px] space-y-8">
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber-dark border border-cyber-border">
            <Shield className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight">PhishGaurds</h1>
            <p className="text-sm text-cyber-muted mt-1">Sign in to your security console</p>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-cyber-muted block">
                Email
              </label>
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="analyst@acme.inc"
                className="w-full rounded-md border border-cyber-borderSubtle bg-cyber-card py-2 px-3 text-sm text-white outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-cyber-muted block">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-md border border-cyber-borderSubtle bg-cyber-card py-2 px-3 text-sm text-white outline-none focus:border-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-white text-black py-2 text-sm font-medium transition-colors hover:bg-gray-200 disabled:opacity-50 mt-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-cyber-border">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-cyber-border bg-cyber-card py-2 text-sm font-medium text-cyber-muted transition-colors hover:bg-cyber-cardHover hover:text-white"
            >
              Demo Access <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-cyber-dim">
          <ShieldCheck size={14} />
          <span>Secured environment</span>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
