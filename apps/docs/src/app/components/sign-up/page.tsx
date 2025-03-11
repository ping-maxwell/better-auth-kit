import { SignUp } from "@/components/sign-up";
import { BuilderSidebar } from "../utils/builder-sidebar";

export default function Page() {
  return (
    <div className="w-full h-full relative flex justify-center items-center pr-[var(--fd-sidebar-width)] pb-32 bg-gradient-to-br from-fd-border/10 to-fd-border/80">
      <SignUp />
      <BuilderSidebar />
    </div>
  );
}
