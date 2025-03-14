"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { TooltipProvider } from "./ui/tooltip";

export const NavbarTheme = () => {
	const { setTheme, resolvedTheme } = useTheme();

	return (
		<div className="w-fit px-5 h-6 flex items-center justify-center border-l border-muted">
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							onClick={() => {
								setTheme(resolvedTheme === "dark" ? "light" : "dark");
							}}
							className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out cursor-pointer"
							suppressHydrationWarning={true}
						>
							<Moon className="hidden dark:block" />
							<Sun className="block dark:hidden" />
						</button>
					</TooltipTrigger>
					<TooltipContent className="mt-2">
						<p>Toggle theme 🌙</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
