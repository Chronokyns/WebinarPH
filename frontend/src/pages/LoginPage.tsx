import React, { useEffect } from 'react';
import { LandingPage } from './LandingPage';
import { useAuthModal } from '../context/AuthModalContext';

export const LoginPage: React.FC = () => {
  const { openLogin } = useAuthModal();

  useEffect(() => {
    openLogin();
  }, []);

  return <LandingPage />;
};
