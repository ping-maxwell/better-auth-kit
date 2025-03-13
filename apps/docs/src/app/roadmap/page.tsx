import { Navbar } from "@/components/navbar";
import { Roadmap } from "./roadmap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "The roadmap for Better Auth Kit",
};

export default function Page() {
  return (
    <div className="w-screen h-screen overflow-auto">
      <Navbar />
      <Roadmap />
    </div>
  );
}
