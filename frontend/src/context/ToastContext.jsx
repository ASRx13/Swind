import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map(toast => {
          let background = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
          if (toast.type === 'success') background = 'linear-gradient(135deg, #059669 0%, #22c55e 100%)';
          if (toast.type === 'error') background = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
          
          return (
            <div key={toast.id} style={{
              background,
              color: 'white',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md, 8px)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              animation: 'fadeSlideUp 0.3s ease-out forwards',
              fontFamily: 'Inter, sans-serif'
            }}>
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
