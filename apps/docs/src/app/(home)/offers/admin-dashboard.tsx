"use client";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";

export const AdminDashboardOffer = ({ isHovering }: { isHovering: boolean }) => {
  const clear = useCallback(() => {}, []);

  const restartAnimation = useCallback(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (isHovering) {
      restartAnimation();
    }

    return () => {
      clear();
    };
  }, [isHovering, clear, restartAnimation]);

  return (
    <div
      className={cn(
        "w-full h-full p-5 select-none transition-opacity duration-150 ease-in-out relative overflow-hidden flex just items-center",
        !isHovering && "opacity-90"
      )}
    >
        <div className="w-[80%] h-[80%] bg-gradient-to-br from-fd-border/50 to-fd-border/20 rounded-lg"></div>
    </div>
  );
};
