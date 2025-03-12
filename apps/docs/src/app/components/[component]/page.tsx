"use client";
import { AppleOAuth } from "@/components/apple-oauth";
import { DiscordOAuth } from "@/components/discord-oauth";
import { FacebookOAuth } from "@/components/facebook-oauth";
import { GoogleOAuth } from "@/components/google-oauth";
import { OAuth } from "@/components/oauth";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { use } from "react";

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
