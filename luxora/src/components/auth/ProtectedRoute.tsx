import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSession } from '../../contexts/SessionContext';
import type { UserRole } from '../../contexts/SessionContext';
import { ROUTES } from '../../constants/routes';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useSession();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect unauthorized users to the home page or a dedicated unauthorized page
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return <>{children}</>;
}
