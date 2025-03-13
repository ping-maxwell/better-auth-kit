"use client";
import { Navbar } from "@/components/navbar";
import { SignIn } from "@/components/sign-in";
import { Toaster } from "@/components/ui/sonner";

const Page = () => {
	// return null
	return (
		<div className=" w-screen h-screen flex justify-center items-center relative overflow-hidden">
			<Navbar />
			{/* <SignIn className=" mb-32 z-10" /> */}
			<Test />
		</div>
	);
};

export default Page;


function Test(){
	return <div className="w-[200px] h-[200px] bg-fd-foreground"></div>
}