import { Box } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
export function NavbarComponents() {
  return (
    <div className="w-fit px-5 h-6 sm:flex items-center justify-center border-l border-muted hidden">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/components"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-color duration-150 ease-in-out"
            >
              <Box />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="mt-2">
            <p>UI Components Builder 📦</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
