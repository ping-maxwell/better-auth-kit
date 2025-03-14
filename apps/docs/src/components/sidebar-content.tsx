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
	Play,
	Plug,
	Scale,
	ShieldBan,
	ShieldUserIcon,
	TestTube,
	Terminal,
	Grid2X2Plus,
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
				href: "/docs/getting-started",
				title: "Getting Started",
				icon: () => <Play size={16} />,
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
				href: "/docs/plugins/reverify-password",
				title: "Reverify Password",
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
				title: "@better-auth-kit/tests",
				icon: () => <TestTube size={16} />,
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
		Icon: () => <Drill size={16} />,
		title: "Tools",
		list: [
			{
				href: "/docs/tools/ui-components",
				title: "UI Components",
				icon: () => <Box size={16} />,
			},
			{
				href: "/docs/tools/cli",
				title: "CLI",
				icon: () => <Terminal size={16} />,
			},
			{
				href: "/docs/tools/seeding",
				title: "Seeding",
				icon: () => <Grid2X2Plus size={16} />,
			},
		],
	},
	{
		Icon: () => <BookCheck size={16} />,
		title: "Examples",
		list: [],
	},
];
