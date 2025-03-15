import {
	BookCheck,
	Box,
	Database,
	Drill,
	EthernetPort,
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
		Icon: () => <Plug size={16} />,
		title: "Plugins",
		list: [
			{
				href: "/docs/plugins/waitlist",
				title: "Waitlist",
				icon: () => <OctagonPause size={16} />,
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
			},
			{
				href: "/docs/plugins/shutdown",
				title: "Shutdown",
				icon: () => <OctagonMinus size={16} />,
			},
		],
	},
	{
		Icon: () => <Package size={16} />,
		title: "Libraries",
		list: [
			{
				href: "/docs/libraries/admin-dashboard",
				title: "Admin Dashboard",
				icon: () => <ShieldUserIcon size={16} />,
			},
			{
				href: "/docs/libraries/tests",
				title: "Better Auth tests",
				icon: () => <TestTube size={16} />,
			},
		],
	},
	{
		Icon: () => <Terminal size={16} />,
		title: "CLI",
		list: [
			{
				href: "/docs/cli/information",
				title: "Information",
				icon: () => <Info size={16} />,
			},
			{
				group: true,
				title: "Features",
				href: "/docs/cli/features",
				icon: () => <Box size={16} />,
			},
			{
				href: "/docs/cli/ui-components",
				title: "UI Components",
				icon: () => <Box size={16} />,
			},
			{
				href: "/docs/cli/seeding",
				title: "Seeding",
				icon: () => <Grid2X2Plus size={16} />,
			},
			{
				href: "/docs/cli/dashboard",
				title: "Dashboard",
				icon: () => <Gauge size={16} />,
			},
		],
	},
	{
		Icon: () => <EthernetPort size={16} />,
		title: "Adapters",
		list: [
			{
				href: "/docs/adapters/convex",
				title: "Convex DB",
				icon: () => <Database size={16} />,
			},
			{
				href: "/docs/adapters/pocketbase",
				title: "Pocketbase DB",
				icon: () => <Database size={16} />,
			},
			{
				href: "/docs/adapters/firestore",
				title: "Firestore DB",
				icon: () => <Database size={16} />,
			},
		],
	},

	{
		Icon: () => <BookCheck size={16} />,
		title: "Examples",
		list: [],
	},
];
