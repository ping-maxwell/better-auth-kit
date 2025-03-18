"use client";
import { Box, Ellipsis, MapIcon, Users, ArrowUpRight, Menu } from "lucide-react";
import { NavbarDropdownTheme } from "./navbar-dropdown-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const NavbarDropdown = () => {
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-fit px-5 h-full sm:flex items-center justify-center border-l border-muted hidden text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out">
          <Menu />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href="/community"
            className={cn(
              "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out relative min-w-[180px]",
              pathname.startsWith("/community") && "text-foreground"
            )}
          >
            <Users className="size-4" />
            Community
            <ArrowUpRight className="size-3.5 absolute right-2" />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/components"
            className={cn(
              "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out relative",
              pathname.startsWith("/components") && "text-foreground"
            )}
          >
            <Box className="size-4" />
            Components
            <ArrowUpRight className="size-3.5 absolute right-2" />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/roadmap"
            className={cn(
              "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out relative",
              pathname.startsWith("/roadmap") && "text-foreground"
            )}
          >
            <MapIcon className="size-4" />
            Roadmap
            <ArrowUpRight className="size-3.5 absolute right-2" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <NavbarDropdownTheme />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
