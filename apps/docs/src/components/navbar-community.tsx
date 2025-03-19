"use client";
import { Users } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavbarCommunity() {
	const pathname = usePathname();

	return (
		<div className="w-fit px-5 h-6 sm:flex items-center justify-center  hidden">
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href="/community"
							className={cn(
								"flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out",
								pathname.startsWith("/community") && "text-foreground",
							)}
						>
							<Users />
						</Link>
					</TooltipTrigger>
					<TooltipContent className="mt-2">
						<p>Community 🤝</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
