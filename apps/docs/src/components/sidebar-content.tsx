import {
  BookCheck,
  Drill,
  EthernetPort,
  FileQuestion,
  Flag,
  Info,
  OctagonMinus,
  OctagonPause,
  Play,
  Plug,
  Scale,
  ShieldBan,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode, SVGProps } from "react";

interface Content {
  title: string;
  Icon: ((props?: SVGProps<any>) => ReactNode) | LucideIcon;
  list: {
    title: string;
    href: string;
    icon: ((props?: SVGProps<any>) => ReactNode) | LucideIcon;
    group?: boolean;
  }[];
}

export const contents: Content[] = [
  {
    Icon: () => <Info size={16} />,
    title: "Introduction",
    list: [
      {
        href: "/docs/info",
        title: "Information",
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
    Icon: () => <EthernetPort size={16} />,
    title: "Adapters",
    list: [
      {
        href: "/docs/adapters/convex",
        title: "Convex DB",
        icon: () => <FileQuestion size={16} />,
      },
    ],
  },
  {
    Icon: () => <Drill size={16} />,
    title: "Tools",
    list: [],
  },
  {
    Icon: () => <BookCheck size={16} />,
    title: "Examples",
    list: [],
  },
];
