import { Navbar } from "@/components/navbar";
import { SignIn } from "@/components/sign-in";
import { Toaster } from "@/components/ui/sonner";

const Page = () => {
	return (
		<div className=" w-screen h-screen flex justify-center items-center relative overflow-hidden">
			<Navbar />
			<Background />
			<SignIn className=" mb-32 z-10" />
			<Toaster />
		</div>
	);
};

export default Page;

function Background() {
	return <div className="inset-0 absolute w-screen h-screen "></div>;
}
