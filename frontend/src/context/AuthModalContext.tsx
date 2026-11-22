import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthModalContextType {
  isOpen: boolean;
  mode: 'login' | 'register';
  message: string | null;
  pendingQuery: string | null;
  openLogin: (message?: string, pendingQuery?: string) => void;
  openRegister: (message?: string) => void;
  closeModal: () => void;
  setMode: (mode: 'login' | 'register') => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [message, setMessage] = useState<string | null>(null);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const openLogin = (msg?: string, query?: string) => {
    setMessage(msg || null);
    setPendingQuery(query || null);
    setMode('login');
    setIsOpen(true);
  };

  const openRegister = (msg?: string) => {
    setMessage(msg || null);
    setPendingQuery(null);
    setMode('register');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage(null);
    setPendingQuery(null);
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        message,
        pendingQuery,
        openLogin,
        openRegister,
        closeModal,
        setMode,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = (): AuthModalContextType => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
