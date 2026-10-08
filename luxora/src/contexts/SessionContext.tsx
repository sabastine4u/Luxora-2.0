import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { ROLES } from "../constants/roles";
import type { Department } from "../constants/departments";
import {
  useCompareProperties,
  type CompareResult,
} from "../hooks/useCompareProperties";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { storage } from "../utils/storage";
import { authApi } from "../api/auth.api";
import { setToken, getToken, clearToken } from "../api/token";
import { notificationApi } from "../api/notification.api";
import { socketService } from "../services/socket.service";
import {
  normalizeRealtimeNotification,
  normalizeRestNotification,
  type Notification,
} from "../types/notification";

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  phone?: string;
  department?: Department;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Persisted dashboard settings returned by the backend.
  settings?: {
    buyer?: {
      purpose?: "buy" | "rent" | "short-let";
      propertyTypes?: string[];
      preferredLocations?: string[];
      budgetMin?: number | null;
      budgetMax?: number | null;
      minBedrooms?: number | null;
      minBathrooms?: number | null;
    };

    owner?: {
      businessName?: string | null;
      businessType?: string;
      registrationNumber?: string | null;
      website?: string | null;
      officeAddress?: string | null;
      paymentMethod?: string;
      payoutFrequency?: string;
      taxId?: string | null;
      taxStatus?: string;
      taxResidence?: string;
      profileVisibility?: string;
      dataSharing?: "share" | "do_not_share";
    };

    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      property?: boolean;
      priceDrop?: boolean;
      mortgage?: boolean;
      marketing?: boolean;
      offers?: boolean;
      viewingRequests?: boolean;
      messages?: boolean;
      operationalAlerts?: boolean;
      approvalRequests?: boolean;
      performanceUpdates?: boolean;
    };

    regional?: {
      theme?: "dark" | "light" | "system";
      language?: "en-GB" | "en-US" | "fr";
      timeZone?: string;
      currency?: "NGN" | "USD" | "GBP" | "EUR";
    };
  };
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
  status:
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "Rescheduled";
  agent: {
    name: string;
    avatar: string;
  };
  createdAt: string;
}

export interface ReportListing {
  id: string;
  propertyId: string;
  propertyName: string;
  reason: string;
  description: string;
  attachments: string[];
  status:
  | "Submitted"
  | "Under Review"
  | "Resolved"
  | "Dismissed";
  submittedAt: string;
}

interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;

  // True while the saved session is being verified against the backend.
  isAuthLoading: boolean;

  login: (
    email: string,
    password?: string,
  ) => Promise<User>;

  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<void>;

  // Update the authenticated user's basic profile information.
  updateProfile: (
    fullName: string,
    email: string,
  ) => Promise<User>;

  // Update the authenticated user's profile picture through the backend.
  updateProfilePhoto: (file: File) => Promise<User>;

  // Update supported profile/settings fields through the backend.
  updateAccountSettings: (payload: {
    fullName?: string;
    email?: string;
    phone?: string | null;
    settings?: User["settings"];
  }) => Promise<User>;

  // Change the authenticated user's password.
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;

  logout: () => void;

  compareList: string[];
  recentlyViewed: string[];
  favoriteAgents: string[];
  notifications: Notification[];
  unreadCount: number;
  isNotificationsLoading: boolean;
  notificationError: string | null;
  loadNotifications: () => Promise<void>;
  preferences: UserPreferences;
  viewingRequests: ViewingRequest[];
  reportListings: ReportListing[];

  scheduleViewingModalPropertyId: string | null;
  reportListingModalPropertyId: string | null;

  toggleCompareProperty: (id: string) => CompareResult;
  isCompared: (id: string) => boolean;
  clearCompare: () => void;

  addRecentlyViewed: (id: string) => void;
  removeRecentlyViewed: (id: string) => void;

  toggleFavoriteAgent: (id: string) => void;
  isFavoriteAgent: (id: string) => boolean;

  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  clearNotifications: () => void;

  updatePreferences: (
    newPreferences: Partial<UserPreferences>,
  ) => void;

  addViewingRequest: (req: ViewingRequest) => void;

  openScheduleViewingModal: (propertyId: string) => void;
  closeScheduleViewingModal: () => void;

  addReportListing: (report: ReportListing) => void;

  openReportListingModal: (propertyId: string) => void;
  closeReportListingModal: () => void;
}

const SessionContext = createContext<
  SessionContextType | undefined
>(undefined);

export function SessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(() =>
    storage.getUserSession<User>(),
  );

  // Keep the application in a loading state while the cached token is verified.
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Convert the backend user structure into the frontend session structure.
  const buildFrontendUser = (
    backendUser: {
      id: string;
      fullName: string;
      email: string;
      role: UserRole;
      avatar?: string | null;
      phone?: string | null;
      department?: Department;
      isVerified?: boolean;
      isActive?: boolean;
      createdAt?: string;
      updatedAt?: string;
      settings?: User["settings"];
    },
    existingAvatar?: string,
  ): User => {
    return {
      id: String(backendUser.id),
      name: backendUser.fullName,
      email: backendUser.email,

      // Keep the persisted backend avatar whenever one exists.
      avatar:
        backendUser.avatar ||
        existingAvatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          backendUser.fullName,
        )}&background=0D8ABC&color=fff`,

      role: backendUser.role,

      // Persist the backend phone value.
      phone: backendUser.phone || undefined,

      department: backendUser.department,
      isVerified: backendUser.isVerified,
      isActive: backendUser.isActive,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,

      // Persist all dashboard settings returned by the backend.
      settings: backendUser.settings || {},
    };
  };

  // Extract the API payload regardless of whether the HTTP layer returns
  // an Axios response or an already-unwrapped backend payload.
  const getApiPayload = (response: any) => {
    // First remove the Axios response wrapper when it exists.
    const body = response?.data ?? response;

    // Then remove the Luxora API response wrapper when it exists.
    return body?.data ?? body;
  };

  // Verify the persisted authentication session when the application starts.
  useEffect(() => {
    const verifySession = async () => {
      const token = getToken();

      // Clear stale user information when no token exists.
      if (!token) {
        storage.clearUserSession();
        setUser(null);
        setIsAuthLoading(false);
        return;
      }

      try {
        // Ask the backend whether the saved token is still valid.
        const response = await authApi.getMe();

        // Extract the backend payload safely.
        const payload = getApiPayload(response);

        const backendUser = payload?.user;

        // Reject unexpected responses rather than saving broken session state.
        if (!backendUser) {
          throw new Error(
            "Authenticated user was not returned by the backend",
          );
        }

        // Convert the backend account into the frontend user structure.
        const userToSave = buildFrontendUser(
          backendUser,
          user?.avatar,
        );

        // Update the live React session.
        setUser(userToSave);

        // Keep the persisted session synchronized with the backend.
        storage.setUserSession(userToSave);
      } catch (error) {
        // Any invalid or expired authentication state is treated as logged out.
        console.error(
          "Failed to verify authentication session:",
          error,
        );

        clearToken();
        storage.clearUserSession();
        setUser(null);
      } finally {
        // Finish the initial authentication check.
        setIsAuthLoading(false);
      }
    };

    // Start the session verification process.
    void verifySession();
  }, []);

  // Comparison state used across the application.
  const {
    compareList,
    toggleCompareProperty,
    isCompared,
    clearCompare,
    setCompareList,
  } = useCompareProperties();

  // Recently-viewed state used across the application.
  const {
    recentlyViewed,
    addRecentlyViewed,
    setRecentlyViewed,
  } = useRecentlyViewed();

  const removeRecentlyViewed = useCallback(
    (id: string) => {
      setRecentlyViewed((prev) =>
        prev.filter(
          (propertyId) => propertyId !== id,
        ),
      );
    },
    [setRecentlyViewed],
  );

  const [favoriteAgents, setFavoriteAgents] =
    useState<string[]>([]);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  // Guards in-flight REST work from an earlier account after logout/switching.
  const notificationOwnerId = useRef<string | null>(user?.id ?? null);
  notificationOwnerId.current = user?.id ?? null;

  const [preferences, setPreferences] =
    useState<UserPreferences>({});

  const [viewingRequests, setViewingRequests] =
    useState<ViewingRequest[]>([]);

  const [reportListings, setReportListings] =
    useState<ReportListing[]>([]);

  const [
    scheduleViewingModalPropertyId,
    setScheduleViewingModalPropertyId,
  ] = useState<string | null>(null);

  const [
    reportListingModalPropertyId,
    setReportListingModalPropertyId,
  ] = useState<string | null>(null);

  // Update the authenticated user's basic profile information.
  const updateProfile = async (
    fullName: string,
    email: string,
  ): Promise<User> => {
    // Send the editable profile fields to the backend.
    const response = await authApi.updateProfile({
      fullName,
      email,
    });

    // Extract the backend payload.
    const payload = getApiPayload(response);

    const backendUser = payload?.user;

    // Reject an unexpected backend response.
    if (!backendUser) {
      throw new Error(
        "Updated profile information was not returned by the backend",
      );
    }

    // Preserve the current avatar while updating the name/email.
    const userToSave = buildFrontendUser(
      backendUser,
      user?.avatar,
    );

    // Update the application session immediately.
    setUser(userToSave);

    // Persist the updated account information locally.
    storage.setUserSession(userToSave);

    return userToSave;
  };

  // Upload and persist the authenticated user's profile picture.
  const updateProfilePhoto = async (
    file: File,
  ): Promise<User> => {
    // Send the selected image to the real backend upload endpoint.
    const response = await authApi.uploadProfilePhoto(file);

    // Extract the backend payload.
    const payload = getApiPayload(response);

    const backendUser = payload?.user;

    // Reject an unexpected upload response.
    if (!backendUser) {
      throw new Error(
        "Updated profile information was not returned after photo upload",
      );
    }

    // Build the updated frontend user while preserving all account metadata.
    const userToSave = buildFrontendUser(
      backendUser,
      user?.avatar,
    );

    // Update the live session immediately.
    setUser(userToSave);

    // Persist the updated avatar across refreshes.
    storage.setUserSession(userToSave);

    return userToSave;
  };

  // Update supported profile and dashboard settings through the backend.
  const updateAccountSettings = async (payload: {
    fullName?: string;
    email?: string;
    phone?: string | null;
    settings?: User["settings"];
  }): Promise<User> => {
    // Send the requested account changes to the authenticated profile endpoint.
    const response = await authApi.updateProfile(payload);

    // Extract the backend payload.
    const responsePayload = getApiPayload(response);

    const backendUser = responsePayload?.user;

    // Reject malformed backend responses.
    if (!backendUser) {
      throw new Error(
        "Updated account information was not returned by the backend",
      );
    }

    // Convert the backend user into the frontend session format.
    const userToSave = buildFrontendUser(
      backendUser,
      user?.avatar,
    );

    // Update the live session.
    setUser(userToSave);

    // Persist the new account information locally.
    storage.setUserSession(userToSave);

    return userToSave;
  };

  // Change the authenticated user's password through the real backend endpoint.
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    // Call the secure password-change endpoint.
    await authApi.changePassword(
      currentPassword,
      newPassword,
    );
  };

  // Authenticate through the real backend login endpoint.
  const login = async (
    email: string,
    password?: string,
  ): Promise<User> => {
    // Send credentials to the backend.
    const response = await authApi.login(
      email,
      password,
    );

    // Extract the backend login payload.
    const payload = getApiPayload(response);

    const token = payload?.token;
    const backendUser = payload?.user;

    // Login is invalid when either value is missing.
    if (!token || !backendUser) {
      throw new Error(
        "Login response did not contain a token and user",
      );
    }

    // Save the JWT used by authenticated API requests.
    setToken(token);

    // Build the frontend session using the real backend user data.
    const userToSave = buildFrontendUser(backendUser);

    // Update the live session.
    setUser(userToSave);

    // Persist the login session.
    storage.setUserSession(userToSave);

    return userToSave;
  };

  // Register a new user through the real backend.
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<void> => {
    // Registration does not create a local authenticated session.
    await authApi.register(
      name,
      email,
      password,
      role,
    );
  };

  // Clear the authenticated session and all client-side session state.
  const logout = () => {
    // Remove the JWT.
    clearToken();

    // Remove the live authenticated user.
    setUser(null);

    // Remove the persisted user session.
    storage.clearUserSession();

    // Reset session-specific application state.
    setCompareList([]);
    setFavoriteAgents([]);
    setNotifications([]);
    setUnreadCount(0);
    setNotificationError(null);
    setPreferences({});
    setViewingRequests([]);
    setReportListings([]);
    setScheduleViewingModalPropertyId(null);
    setReportListingModalPropertyId(null);
  };

  // Toggle a favorite agent in the current session.
  const toggleFavoriteAgent = (id: string) => {
    setFavoriteAgents((prev) =>
      prev.includes(id)
        ? prev.filter((aid) => aid !== id)
        : [...prev, id],
    );
  };

  const isFavoriteAgent = (id: string) =>
    favoriteAgents.includes(id);

  const loadNotifications = useCallback(async () => {
    const ownerId = user?.id;
    if (!ownerId) return;

    setIsNotificationsLoading(true);
    setNotificationError(null);

    try {
      const [listResponse, unreadResponse] = await Promise.all([
        notificationApi.listNotifications({ includeArchived: 'true', limit: 100 }),
        notificationApi.getUnreadCount(),
      ]);
      const listPayload = getApiPayload(listResponse);
      const unreadPayload = getApiPayload(unreadResponse);
      const incoming: Notification[] = Array.isArray(
        listPayload?.notifications,
      )
        ? listPayload.notifications.map(normalizeRestNotification)
        : [];

      // A response for a prior session must never populate a new account.
      if (notificationOwnerId.current !== ownerId) return;

      setNotifications((previous) => {
        const byId = new Map(previous.map((notification) => [notification.id, notification]));
        incoming.forEach((notification) => byId.set(notification.id, notification));
        return [...byId.values()].sort(
          (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        );
      });
      setUnreadCount(Number(unreadPayload?.unreadCount) || 0);
    } catch (error) {
      if (notificationOwnerId.current !== ownerId) return;
      setNotificationError(
        error instanceof Error
          ? error.message
          : 'Unable to load notifications.',
      );
    } finally {
      if (notificationOwnerId.current === ownerId) {
        setIsNotificationsLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading || !user) {
      socketService.disconnect();
      setNotifications([]);
      setUnreadCount(0);
      setNotificationError(null);
      setIsNotificationsLoading(false);
      return;
    }

    let active = true;
    setNotifications([]);
    setUnreadCount(0);
    const activeOwnerId = user.id;

    const unsubscribeNotification = socketService.onNotification((payload) => {
      if (!active || notificationOwnerId.current !== activeOwnerId) return;
      const notification = normalizeRealtimeNotification(payload);

      setNotifications((previous) => {
        const exists = previous.some((item) => item.id === notification.id);
        const merged = exists
          ? previous.map((item) => item.id === notification.id ? notification : item)
          : [notification, ...previous];

        if (!exists && notification.readAt === null) {
          setUnreadCount((current) => current + 1);
        }

        return [...merged].sort(
          (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        );
      });
    });
    const unsubscribeReconnect = socketService.onReconnect(() => {
      if (active && notificationOwnerId.current === activeOwnerId) {
        void loadNotifications();
      }
    });
    const unsubscribeError = socketService.onConnectError((error) => {
      console.error('Realtime notification connection failed:', error);
    });
    void loadNotifications();

    return () => {
      active = false;
      unsubscribeNotification();
      unsubscribeReconnect();
      unsubscribeError();
      socketService.disconnect();
    };
  }, [isAuthLoading, user?.id, loadNotifications]);

  const markNotificationRead = async (id: string) => {
    try {
      const response = await notificationApi.markNotificationRead(id);
      const payload = getApiPayload(response);
      const notification = normalizeRestNotification(payload.notification);
      setNotifications((previous) => {
        const prior = previous.find((item) => item.id === id);
        const merged = prior
          ? previous.map((item) => item.id === notification.id ? notification : item)
          : [notification, ...previous];
        if (prior?.readAt === null && prior.archivedAt === null) {
          setUnreadCount((current) => Math.max(0, current - 1));
        }
        return merged.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
      });
    } catch (error) {
      setNotificationError(error instanceof Error ? error.message : 'Unable to mark notification as read.');
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const response = await notificationApi.markAllNotificationsRead();
      const payload = getApiPayload(response);
      const readAt = String(payload.readAt);

      setNotifications((previous) => previous.map((notification) =>
        notification.archivedAt === null && notification.readAt === null
          ? { ...notification, readAt }
          : notification,
      ));
      setUnreadCount(0);
    } catch (error) {
      setNotificationError(error instanceof Error ? error.message : 'Unable to mark notifications as read.');
    }
  };

  const archiveNotification = async (id: string) => {
    try {
      const response = await notificationApi.archiveNotification(id);
      const payload = getApiPayload(response);
      const notification = normalizeRestNotification(payload.notification);
      setNotifications((previous) => {
        const prior = previous.find((item) => item.id === id);
        const merged = prior
          ? previous.map((item) => item.id === notification.id ? notification : item)
          : [notification, ...previous];
        if (prior?.readAt === null && prior.archivedAt === null) {
          setUnreadCount((current) => Math.max(0, current - 1));
        }
        return merged.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
      });
    } catch (error) {
      setNotificationError(error instanceof Error ? error.message : 'Unable to archive notification.');
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Update local notification preferences.
  const updatePreferences = (
    newPreferences: Partial<UserPreferences>,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      ...newPreferences,
    }));
  };

  // Add a viewing request to the current client state.
  const addViewingRequest = (req: ViewingRequest) => {
    setViewingRequests((prev) => [
      req,
      ...prev,
    ]);
  };

  // Open a property viewing request modal.
  const openScheduleViewingModal = (
    propertyId: string,
  ) => {
    setScheduleViewingModalPropertyId(propertyId);
  };

  // Close a property viewing request modal.
  const closeScheduleViewingModal = () => {
    setScheduleViewingModalPropertyId(null);
  };

  // Add a listing report to the current client state.
  const addReportListing = (report: ReportListing) => {
    setReportListings((prev) => [
      report,
      ...prev,
    ]);
  };

  // Open the report-listing modal for a property.
  const openReportListingModal = (
    propertyId: string,
  ) => {
    setReportListingModalPropertyId(propertyId);
  };

  // Close the report-listing modal.
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

        updateProfile,
        updateProfilePhoto,

        // Expose account/settings updates to dashboard pages.
        updateAccountSettings,

        // Expose password changes to the security settings UI.
        changePassword,

        logout,

        compareList,
        recentlyViewed,
        favoriteAgents,
        notifications,
        unreadCount,
        isNotificationsLoading,
        notificationError,
        preferences,
        viewingRequests,
        reportListings,

        scheduleViewingModalPropertyId,
        reportListingModalPropertyId,

        toggleCompareProperty,
        isCompared,
        clearCompare,

        addRecentlyViewed,
        removeRecentlyViewed,

        toggleFavoriteAgent,
        isFavoriteAgent,

        loadNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        archiveNotification,
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

// Prevent the React Fast Refresh export warning for this hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error(
      "useSession must be used within a SessionProvider",
    );
  }

  return context;
}
