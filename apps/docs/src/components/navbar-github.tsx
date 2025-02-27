import { Github } from "lucide-react";

export const NavbarGithub = () => {
  return (
    <div className="w-fit px-5 h-full flex items-center justify-center border-l border-muted">
      <a
        href="https://github.com/ping-maxwell/better-auth-kit"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out"
      >
        <Github />
      </a>
    </div>
  );
};
