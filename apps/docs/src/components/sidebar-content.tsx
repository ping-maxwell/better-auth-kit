import {
	Box,
	Database,
	Flag,
	Info,
	Lock,
	OctagonMinus,
	OctagonPause,
	Package,
	Plug,
	Scale,
	ShieldBan,
	ShieldUserIcon,
	TestTube,
	Terminal,
	Grid2X2Plus,
	Gift,
	Gauge,
} from "lucide-react";
import type { Content } from "./sidebar";

export const contents: Content[] = [
	{
		Icon: () => <Info size={16} />,
		title: "Introduction",
		list: [
			{
				href: "/docs/introduction",
				title: "Introduction",
				icon: () => <Flag size={16} />,
			},
			{
				href: "/docs/offer",
				title: "Offer",
				icon: () => <Gift size={16} />,
			},
		],
	},
	{
		title: "Features",
		Icon: () => <Gift size={16} />,
		list: [
			{
				title: "Plugins",
				href: "/docs/offer/plugins",
				group: true,
				icon: () => <Plug size={16} />,
			},
			{
				href: "/docs/plugins/waitlist",
				title: "Waitlist",
				icon: () => <OctagonPause size={16} />,
				isNotReady: true,
			},
			{
				href: "/docs/plugins/reverify",
				title: "Reverify",
				icon: () => <Lock size={16} />,
			},
			{
				href: "/docs/plugins/legal-consent",
				title: "Legal Consent",
				icon: () => <Scale size={16} />,
			},
			{
				href: "/docs/plugins/blockade",
				title: "Blockade",
				icon: () => <ShieldBan size={16} />,
				isNotReady: true,
			},
			{
				href: "/docs/plugins/shutdown",
				title: "Shutdown",
				icon: () => <OctagonMinus size={16} />,
				isNotReady: true,
			},
			{
				title: "Libraries",
				href: "/docs/offer/libraries",
				group: true,
				icon: () => <Package size={16} />,
			},
			{
				href: "/docs/libraries/admin-dashboard",
				title: "Admin Dashboard",
				icon: () => <ShieldUserIcon size={16} />,
				isNotReady: true,
			},
			{
				href: "/docs/libraries/tests",
				title: "Better Auth tests",
				icon: () => <TestTube size={16} />,
			},
			{
				title: "CLI",
				href: "/docs/libraries/CLI",
				group: true,
				icon: () => <Terminal size={16} />,
			},
			{
				href: "/docs/CLI/information",
				title: "Information",
				icon: () => <Info size={16} />,
			},
			{
				href: "/docs/CLI/ui-components",
				title: "UI Components",
				icon: () => <Box size={16} />,
				isNotReady: true,
			},
			{
				href: "/docs/CLI/seed",
				title: "Seed",
				icon: () => <Grid2X2Plus size={16} />,
			},
			{
				href: "/docs/CLI/dashboard",
				title: "Dashboard",
				icon: () => <Gauge size={16} />,
				isNotReady: true,
			},
			{
				title: "Adapters",
				href: "/docs/CLI/adapters",
				group: true,
				icon: () => <Database size={16} />,
			},
			{
				href: "/docs/adapters/convex",
				title: "Convex DB",
				icon: () => <Database size={16} />,
			},
			{
				href: "/docs/adapters/pocketbase",
				title: "Pocketbase DB",
				icon: () => <Database size={16} />,
				isNotReady: true,
			},
			{
				href: "/docs/adapters/firestore",
				title: "Firestore DB",
				icon: () => <Database size={16} />,
				isNotReady: true,
			},
			{
				href: "/docs/adapters/instantdb",
				title: "InstantDB",
				icon: () => <Database size={16} />,
				isNotReady: true,
			},
		],
	},
];
