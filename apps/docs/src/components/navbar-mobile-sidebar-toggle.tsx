"use client";

import { Menu } from "lucide-react";
import { useMobileSidebar } from "./mobile-sidebar-controller";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const NavbarMobileSidebarToggle = () => {
  const { isOpen, setIsOpen } = useMobileSidebar();
  const pathname = usePathname();
  return (
    <button
      type="button"
      className={cn(
        "items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out ml-5",
        pathname.startsWith("/docs") ? "flex sm:hidden" : "hidden",
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <Menu />
    </button>
  );
};
