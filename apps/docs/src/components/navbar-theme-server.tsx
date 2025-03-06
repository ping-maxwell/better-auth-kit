"use client";

import { Moon } from "lucide-react";
import dynamic from "next/dynamic";

export const NavbarThemeServer = dynamic(
	() => import("./navbar-theme").then((x) => x.NavbarTheme),
	{
		ssr: false,
		loading: () => (
			<div className="w-fit px-5 h-6 flex items-center justify-center border-l border-muted text-muted-foreground">
				<Moon />
			</div>
		),
	},
);
