import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global Scroll Restoration Component
 * 
 * Automatically scrolls the window to the top when the route pathname changes.
 * It strictly watches `pathname` to prevent unintended scrolling during
 * search parameter updates, pagination, or hash navigation.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of the page on route transition
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
