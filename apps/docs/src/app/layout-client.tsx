"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      LinkComponent={Link}
      signUpFields={["tosAccepted"]}
      colorIcons={true}
      additionalFields={{
        tosAccepted: {
          label: "Terms of Service",
          type: "boolean",
          required: true,
          description: "Agree to the Terms of Service",
          instructions: "Please agree to the Terms of Service",
        },
      }}
    >
      {children}
    </AuthUIProvider>
  );
}
