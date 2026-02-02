
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = authService.getCurrentUser();
  const location = useLocation();

  if (!user) {
    // Salva a rota para redirecionamento após o login
    if (location.pathname !== '/' && !location.pathname.includes('login')) {
      sessionStorage.setItem('redirect_after_login', location.pathname + location.search);
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Bloqueio global para usuários banidos
  if (user.isBanned) {
    return <Navigate to="/banned" replace />;
  }

  return <>{children}</>;
};
