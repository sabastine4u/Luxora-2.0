import { useSession } from '../../../contexts/SessionContext';
import { ROUTES } from '../../../constants/routes';

export function useServiceCTA() {
  const { isAuthenticated } = useSession();



  // The Service Experience Platform does not handle dashboard routing.
  // Authentication context and ProtectedRoutes handle post-login destinations.

  if (!isAuthenticated) {
    return {
      showSignIn: true,
      signInText: 'Sign In to Access',
      signInAction: ROUTES.LOGIN,
      contactText: 'Speak to an Expert',
      contactAction: ROUTES.CONTACT,
    };
  }

  return {
    showSignIn: false,
    signInText: '',
    signInAction: '',
    contactText: 'Speak to an Expert',
    contactAction: ROUTES.CONTACT,
  };
}
