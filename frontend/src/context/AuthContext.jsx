import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Synchronous initial state from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('swind_token'));
  const [user, setUser] = useState(() => {
    const name = localStorage.getItem('swind_user_name');
    const email = localStorage.getItem('swind_user_email');
    return (name && email) ? { name, email } : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('swind_token'));
  const navigate = useNavigate();

  // Verify JWT Token with FastAPI Backend on App Boot
  useEffect(() => {
    const storedToken = localStorage.getItem('swind_token');
    if (storedToken) {
      apiRequest('/api/auth/me')
        .then(userData => {
          if (userData && userData.email) {
            setUser(userData);
            localStorage.setItem('swind_user_name', userData.name || '');
            localStorage.setItem('swind_user_email', userData.email || '');
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          // Token invalid, expired, or backend restarted -> Clean logout
          logout();
        });
    }

    // Event listener for 401 Unauthorized API responses
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('swind:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('swind:unauthorized', handleUnauthorized);
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('swind_token', newToken);
    localStorage.setItem('swind_user_name', newUser.name);
    localStorage.setItem('swind_user_email', newUser.email);
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('swind_token');
    localStorage.removeItem('swind_user_name');
    localStorage.removeItem('swind_user_email');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
