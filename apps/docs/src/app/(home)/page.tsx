"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "./../../../public/logo/500x500.png";
import { GithubUser } from "@/components/github-user";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Offers } from "./offers";

export default function HomePage() {
	return (
		<main className="w-screen h-screen relative overflow-hidden">
			<BackgroundBeams className="absolute inset-0 w-full h-full" />

			<div className="w-full absolute inset-0 h-screen overflow-y-auto">
				<div className="w-full mt-16 overflow-y-auto h-screen">
					<Hero />
					<Callout />
					<ScrollDown />
					<Offers />
				</div>
			</div>
		</main>
	);
}

function Hero() {
	return (
		<div className="mt-[100px] w-full">
			<div className="w-full h-[200px] flex justify-center items-center">
				<Image src={logo} alt="Better Auth Kit logo" width={200} height={200} />
			</div>
			<h1 className="text-center text-4xl font-bold mb-5">Better Auth Kit</h1>
			<p className="text-center text-xl  ">
				A handy collection of <b>plugins</b>, <b>adapters</b>, <b>libraries</b>{" "}
				and more.
			</p>
		</div>
	);
}

function Callout() {
	return (
		<div className="flex justify-center items-center gap-10 flex-col sm:pb-10 mt-32 sm:mt-[200px]">
			<Link
				href="/docs/introduction"
				className="text-center w-fit rounded-full border border-primary/50 bg-primary/20 px-5 py-1 text-sm flex gap-2 items-center justify-center transition-all duration-150 ease-in-out hover:scale-110"
			>
				See Docs
				<ArrowRight size={16} />
			</Link>

			<div className="text-sm text-fd-muted-foreground rounded-full">
				Built with ❤️ by{" "}
				<GithubUser className="underline">ping-maxwell</GithubUser>
			</div>
		</div>
	);
}

function ScrollDown() {
	return (
		<div className="w-full flex flex-col items-center justify-center mt-[150px]">
			<motion.div
				initial={{
					y: 0,
				}}
				animate={{
					y: [0, 30, 0],
				}}
				transition={{
					duration: 2.5,

					repeat: Number.POSITIVE_INFINITY,
				}}
			>
				<ArrowDown className="text-muted-foreground" size={32} />
			</motion.div>
		</div>
	);
}
