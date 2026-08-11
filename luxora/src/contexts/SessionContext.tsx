import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ROLES } from "../constants/roles";
import type { Department } from "../constants/departments";
import {
  useCompareProperties,
  type CompareResult,
} from "../hooks/useCompareProperties";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { storage } from "../utils/storage";
// // We no longer use fake data - this imports the real login function and the token saver
import { authApi } from "../api/auth.api";
import { setToken, getToken, clearToken } from "../api/token";

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export interface User {
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department?: Department;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  time: string;
}

export interface UserPreferences {
  emailAlerts?: boolean;
  pushNotifications?: boolean;
  smsUpdates?: boolean;
}

export interface ViewingRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rescheduled";
  agent: { name: string; avatar: string };
  createdAt: string;
}

export interface ReportListing {
  id: string;
  propertyId: string;
  propertyName: string;
  reason: string;
  description: string;
  attachments: string[]; // mock file names
  status: "Submitted" | "Under Review" | "Resolved" | "Dismissed";
  submittedAt: string;
}

interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  // True while we're still verifying a cached session with the backend on page load
  isAuthLoading: boolean;
  // Login now makes a network request, so it returns a Promise instead of a User directly
  login: (email: string, password?: string) => Promise<User>;
  // Register now calls the backend and returns only a success message (no auto-login)
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<void>;
  logout: () => void;
  compareList: string[];
  recentlyViewed: string[];
  favoriteAgents: string[];
  notifications: Notification[];
  preferences: UserPreferences;
  viewingRequests: ViewingRequest[];
  reportListings: ReportListing[];
  scheduleViewingModalPropertyId: string | null;
  reportListingModalPropertyId: string | null;
  toggleCompareProperty: (id: string) => CompareResult;
  isCompared: (id: string) => boolean;
  clearCompare: () => void;
  addRecentlyViewed: (id: string) => void;
  toggleFavoriteAgent: (id: string) => void;
  isFavoriteAgent: (id: string) => boolean;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  addViewingRequest: (req: ViewingRequest) => void;
  openScheduleViewingModal: (propertyId: string) => void;
  closeScheduleViewingModal: () => void;
  addReportListing: (report: ReportListing) => void;
  openReportListingModal: (propertyId: string) => void;
  closeReportListingModal: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    storage.getUserSession<User>(),
  );

  // True while we're checking with the backend whether the cached session is still valid.
  // Starts true so we don't briefly show "logged out" content before that check finishes.
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  // Runs once when the app first loads (or on every page refresh).
  // Checks whether a saved token actually still works, instead of blindly trusting localStorage.
  useEffect(() => {
    const verifySession = async () => {
      const token = getToken();

      // No token at all - definitely logged out. Also clear any stale cached user data,
      // since a user object without a valid token isn't a real logged-in session.
      if (!token) {
        storage.clearUserSession();
        setUser(null);
        setIsAuthLoading(false);
        return;
      }

      try {
        // Ask the backend "does this token still belong to a real, valid session?"
        // http.js automatically attaches the token to this request for us.
        const response = await authApi.getMe();
        const backendUser = response.user;

        // Same translation we do in login() - fullName -> name, generate an avatar.
        const userToSave: User = {
          name: backendUser.fullName,
          email: backendUser.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.fullName)}&background=0D8ABC&color=fff`,
          role: backendUser.role,
        };

        setUser(userToSave);
        storage.setUserSession(userToSave);
      } catch {
        // Token is invalid/expired, or the backend is unreachable - treat as logged out.
        clearToken();
        storage.clearUserSession();
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    verifySession();
  }, []);

  // Additional frontend session state
  const {
    compareList,
    toggleCompareProperty,
    isCompared,
    clearCompare,
    setCompareList,
  } = useCompareProperties();
  const { recentlyViewed, addRecentlyViewed, setRecentlyViewed } =
    useRecentlyViewed();

  const [favoriteAgents, setFavoriteAgents] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>([]);
  const [reportListings, setReportListings] = useState<ReportListing[]>([]);
  const [scheduleViewingModalPropertyId, setScheduleViewingModalPropertyId] =
    useState<string | null>(null);
  const [reportListingModalPropertyId, setReportListingModalPropertyId] =
    useState<string | null>(null);

  // Sends email/password to the real backend (POST /auth/login) instead of checking fake data.
  // `async` means this function can `await` the network request without freezing the app.
  const login = async (email: string, password?: string): Promise<User> => {
    // authApi.login() calls the backend. http.js already unwraps the {success, message} envelope,
    // so `response` here is directly: { token, user: { id, fullName, email, role } }
    const response = await authApi.login(email, password);
    const { token, user: backendUser } = response;

    // Save the JWT so http.js automatically attaches it to future requests
    setToken(token);

    // Backend sends `fullName` and no avatar - translate it into our frontend's User shape
    const userToSave: User = {
      name: backendUser.fullName,
      email: backendUser.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.fullName)}&background=0D8ABC&color=fff`,
      role: backendUser.role,
    };

    setUser(userToSave);
    storage.setUserSession(userToSave);
    return userToSave;
  };
  // Sends the new account details to the real backend (POST /auth/register).
  // Unlike login, this does NOT log the user in automatically - no token, no setUser here.
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<void> => {
    await authApi.register(name, email, password, role);
    // Nothing else to do - the RegisterPage will redirect the user to /login afterward,
    // where they'll sign in for real using login() and get a token.
  };

  const logout = () => {
    clearToken(); // Removes the JWT itself - without this, a refresh after logout would silently log the user back in
    setUser(null);
    storage.clearUserSession();
    setCompareList([]);
    setRecentlyViewed([]);
    setFavoriteAgents([]);
    setNotifications([]);
    setPreferences({});
    setViewingRequests([]);
    setReportListings([]);
    setScheduleViewingModalPropertyId(null);
    setReportListingModalPropertyId(null);
  };

  // Helper Functions
  const toggleFavoriteAgent = (id: string) => {
    setFavoriteAgents((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id],
    );
  };

  const isFavoriteAgent = (id: string) => favoriteAgents.includes(id);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  const addViewingRequest = (req: ViewingRequest) => {
    setViewingRequests((prev) => [req, ...prev]);
  };

  const openScheduleViewingModal = (propertyId: string) => {
    setScheduleViewingModalPropertyId(propertyId);
  };

  const closeScheduleViewingModal = () => {
    setScheduleViewingModalPropertyId(null);
  };

  const addReportListing = (report: ReportListing) => {
    setReportListings((prev) => [report, ...prev]);
  };

  const openReportListingModal = (propertyId: string) => {
    setReportListingModalPropertyId(propertyId);
  };

  const closeReportListingModal = () => {
    setReportListingModalPropertyId(null);
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthLoading,
        login,
        register,
        logout,
        compareList,
        recentlyViewed,
        favoriteAgents,
        notifications,
        preferences,
        viewingRequests,
        reportListings,
        scheduleViewingModalPropertyId,
        reportListingModalPropertyId,
        toggleCompareProperty,
        isCompared,
        clearCompare,
        addRecentlyViewed,
        toggleFavoriteAgent,
        isFavoriteAgent,
        markNotificationRead,
        clearNotifications,
        updatePreferences,
        addViewingRequest,
        openScheduleViewingModal,
        closeScheduleViewingModal,
        addReportListing,
        openReportListingModal,
        closeReportListingModal,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
