"use client";
import { MapIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavbarRoadmap() {
	const pathname = usePathname();

	return (
		<div className="w-fit px-5 h-6 sm:flex items-center justify-center border-l border-muted hidden">
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href="/roadmap"
							className={cn(
								"flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out",
								pathname.startsWith("/roadmap") && "text-foreground",
							)}
						>
							<MapIcon />
						</Link>
					</TooltipTrigger>
					<TooltipContent className="mt-2">
						<p>Roadmap 🗺️</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
