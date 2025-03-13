import { Github } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";

export const NavbarGithub = () => {
	return (
		<div className="w-fit px-5 h-6 sm:flex items-center justify-center border-l border-muted hidden">
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href="https://github.com/ping-maxwell/better-auth-kit"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out"
						>
							<Github />
						</Link>
					</TooltipTrigger>
					<TooltipContent className="mt-2">
						<p>Give us a star! ⭐</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
