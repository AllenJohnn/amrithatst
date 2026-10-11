import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        const res = await register(email, password, name);
        toast.success(res.message || 'Account created successfully!');
      } else {
        await login(email, password);
        toast.success('Signed in successfully!');
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('analyst@phishguards.sec');
    setPassword('demopass123');
    setIsSubmitting(true);
    try {
      await login('analyst@phishguards.sec', 'demopass123');
      toast.success('Signed in as Analyst (Demo Access)');
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white font-sans flex flex-col justify-center items-center p-4 selection:bg-cyber-white selection:text-cyber-black">
      
      <div className="w-full max-w-[400px] space-y-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber-dark border border-cyber-border">
            <Shield className="h-6 w-6 text-cyber-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight">PhishGuards</h1>
            <p className="text-sm text-cyber-muted mt-1">
              {mode === 'login' ? 'Sign in to your security console' : 'Create new analyst account'}
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-cyber-dark border border-cyber-border rounded-xl p-6 shadow-xl">
          
          {/* Tabs */}
          <div className="flex rounded-lg bg-cyber-card p-1 border border-cyber-borderSubtle mb-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-cyber-dark text-cyber-white shadow-sm'
                  : 'text-cyber-muted hover:text-cyber-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-cyber-dark text-cyber-white shadow-sm'
                  : 'text-cyber-muted hover:text-cyber-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-cyber-muted block">
                  Full Name / Handle
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Security Analyst"
                  className="w-full rounded-md border border-cyber-borderSubtle bg-cyber-card py-2 px-3 text-sm text-cyber-white outline-none focus:border-white transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-cyber-muted block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@phishguards.sec"
                className="w-full rounded-md border border-cyber-borderSubtle bg-cyber-card py-2 px-3 text-sm text-cyber-white outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-cyber-muted block">
                  Password
                </label>
                {mode === 'login' && (
                  <span className="text-[11px] text-cyber-dim hover:text-cyber-muted cursor-pointer">
                    Forgot?
                  </span>
                )}
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-md border border-cyber-borderSubtle bg-cyber-card py-2 px-3 text-sm text-cyber-white outline-none focus:border-white transition-colors"
              />
              {mode === 'register' && (
                <p className="text-[10px] text-cyber-dim mt-1">Minimum 6 characters.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-cyber-accent text-[#10120E] py-2 text-sm font-medium transition-all hover:bg-opacity-90 disabled:opacity-50 mt-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{mode === 'register' ? 'Creating Account...' : 'Authenticating...'}</span>
                </>
              ) : (
                <span>{mode === 'register' ? 'Register Account' : 'Sign In'}</span>
              )}
            </button>
          </form>
          
          <div className="mt-5 pt-5 border-t border-cyber-border">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-cyber-border bg-cyber-card py-2 text-sm font-medium text-cyber-muted transition-colors hover:bg-cyber-cardHover hover:text-cyber-white disabled:opacity-50"
            >
              Instant Demo Access <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="flex items-center justify-center gap-2 text-xs text-cyber-dim">
          <ShieldCheck size={14} />
          <span>Secured environment</span>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
