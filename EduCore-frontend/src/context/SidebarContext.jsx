import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const value = {
    isOpen,
    toggle: () => setIsOpen((o) => !o),
    close: () => setIsOpen(false),
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}
