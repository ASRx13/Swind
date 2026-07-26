import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('swind_token');
    const storedName = localStorage.getItem('swind_user_name');
    const storedEmail = localStorage.getItem('swind_user_email');
    if (storedToken) {
      setToken(storedToken);
      setUser({ name: storedName, email: storedEmail });
      setIsAuthenticated(true);
    }
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
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
