"use client";
import { AppleOAuth } from "@/components/apple-oauth";
import { DiscordOAuth } from "@/components/discord-oauth";
import { FacebookOAuth } from "@/components/facebook-oauth";
import { GithubOAuth } from "@/components/github-oauth";
import { GoogleOAuth } from "@/components/google-oauth";
import { MicrosoftOAuth } from "@/components/microsoft-oauth";
import { TikTokOAuth } from "@/components/tiktok-oauth";
import { OAuth } from "@/components/oauth";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { use } from "react";
import { TwitchOAuth } from "@/components/twitch-oauth";
import { TwitterOAuth } from "@/components/twitter-oauth";
import { DropboxOAuth } from "@/components/dropbox-oauth";
import { LinkedInOAuth } from "@/components/linkedin-oauth";
import { GitlabOAuth } from "@/components/gitlab-oauth";
import { RedditOAuth } from "@/components/reddit-oauth";
import { RobloxOAuth } from "@/components/roblox-oauth";
import { SpotifyOAuth } from "@/components/spotify-oauth";

const components = {
  "sign-in": () => <SignIn />,
  "sign-up": () => <SignUp />,
  oauth: () => (
    <div className="w-[500px]">
      <OAuth isLoading={false} setIsLoading={() => {}} />
    </div>
  ),
  "discord-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <DiscordOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "google-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <GoogleOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "apple-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <AppleOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "facebook-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <FacebookOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "github-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <GithubOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "microsoft-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <MicrosoftOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "tiktok-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <TikTokOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "twitch-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <TwitchOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "twitter-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <TwitterOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "dropbox-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <DropboxOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "linkedin-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <LinkedInOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "gitlab-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <GitlabOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "reddit-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <RedditOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "roblox-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <RobloxOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
  "spotify-oauth": () => (
    <div className="w-[200px] flex justify-center items-center">
      <SpotifyOAuth isLoading={false} onClick={() => {}} />
    </div>
  ),
};

export default function Page({
  params,
}: {
  params: Promise<{ component: keyof typeof components }>;
}) {
  const { component } = use(params);

  return (
    <div className="flex justify-center items-center w-full h-full pb-32">
      {components[component]?.()}
    </div>
  );
}
