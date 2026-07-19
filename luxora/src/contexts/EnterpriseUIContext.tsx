import { createContext, useContext, useState, type ReactNode } from 'react';

interface EnterpriseUIContextType {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (value: boolean) => void;
  isCommunicationDrawerOpen: boolean;
  setCommunicationDrawerOpen: (value: boolean) => void;
  isSearchOverlayOpen: boolean;
  setSearchOverlayOpen: (value: boolean) => void;
}

const EnterpriseUIContext = createContext<EnterpriseUIContextType | undefined>(undefined);

export function EnterpriseUIProvider({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [isCommunicationDrawerOpen, setCommunicationDrawerOpen] = useState(false);
  const [isSearchOverlayOpen, setSearchOverlayOpen] = useState(false);

  return (
    <EnterpriseUIContext.Provider
      value={{
        isSidebarCollapsed,
        setSidebarCollapsed,
        isNotificationDrawerOpen,
        setNotificationDrawerOpen,
        isCommunicationDrawerOpen,
        setCommunicationDrawerOpen,
        isSearchOverlayOpen,
        setSearchOverlayOpen,
      }}
    >
      {children}
    </EnterpriseUIContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEnterpriseUI() {
  const context = useContext(EnterpriseUIContext);
  if (context === undefined) {
    throw new Error('useEnterpriseUI must be used within an EnterpriseUIProvider');
  }
  return context;
}
