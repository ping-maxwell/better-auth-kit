"use client";

import { GoogleOAuth } from "@/components/google-oauth";
import { DiscordOAuth } from "@/components/discord-oauth";
import { useCallback } from "react";
import { authClient } from "@/lib/auth-client";

export type OAuthButtonPressEvent = ({
  providerId,
  type,
}: {
  providerId: (
    | "apple"
    | "discord"
    | "facebook"
    | "github"
    | "google"
    | "microsoft"
    | "spotify"
    | "twitch"
    | "twitter"
    | "dropbox"
    | "linkedin"
    | "gitlab"
    | "tiktok"
    | "reddit"
    | "roblox"
    | "vk"
  ) &
    string;
  /**
   * If the provider is supported by Better Auth, this will be `supported-provider`. Anything such as google, apple, discord, etc, are supported providers.
   * Everything else that requires the use of the Generic OAuth plugin, will be `external-provider`.
   */
  type: "supported-provider" | "external-provider";
}) => void;

export function OAuth({
  callbackURL,
  iconOnly,
}: {
  callbackURL?: string;
  iconOnly?: boolean;
}) {
  const onClick = useCallback<OAuthButtonPressEvent>(
    ({ providerId, type }) => {
      if (type === "supported-provider") {
        authClient.signIn.social({ provider: providerId, callbackURL });
      } else {
        //@ts-ignore - If you're not intending on using the Generic OAuth plugin, you can remove this.
        authClient.signIn.oauth2({
          providerId,
          callbackURL,
        });
      }
    },
    [callbackURL]
  );

  return (
    <div className="w-full flex flex-col gap-3">
      <Divider />
      <div className="w-full flex flex-wrap items-stretch gap-2 mt-4">
        <GoogleOAuth onClick={onClick} iconOnly={iconOnly} />
        <DiscordOAuth onClick={onClick} iconOnly={iconOnly} />
        <GoogleOAuth onClick={onClick} iconOnly={iconOnly} />
        <DiscordOAuth onClick={onClick} iconOnly={iconOnly} />
        <GoogleOAuth onClick={onClick} iconOnly={iconOnly} />
        <DiscordOAuth onClick={onClick} iconOnly={iconOnly} />
        <GoogleOAuth onClick={onClick} iconOnly={iconOnly} />
        <DiscordOAuth onClick={onClick} iconOnly={iconOnly} />
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="w-full flex gap-3 justify-center items-center">
      <div className="w-full h-px bg-border rounded-full"></div>
      <div className="text-muted-foreground text-sm">or</div>
      <div className="w-full h-px bg-border rounded-full"></div>
    </div>
  );
}
