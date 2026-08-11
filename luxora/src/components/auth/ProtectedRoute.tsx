import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSession } from '../../contexts/SessionContext';
import type { UserRole } from '../../contexts/SessionContext';
import type { Department } from '../../constants/departments';
import { ROLES } from '../../constants/roles';
import { ROUTES, getDashboardRoute } from '../../constants/routes';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  allowedDepartments?: Department[];
  guestOnly?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, allowedDepartments, guestOnly }: ProtectedRouteProps) {
  const { user, isAuthenticated, isAuthLoading } = useSession();
// Still checking with the backend whether a saved session is valid - don't decide anything yet.
  // Without this, a logged-in user would get bounced to /login for a split second on every refresh.
  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-navy-950">
        <div className="h-8 w-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
      </div>
    );
  }
  if (guestOnly) {
    if (isAuthenticated && user) {
      const dashboardRoute = getDashboardRoute(user.role);
      return <Navigate to={dashboardRoute} replace />;
    }
    return <>{children}</>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user.role === ROLES.SUPER_ADMIN) {
    return <>{children}</>;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect unauthorized users to the home page or a dedicated unauthorized page
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  if (allowedDepartments && allowedDepartments.length > 0) {
    if (user.role === ROLES.ADMIN) {
      if (!user.department || !allowedDepartments.includes(user.department)) {
        return <Navigate to={ROUTES.HOME} replace />;
      }
    }
  }

  return <>{children}</>;
}
