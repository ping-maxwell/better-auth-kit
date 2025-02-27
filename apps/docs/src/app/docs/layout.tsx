import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      nav={{
        enabled: false,
        component: <Navbar />,
      }}
      sidebar={{
        className: "h-[calc(100vh_-_64px)]! mt-[64px]",
        enabled: false,
      }}
    >
      <Navbar />
      <Sidebar />
      <div className="w-[calc(100vw_-_var(--fd-sidebar-width))] ml-[var(--fd-sidebar-width)] h-[calc(100vh_-_64px)] mt-[64px] flex relative overflow-y-auto">
        {children}
      </div>
    </DocsLayout>
  );
}
