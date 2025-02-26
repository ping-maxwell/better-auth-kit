import logo from "../../public/logo/500x500.png";
import Image from "next/image";
import { NavbarSearch } from "./NavbarSearch";

export const Navbar = () => {
  return (
    <header
      className="fixed left-1/2 top-(--fd-banner-height) z-40 box-content w-full -translate-x-1/2 transition-colors lg:mt-2 border-b shadow-sm bg-fd-background/80 backdrop-blur-lg pb-2 flex items-center justify-between"
      aria-label="Main"
      dir="ltr"
    >
      <div className="h-12 w-fit ml-5">
        <a
          href="/"
          className="flex justify-center items-center gap-2 h-full w-fit text-nowrap"
        >
          <Image src={logo} alt="logo" width={32} height={32} />
          Better-Auth-Kit
        </a>
      </div>
      <div className=""></div>
      <div className="">
        <NavbarSearch />
      </div>
    </header>
  );
};
