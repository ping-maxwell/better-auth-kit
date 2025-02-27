import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
