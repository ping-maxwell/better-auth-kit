"use client";

import { GoogleOAuth } from "@/components/google-oauth";
import { DiscordOAuth } from "@/components/discord-oauth";
import { useCallback, type Dispatch, type SetStateAction } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBuilder } from "@/app/components/utils/builder-provider";
import { FacebookOAuth } from "@/components/facebook-oauth";
import { AppleOAuth } from "./apple-oauth";
import { GithubOAuth } from "@/components/github-oauth";
import { MicrosoftOAuth } from "@/components/microsoft-oauth";
import { GitlabOAuth } from "@/components/gitlab-oauth";
import { TikTokOAuth } from "./tiktok-oauth";
import { TwitchOAuth } from "./twitch-oauth";
import { TwitterOAuth } from "./twitter-oauth";
import { DropboxOAuth } from "./dropbox-oauth";
import { LinkedInOAuth } from "./linkedin-oauth";
import { RedditOAuth } from "./reddit-oauth";
import { RobloxOAuth } from "./roblox-oauth";
import { SpotifyOAuth } from "./spotify-oauth";
import { VkOAuth } from "./vk-oauth";

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
	dividerPlacement = "above",
	isLoading,
	setIsLoading,
}: {
	callbackURL?: string;
	iconOnly?: boolean;
	dividerPlacement?: "above" | "below";
	isLoading: boolean;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
	const { builder } = useBuilder();
	const onClick = useCallback<OAuthButtonPressEvent>(
		({ providerId, type }) => {
			setIsLoading(true);
			if (type === "supported-provider") {
				authClient.signIn.social(
					{ provider: providerId, callbackURL },
					{
						onSuccess(context) {
							setIsLoading(false);
						},
						onError(context) {
							setIsLoading(false);
							toast.error(`Something went wrong during OAuth sign-in.`, {
								description: context.error.message,
							});
						},
					},
				);
			} else {
				//@ts-ignore - If you're not intending on using the Generic OAuth plugin, you can remove this.
				authClient.signIn.oauth2(
					{
						providerId,
						callbackURL,
					},
					{
						onSuccess() {
							setIsLoading(false);
						},
						//@ts-expect-error - same reason as above.
						onError(context) {
							setIsLoading(false);
							toast.error(`Something went wrong during OAuth sign-in.`, {
								description: context.error.message,
							});
						},
					},
				);
			}
		},
		[callbackURL, setIsLoading],
	);

	return (
		<div className="w-full flex flex-col gap-3">
			{dividerPlacement === "above" && <Divider />}
			<div
				className={cn(
					"w-full flex flex-wrap items-stretch gap-2",
					dividerPlacement === "above" ? "mt-4" : "mb-4",
				)}
			>
				{builder.oauth.google && (
					<GoogleOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.facebook && (
					<FacebookOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.apple && (
					<AppleOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.discord && (
					<DiscordOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.github && (
					<GithubOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.microsoft && (
					<MicrosoftOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.tiktok && (
					<TikTokOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.twitch && (
					<TwitchOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.twitter && (
					<TwitterOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.dropbox && (
					<DropboxOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.linkedin && (
					<LinkedInOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.gitlab && (
					<GitlabOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.reddit && (
					<RedditOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.roblox && (
					<RobloxOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.spotify && (
					<SpotifyOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
				{builder.oauth.vk && (
					<VkOAuth
						onClick={onClick}
						iconOnly={iconOnly}
						isLoading={isLoading}
					/>
				)}
			</div>
			{dividerPlacement === "below" && <Divider />}
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
