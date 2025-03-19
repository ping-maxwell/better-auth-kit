"use client";
import { Search } from "lucide-react";
import { useSearchContext } from "fumadocs-ui/provider";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const NavbarSearch = () => {
	const { setOpenSearch } = useSearchContext();
	const pathname = usePathname();

	if (pathname.startsWith("/docs"))
		return (
			<div className="sm:mx-2  h-6 flex justify-center items-center pl-2">
				<Button
					variant={"outline"}
					className="relative flex gap-3 border-none! font-normal text-muted-foreground w-fit cursor-text shadow-none bg-transparent!"
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
			</div>
		);

	return (
		<div className="w-fit px-5 h-6 items-center justify-center">
			<Link
				href="/docs"
				className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out"
			>
				Docs
			</Link>
		</div>
	);
};
