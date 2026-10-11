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
          envConfigured: Boolean(data.envConfigured),
        });
      } else {
        setDbStatus({ connected: false, message: 'Backend unreachable' });
      }
    } catch {
      setDbStatus({ connected: false, message: 'Backend offline (using offline client fallback)' });
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
        throw new Error(data.message || 'Login failed');
      }

      const receivedUser = data.user || {
        id: 'user-' + Date.now(),
        email,
        name: email.split('@')[0],
        role: 'analyst',
      };
      const receivedToken = data.token || 'mock-token';

      setUser(receivedUser);
      setToken(receivedToken);
      localStorage.setItem('phishguards_user', JSON.stringify(receivedUser));
      localStorage.setItem('phishguards_token', receivedToken);

      return {
        success: true,
        user: receivedUser,
        dbConnected: Boolean(data.dbConnected),
        message: data.message,
      };
    } catch (err) {
      // If server is not yet running, allow local demo sign in
      const offlineUser = {
        id: 'offline-' + Date.now(),
        email,
        name: email.split('@')[0],
        role: 'analyst',
      };
      setUser(offlineUser);
      setToken('offline-token');
      localStorage.setItem('phishguards_user', JSON.stringify(offlineUser));
      localStorage.setItem('phishguards_token', 'offline-token');

      return {
        success: true,
        user: offlineUser,
        dbConnected: false,
        message: 'Signed in locally (Backend server offline. Run "npm run server" to activate MongoDB).',
      };
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
        dbConnected: Boolean(data.dbConnected),
        message: data.message,
      };
    } catch (err) {
      throw err;
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
