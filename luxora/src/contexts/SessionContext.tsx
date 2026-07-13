import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ROLES } from '../constants/roles';
import type { Department } from '../constants/departments';
import { useSavedProperties } from '../hooks/useSavedProperties';
import { useCompareProperties, type CompareResult } from '../hooks/useCompareProperties';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

export type UserRole = typeof ROLES[keyof typeof ROLES];

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
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled';
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
  status: 'Submitted' | 'Under Review' | 'Resolved' | 'Dismissed';
  submittedAt: string;
}

interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  savedProperties: string[];
  compareList: string[];
  recentlyViewed: string[];
  favoriteAgents: string[];
  notifications: Notification[];
  preferences: UserPreferences;
  viewingRequests: ViewingRequest[];
  reportListings: ReportListing[];
  scheduleViewingModalPropertyId: string | null;
  reportListingModalPropertyId: string | null;
  toggleSavedProperty: (id: string) => void;
  isSaved: (id: string) => boolean;
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
  // Mock initial state - unauthenticated by default
  const [user, setUser] = useState<User | null>(null);
  
  // Additional frontend session state
  const { savedProperties, toggleSavedProperty, isSaved, setSavedProperties } = useSavedProperties();
  const { compareList, toggleCompareProperty, isCompared, clearCompare, setCompareList } = useCompareProperties();
  const { recentlyViewed, addRecentlyViewed, setRecentlyViewed } = useRecentlyViewed();
  
  const [favoriteAgents, setFavoriteAgents] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>([]);
  const [reportListings, setReportListings] = useState<ReportListing[]>([]);
  const [scheduleViewingModalPropertyId, setScheduleViewingModalPropertyId] = useState<string | null>(null);
  const [reportListingModalPropertyId, setReportListingModalPropertyId] = useState<string | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setSavedProperties([]);
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
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  const isFavoriteAgent = (id: string) => favoriteAgents.includes(id);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  const addViewingRequest = (req: ViewingRequest) => {
    setViewingRequests(prev => [req, ...prev]);
  };

  const openScheduleViewingModal = (propertyId: string) => {
    setScheduleViewingModalPropertyId(propertyId);
  };

  const closeScheduleViewingModal = () => {
    setScheduleViewingModalPropertyId(null);
  };

  const addReportListing = (report: ReportListing) => {
    setReportListings(prev => [report, ...prev]);
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
        login,
        logout,
        savedProperties,
        compareList,
        recentlyViewed,
        favoriteAgents,
        notifications,
        preferences,
        viewingRequests,
        reportListings,
        scheduleViewingModalPropertyId,
        reportListingModalPropertyId,
        toggleSavedProperty,
        isSaved,
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
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
