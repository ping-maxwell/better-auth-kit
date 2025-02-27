import { Github } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const NavbarGithub = () => {
  return (
    <div className="w-fit px-5 h-full flex items-center justify-center border-l border-muted">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://github.com/ping-maxwell/better-auth-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out"
            >
              <Github />
            </a>
          </TooltipTrigger>
          <TooltipContent className="mt-2">
            <p>Give us a star! ⭐</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
