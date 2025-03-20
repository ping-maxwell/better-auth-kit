"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const session = authClient.useSession();

  return (
    <div className="w-full h-full relative flex justify-center items-center pr-[var(--fd-sidebar-width)] bg-gradient-to-br from-fd-border/10 to-fd-border/50">
      <Button
        onClick={async () => {
          console.log(session.data?.user.email);
          authClient.reverify.sendEmail();
        }}
      >
        Send Verification Email
      </Button>
    </div>
  );
}
