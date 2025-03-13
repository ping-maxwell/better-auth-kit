import { Navbar } from "@/components/navbar";
import { Roadmap } from "./roadmap";

export default function Page() {
  return (
    <div className="w-screen h-screen overflow-auto">
      <Navbar />
      <Roadmap />
    </div>
  );
}
