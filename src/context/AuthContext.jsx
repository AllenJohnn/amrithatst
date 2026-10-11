import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('phishguards_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('phishguards_token') || null);
  const [dbStatus, setDbStatus] = useState({ connected: false, message: 'Checking database...' });
  const [isLoading, setIsLoading] = useState(false);

  const checkDbStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus({
          connected: Boolean(data.connected),
          message: data.message || '',
        });
      } else {
        setDbStatus({ connected: false, message: 'Backend unreachable' });
      }
    } catch {
      setDbStatus({ connected: false, message: 'Backend offline' });
    }
  }, []);

  useEffect(() => {
    checkDbStatus();
  }, [checkDbStatus]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      const receivedUser = data.user;
      const receivedToken = data.token;

      setUser(receivedUser);
      setToken(receivedToken);
      localStorage.setItem('phishguards_user', JSON.stringify(receivedUser));
      localStorage.setItem('phishguards_token', receivedToken);

      return {
        success: true,
        user: receivedUser,
        message: data.message,
      };
    } catch (err) {
      // Strictly fail: NEVER log in if credentials do not match or account doesn't exist
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const receivedUser = data.user;
      const receivedToken = data.token;

      setUser(receivedUser);
      setToken(receivedToken);
      localStorage.setItem('phishguards_user', JSON.stringify(receivedUser));
      localStorage.setItem('phishguards_token', receivedToken);

      return {
        success: true,
        user: receivedUser,
        message: data.message,
      };
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Demo login failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('phishguards_user', JSON.stringify(data.user));
      localStorage.setItem('phishguards_token', data.token);

      return data;
    } catch {
      // Fallback demo user
      const demoUser = {
        id: 'demo-analyst',
        email: 'analyst@phishguards.sec',
        name: 'Demo Analyst',
        role: 'analyst',
      };
      setUser(demoUser);
      setToken('demo-token');
      localStorage.setItem('phishguards_user', JSON.stringify(demoUser));
      localStorage.setItem('phishguards_token', 'demo-token');
      return { success: true, user: demoUser };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('phishguards_user');
    localStorage.removeItem('phishguards_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        dbStatus,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        checkDbStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
