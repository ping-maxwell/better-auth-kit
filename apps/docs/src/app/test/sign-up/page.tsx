import { Navbar } from "@/components/navbar";
import { SignUp } from "@/components/sign-up";

const Page = () => {
  return (
    <div className=" w-screen h-screen flex justify-center items-center relative overflow-hidden">
      <Navbar />
      <Background />
      <SignUp className=" mb-32 z-10" />
    </div>
  );
};

export default Page;

function Background() {
  return <div className="inset-0 absolute w-screen h-screen "></div>;
}
