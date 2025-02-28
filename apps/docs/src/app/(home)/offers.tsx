"use client";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";
import { Scale, ScrollText, Shield, ShieldUser } from "lucide-react";
import { WaitlistOffer } from "./offers/waitlist";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlockadeOffer } from "./offers/blockade";

const offerItems = [
  {
    title: "Waitlist Plugin",
    description: "Want to allow your users to join a waitlist?",
    header: ({ isHovering }: { isHovering: boolean }) => (
      <WaitlistOffer isHovering={isHovering} />
    ),
    className: "md:col-span-1",
    icon: <ScrollText className="sm:size-4 text-fd-muted-foreground" />,
    href: "/docs/plugins/waitlist",
  },
  {
    title: "Blockade Plugin",
    description: "Want to have an allowlist or blocklist of users?",
    header: ({ isHovering }: { isHovering: boolean }) => (
      <BlockadeOffer isHovering={isHovering} />
    ),
    className: "md:col-span-2",
    icon: <Shield className="sm:size-4 text-fd-muted-foreground" />,
    href: "/docs/plugins/blockade",
  },
  {
    title: "Admin Dashboard Library",
    description: "Want your own custom admin dashboard?",
    header: ({ isHovering }: { isHovering: boolean }) => (
      <div className=" w-full h-full"></div>
    ),
    className: "md:col-span-2",
    icon: <ShieldUser className="sm:size-4 text-fd-muted-foreground" />,
    href: "/docs/libraries/admin-dashboard",
  },
  {
    title: "Legal Consent Plugin",
    description: "Want your users to accept legal terms and conditions?",
    header: ({ isHovering }: { isHovering: boolean }) => (
      <div className=" w-full h-full"></div>
    ),
    className: "md:col-span-1",
    icon:  <Scale className="sm:size-4 text-fd-muted-foreground" />,
    href: "/docs/plugins/legal-consent",
  },
];

export function Offers() {
  const [currentlyHovering, setCurrentlyHovering] = useState(-1);
  const router = useRouter();

  return (
    <div className="mt-[100px] h-screen w-full flex flex-col justify-center items-center">
      <h2 className="text-center text-2xl font-bold mb-15">
        Some things the kit has to offer
      </h2>
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
        {offerItems.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header({ isHovering: currentlyHovering === i })}
            className={cn("[&>p:text-lg] cursor-pointer bg-transparent! backdrop-blur-sm", item.className)}
            icon={item.icon}
            onMouseEnter={() => {
              setCurrentlyHovering(i);
            }}
            onMouseLeave={() => {
              setCurrentlyHovering(-1);
            }}
            onClick={() => {
              router.push(item.href);
            }}
          />
        ))}
      </BentoGrid>
    </div>
  );
}
