import logo from "../../public/logo/500x500.png";
import Image from "next/image";
import { NavbarSearch } from "./navbar-search";
import { NavbarGithub } from "./navbar-github";

export const Navbar = () => {
  return (
    <header
      className="fixed left-1/2 top-(--fd-banner-height) z-40 box-content w-full -translate-x-1/2 transition-colors border-b shadow-sm bg-fd-background/80 backdrop-blur-lg py-2 flex items-center justify-between"
      aria-label="Main"
      dir="ltr"
    >
      <div className="h-12 w-full px-5">
        <a
          href="/"
          className="flex justify-start items-center gap-2 h-full w-full text-nowrap"
        >
          <Image src={logo} alt="logo" width={32} height={32} />
          Better-Auth-Kit
        </a>
      </div>
      <div className="w-full"></div>
      <div className="">
        <NavbarSearch />
      </div>
      <NavbarGithub />
    </header>
  );
};
