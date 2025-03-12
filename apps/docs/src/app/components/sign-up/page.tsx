"use client";

import { BuilderProvider } from "../utils/builder-provider";
import { BuilderSidebar } from "../utils/builder-sidebar";
import { SignUp } from "./component";
import { BuilderExport } from "../utils/builder-export";

export default function Page() {
  return (
    <div className="w-full h-full relative flex justify-center items-center pr-[var(--fd-sidebar-width)] pb-32 bg-gradient-to-br from-fd-border/10 to-fd-border/50">
      <BuilderProvider
        defaultValue={{
          oauth: {
            placement: "below",
            isIconOnly: false,
            facebook: true,
            apple: true,
            google: true,
            discord: true,
            github: true,
          },
          form: {
            name: true,
            email: true,
            password: true,
            submit: true
          }
        }}
      >
        <SignUp />
        <BuilderExport />
        <BuilderSidebar />
      </BuilderProvider>
    </div>
  );
}
