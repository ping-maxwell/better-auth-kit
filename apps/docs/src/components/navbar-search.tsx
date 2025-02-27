"use client";
import { Search } from "lucide-react";
import { useSearchContext } from "fumadocs-ui/provider";
import { Button } from "./ui/button";

export const NavbarSearch = () => {
  const { setOpenSearch } = useSearchContext();

  return (
    <Button
      variant={"outline"}
      className="relative flex w-full gap-3 mr-2 font-normal border-transparent text-muted-foreground sm:w-fit hover:border-muted hover:bg-transparent cursor-pointer"
      onClick={() => {
        setOpenSearch(true);
      }}
    >
      <Search className="size-4 text-muted-foreground" />
      <p className="lg:hidden">Search...</p>{" "}
      <p className="hidden lg:inline">Search documentation...</p>
      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
};
