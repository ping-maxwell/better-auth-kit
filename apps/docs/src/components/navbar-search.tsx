"use client";
import { Search } from "lucide-react";
import { useSearchContext } from "fumadocs-ui/provider";
import { Button } from "./ui/button";

export const NavbarSearch = () => {
	const { setOpenSearch } = useSearchContext();

	return (
		<Button
			variant={"outline"}
			className="relative flex gap-3 border-none! sm:mr-2 font-normal text-muted-foreground w-fit cursor-text shadow-none bg-transparent!"
			onClick={() => {
				setOpenSearch(true);
			}}
		>
			<Search className="sm:size-4 text-muted-foreground" />
			<p className="hidden sm:inline">Search documentation...</p>
			<kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
				<span className="text-xs">⌘</span>K
			</kbd>
		</Button>
	);
};
