"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface MobileSidebarContextProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileSidebarContext =
  //@ts-ignore
  createContext<MobileSidebarContextProps>(null);

export const MobileSidebarController = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileSidebarContext.Provider>
  );
};

export const useMobileSidebar = () => {
  const context = useContext(MobileSidebarContext);
  if (context === undefined) {
    throw new Error(
      "useMobileSidebar must be used within a MobileSidebarController"
    );
  }
  return context;
};
