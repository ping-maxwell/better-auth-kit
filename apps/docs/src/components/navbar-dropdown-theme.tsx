"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export const NavbarDropdownTheme = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenuItem
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
	  className="flex gap-2"
	
    >
      <Moon className="hidden dark:block size-4" />
      <Sun className="block dark:hidden size-4" />
      Toogle Theme
    </DropdownMenuItem>
  );
};
