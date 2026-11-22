import React, { useEffect } from 'react';
import { LandingPage } from './LandingPage';
import { useAuthModal } from '../context/AuthModalContext';

export const RegisterPage: React.FC = () => {
  const { openRegister } = useAuthModal();

  useEffect(() => {
    openRegister();
  }, []);

  return <LandingPage />;
};
