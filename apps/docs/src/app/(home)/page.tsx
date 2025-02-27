"use client";
import Image from "next/image";
import { motion } from "framer-motion";

import bgImg from "./wallpaper.jpg";
import logo from "./../../../public/logo/500x500.png";
import { GithubUser } from "@/components/github-user";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="w-screen h-screen relative overflow-hidden">
      <motion.div
        initial={{ filter: "hue-rotate(0deg)" }}
        animate={{ filter: "hue-rotate(360deg)" }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        className="absolute inset-0"
      >
        <Image
          src={bgImg}
          alt="Better Auth Kit background image"
          layout="fill"
          objectFit="cover"
          draggable={false}
          className="absolute inset-0"
        />
        <div className="bg-background opacity-50 absolute inset-0 w-full h-full"></div>
      </motion.div>

      <div className="w-full absolute inset-0 h-screen">
        <div className="w-full mt-16 flex flex-col justify-center items-center content-start gap-3 overflow-y-auto h-screen">
          <Image
            src={logo}
            alt="Better Auth Kit logo"
            width={200}
            height={200}
          />
          <h1 className="text-center text-4xl font-bold mb-5">
            Better Auth Kit
          </h1>
          <p className="text-center text-xl  ">
            A handy collection of <b>plugins</b>, <b>adapters</b>, <b>tools</b>{" "}
            and more.
          </p>

          <div className="sm:flex flex-wrap justify-center items-center w-full content-center gap-10 mt-10 hidden">
            <Block
              emoji="🫷"
              title="Waitlist"
              description="Want to allow your users to join a waitlist?"
              href="/docs/plugins/waitlist"
            />
            <Block
              emoji="🚫"
              title="Blockade"
              description="Want to whitelist or blacklist users?"
              href="/docs/plugins/blockade"
            />
            <Block
              emoji="🚧"
              title="Shutdown"
              description="Want to stop sign-ins or sign-ups during maintenance?"
              href="/docs/plugins/shutdown"
            />
            <Block
              emoji="🎉"
              title="And more!"
              description="Want to see more plugins? Check out our docs!"
              href="/docs/info"
            />
          </div>

          <div className="flex justify-center items-center gap-10 flex-col sm:pb-10 mt-32">
            <Link
              href="/docs/info"
              className="text-center w-fit rounded-full border border-primary/50 bg-primary/20 px-5 py-1 text-sm flex gap-2 items-center justify-center my-3 transition-all duration-150 ease-in-out hover:scale-110"
            >
              See Docs
              <ArrowRight size={16} />
            </Link>

            <div className="text-sm text-secondary-foreground rounded-full">
              Built with ❤️ by{" "}
              <GithubUser className="underline">ping-maxwell</GithubUser>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Block({
  description,
  emoji,
  href,
  title,
}: {
  emoji: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="border rounded-lg border-muted/50 w-[250px] h-[200px] bg-card/50 p-3 flex justify-center items-center flex-col gap-2 backdrop-blur-sm select-none shadow-lg cursor-pointer hover:scale-125 transition-all duration-300">
        <div className="w-full flex justify-center items-center mt-2">
          <h1 className="text-5xl w-16 h-16 flex justify-center items-center bg-muted/50 border border-muted select-none rounded-lg">
            {emoji}
          </h1>
        </div>
        <span className="w-full flex justify-center items-center mt-3 font-semibold">
          {title}
        </span>
        <span className="w-full flex justify-center items-center text-center text-sm text-foreground/80">
          {description}
        </span>
      </div>
    </Link>
  );
}
