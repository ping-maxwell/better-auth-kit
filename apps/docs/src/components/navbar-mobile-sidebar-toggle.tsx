"use client";

import { Menu } from "lucide-react";
import { useMobileSidebar } from "./mobile-sidebar-controller";

export const NavbarMobileSidebarToggle = () => {
  const { isOpen, setIsOpen } = useMobileSidebar();

  return (
    <button
      type="button"
      className="flex sm:hidden items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out ml-5"
      onClick={() => setIsOpen(!isOpen)}
    >
      <Menu />
    </button>
  );
};
